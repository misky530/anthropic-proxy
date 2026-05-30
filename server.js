/**
 * Anthropic → OpenAI 协议适配代理
 * 
 * 用途：让 Claude Code 能够对接 OpenAI 兼容的模型网关
 * 支持：非流式响应 + SSE 流式响应（Claude Code 主要用流式）
 * 
 * 部署后用户配置：
 *   export ANTHROPIC_BASE_URL=http://你的服务器:3456
 *   export ANTHROPIC_API_KEY=用户在你平台的key
 *   claude
 */

const express = require('express');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');

const app = express();

// ── 配置 ──────────────────────────────────────────────────────────
const CONFIG = {
  // 上游 OpenAI 兼容网关地址
  UPSTREAM_BASE_URL: process.env.UPSTREAM_BASE_URL || 'https://api.deepseek.com',

  // 上游默认使用的 API Key（如果你想统一用自己的 key 而不是透传用户 key）
  // 留空则透传用户发来的 key
  UPSTREAM_API_KEY: process.env.UPSTREAM_API_KEY || '',

  // 监听端口
  PORT: parseInt(process.env.PORT || '3456'),

  // 模型名称映射表：Anthropic 模型名 → 上游实际模型名
  MODEL_MAP: {
    // Claude 官方模型名 → 你平台对应的模型
    'claude-opus-4-5':          process.env.MODEL_CLAUDE_OPUS    || 'claude-opus-4-5',
    'claude-opus-4-0':          process.env.MODEL_CLAUDE_OPUS    || 'claude-opus-4-5',
    'claude-sonnet-4-5':        process.env.MODEL_CLAUDE_SONNET  || 'claude-sonnet-4-5',
    'claude-sonnet-4-6':        process.env.MODEL_CLAUDE_SONNET  || 'claude-sonnet-4-5',
    'claude-haiku-4-5':         process.env.MODEL_CLAUDE_HAIKU   || 'claude-haiku-4-5-20251001',
    // 如果用户直接写 deepseek 或 qwen，也透传
    'deepseek-v3.2':            'deepseek-v3.2',
    'qwen3-coder-next':         'qwen3-coder-next',
  },

  // 未匹配时的默认模型（视频第三集里演示的主角）
  DEFAULT_MODEL: process.env.DEFAULT_MODEL || 'deepseek-v3.2',

  // 是否打印请求日志（调试用，生产环境建议关闭）
  DEBUG: process.env.DEBUG === 'true',
};

// ── 工具函数 ──────────────────────────────────────────────────────
function log(...args) {
  if (CONFIG.DEBUG) console.log('[proxy]', new Date().toISOString(), ...args);
}

function genId(prefix = 'msg') {
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Anthropic messages 请求 → OpenAI chat/completions 请求
 */
function anthropicToOpenAI(anthropicBody) {
  const { model, messages, max_tokens, system, temperature, top_p, stream } = anthropicBody;

  // 解析 system prompt（Anthropic 里是独立字段，OpenAI 是 role=system 消息）
  const openaiMessages = [];

  if (system) {
    // system 可能是字符串或 ContentBlock 数组
    const systemText = typeof system === 'string'
      ? system
      : system.map(b => b.text || '').join('');
    openaiMessages.push({ role: 'system', content: systemText });
  }

  // 转换 messages
  // 关键：过滤掉 thinking 相关内容块
  // Claude Desktop Code 标签会在多轮对话中把 thinking 块带回来
  // DeepSeek 不支持这个字段，会报 400 错误
  for (const msg of messages) {
    if (typeof msg.content === 'string') {
      openaiMessages.push({ role: msg.role, content: msg.content });
    } else if (Array.isArray(msg.content)) {
      // 过滤掉 thinking / redacted_thinking 块
      // Claude Desktop Code 标签会把这些块带回多轮对话，DeepSeek 不支持
      const filtered = msg.content.filter(
        b => b.type !== 'thinking' && b.type !== 'redacted_thinking'
      );

      // 只取 text 块拼接
      const textParts = filtered
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      // tool_use 块：转成文字描述（简单降级）
      const toolParts = filtered
        .filter(b => b.type === 'tool_use')
        .map(b => `[Tool: ${b.name}, Input: ${JSON.stringify(b.input)}]`)
        .join('\n');

      const content = [textParts, toolParts].filter(Boolean).join('\n') || '[content]';
      openaiMessages.push({ role: msg.role, content });
    }
  }

  // 模型名映射
  const resolvedModel = CONFIG.MODEL_MAP[model] || CONFIG.DEFAULT_MODEL;
  log(`model: ${model} → ${resolvedModel}`);

  const openaiBody = {
    model: resolvedModel,
    messages: openaiMessages,
    max_tokens: max_tokens || 8192,
    stream: stream || false,
  };

  if (temperature !== undefined) openaiBody.temperature = temperature;
  if (top_p !== undefined) openaiBody.top_p = top_p;

  return openaiBody;
}

/**
 * 请求预处理：去掉 Anthropic 特有字段，防止转发给 OpenAI 时报错
 */
function sanitizeAnthropicRequest(body) {
  // 去掉 thinking 配置（betas 里的 interleaved-thinking 等）
  const cleaned = { ...body };
  delete cleaned.thinking;
  delete cleaned.betas;
  // 去掉 top_k（OpenAI 不支持）
  delete cleaned.top_k;
  return cleaned;
}

/**
 * OpenAI 响应 → Anthropic 响应（非流式）
 */
function openAIToAnthropic(openaiResp, originalModel) {
  const choice = openaiResp.choices?.[0];
  const text = choice?.message?.content || '';
  const stopReason = choice?.finish_reason === 'stop' ? 'end_turn' : 'max_tokens';

  return {
    id: openaiResp.id || genId('msg'),
    type: 'message',
    role: 'assistant',
    model: originalModel,
    content: [{ type: 'text', text }],
    stop_reason: stopReason,
    stop_sequence: null,
    usage: {
      input_tokens: openaiResp.usage?.prompt_tokens || 0,
      output_tokens: openaiResp.usage?.completion_tokens || 0,
    },
  };
}

/**
 * 向上游发送请求（返回 Promise<{statusCode, headers, body/stream}>）
 */
function upstreamRequest(path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const base = new URL(CONFIG.UPSTREAM_BASE_URL);
    const url = new URL(path, base.origin + base.pathname.replace(/\/$/, '') + '/');
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const payload = JSON.stringify(body);
    const reqHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${CONFIG.UPSTREAM_API_KEY || headers['x-api-key'] || headers['authorization']?.replace('Bearer ', '') || ''}`,
      'User-Agent': 'anthropic-proxy/1.0',
    };

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: reqHeaders,
    };

    log(`→ upstream ${method} ${url.href}`);

    const req = lib.request(options, (res) => {
      resolve(res);
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── 中间件 ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// CORS（允许本地 Claude Code 调用）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version, anthropic-beta');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── 路由 ──────────────────────────────────────────────────────────

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', upstream: CONFIG.UPSTREAM_BASE_URL, version: '1.1.0' });
});

// Claude Desktop 第三方推理认证验证接口
// 不实现这个接口会显示 "Couldn't sign in to Gateway"
app.get('/v1/auth/validate', (req, res) => res.json({ valid: true }));
app.post('/v1/auth/validate', (req, res) => res.json({ valid: true }));

// 模拟 Anthropic models 列表（Claude Code 启动时会查询）
app.get('/v1/models', (req, res) => {
  const models = Object.keys(CONFIG.MODEL_MAP).map(id => ({
    type: 'model',
    id,
    display_name: id,
    created_at: '2024-01-01T00:00:00Z',
  }));
  res.json({ data: models });
});

// 核心：/v1/messages 端点
app.post("/v1/messages", async (req, res) => {
  // 先清理 Anthropic 特有字段（thinking、betas、top_k 等）
  const anthropicBody = sanitizeAnthropicRequest(req.body);
  const isStream = anthropicBody.stream === true;

  log(`← /v1/messages model=${anthropicBody.model} stream=${isStream}`);

  try {
    const openaiBody = anthropicToOpenAI(anthropicBody);
    const upstreamRes = await upstreamRequest(
      'chat/completions',
      'POST',
      req.headers,
      openaiBody
    );

    log(`→ upstream status ${upstreamRes.statusCode}`);

    // 上游出错，直接透传错误
    if (upstreamRes.statusCode >= 400) {
      let errBody = '';
      for await (const chunk of upstreamRes) errBody += chunk;
      res.status(upstreamRes.statusCode).json({
        type: 'error',
        error: { type: 'api_error', message: errBody },
      });
      return;
    }

    // ── 流式响应 ──────────────────────────────────────────────────
    if (isStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const msgId = genId('msg');
      const originalModel = anthropicBody.model;

      // 1. message_start
      res.write(`event: message_start\ndata: ${JSON.stringify({
        type: 'message_start',
        message: {
          id: msgId, type: 'message', role: 'assistant', model: originalModel,
          content: [], stop_reason: null, stop_sequence: null,
          usage: { input_tokens: 0, output_tokens: 0 },
        },
      })}\n\n`);

      // 2. content_block_start
      res.write(`event: content_block_start\ndata: ${JSON.stringify({
        type: 'content_block_start', index: 0,
        content_block: { type: 'text', text: '' },
      })}\n\n`);

      // 3. ping
      res.write(`event: ping\ndata: ${JSON.stringify({ type: 'ping' })}\n\n`);

      // 解析上游 SSE 流
      let buffer = '';
      let outputTokens = 0;
      let inputTokens = 0;

      upstreamRes.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop(); // 保留不完整的最后一行

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            const finishReason = parsed.choices?.[0]?.finish_reason;

            // 累计 token 数（部分网关在每个 chunk 里都有 usage）
            if (parsed.usage) {
              inputTokens = parsed.usage.prompt_tokens || inputTokens;
              outputTokens = parsed.usage.completion_tokens || outputTokens;
            }

            if (delta?.content) {
              outputTokens++;
              res.write(`event: content_block_delta\ndata: ${JSON.stringify({
                type: 'content_block_delta', index: 0,
                delta: { type: 'text_delta', text: delta.content },
              })}\n\n`);
            }

            if (finishReason) {
              const stopReason = finishReason === 'stop' ? 'end_turn' : 'max_tokens';

              // content_block_stop
              res.write(`event: content_block_stop\ndata: ${JSON.stringify({
                type: 'content_block_stop', index: 0,
              })}\n\n`);

              // message_delta（含 stop_reason 和 usage）
              res.write(`event: message_delta\ndata: ${JSON.stringify({
                type: 'message_delta',
                delta: { stop_reason: stopReason, stop_sequence: null },
                usage: { output_tokens: outputTokens },
              })}\n\n`);

              // message_stop
              res.write(`event: message_stop\ndata: ${JSON.stringify({
                type: 'message_stop',
              })}\n\n`);
            }
          } catch (_) {
            // JSON 解析失败，跳过
          }
        }
      });

      upstreamRes.on('end', () => {
        res.end();
      });

      upstreamRes.on('error', (err) => {
        log('upstream stream error:', err.message);
        res.end();
      });

      req.on('close', () => {
        upstreamRes.destroy();
      });

    // ── 非流式响应 ────────────────────────────────────────────────
    } else {
      let body = '';
      for await (const chunk of upstreamRes) body += chunk;
      const openaiResp = JSON.parse(body);
      const anthropicResp = openAIToAnthropic(openaiResp, anthropicBody.model);
      res.json(anthropicResp);
    }

  } catch (err) {
    console.error('[proxy] error:', err.message);
    res.status(500).json({
      type: 'error',
      error: { type: 'api_error', message: err.message },
    });
  }
});

// ── 启动 ──────────────────────────────────────────────────────────
app.listen(CONFIG.PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║     Anthropic → OpenAI 协议代理已启动      ║
╠════════════════════════════════════════════╣
║  监听地址: http://0.0.0.0:${CONFIG.PORT}           ║
║  上游网关: ${CONFIG.UPSTREAM_BASE_URL.padEnd(34)}║
║  默认模型: ${CONFIG.DEFAULT_MODEL.padEnd(34)}║
╚════════════════════════════════════════════╝

用户配置方式：
  export ANTHROPIC_BASE_URL=http://[本机IP]:${CONFIG.PORT}
  export ANTHROPIC_API_KEY=[用户在平台的key]
  claude
`);
});

#!/bin/bash
# 测试代理是否正常工作
PROXY_URL="${1:-http://localhost:3456}"
API_KEY="${2:-test-key}"

echo "=== 测试代理: $PROXY_URL ==="
echo ""

echo "1. 健康检查..."
curl -s "$PROXY_URL/health" | python3 -m json.tool 2>/dev/null || curl -s "$PROXY_URL/health"
echo ""

echo "2. 测试非流式请求..."
curl -s -X POST "$PROXY_URL/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "只回复\"代理正常\"四个字"}]
  }' | python3 -m json.tool 2>/dev/null
echo ""

echo "3. 测试流式请求..."
curl -s -X POST "$PROXY_URL/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 100,
    "stream": true,
    "messages": [{"role": "user", "content": "只回复ok"}]
  }'
echo ""
echo "=== 测试完成 ==="

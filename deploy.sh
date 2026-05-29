#!/bin/bash
# 一键部署脚本（在你的服务器上执行）
set -e

echo "=== Anthropic Proxy 部署 ==="

# 检查 Node.js
if ! command -v node &>/dev/null; then
  echo "安装 Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "Node.js 版本: $(node -v)"

# 安装依赖
npm install --production

# 用 PM2 管理进程（推荐生产环境）
if command -v pm2 &>/dev/null; then
  pm2 start server.js --name anthropic-proxy --update-env
  pm2 save
  echo "已用 PM2 启动"
else
  # 没有 PM2，用 nohup 启动
  nohup node server.js > proxy.log 2>&1 &
  echo "PID: $!"
  echo "已后台启动，日志：proxy.log"
fi

echo ""
echo "健康检查："
sleep 2
curl -s http://localhost:3456/health | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>console.log(JSON.parse(d)))"

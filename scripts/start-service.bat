@echo off
cd /d "%~dp0.."
echo 启动个人工作站服务...
echo 访问地址: http://localhost:18080
npx http-server . -p 18080 -c-1

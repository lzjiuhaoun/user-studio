@echo off
echo 停止个人工作站服务...
taskkill /F /IM node.exe 2>nul
echo 服务已停止。

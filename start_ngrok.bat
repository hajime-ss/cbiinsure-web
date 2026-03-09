@echo off
echo =========================================
echo   Starting NGROK Tunnels
echo =========================================
echo Note: You need a paid NGROK account to run two tunnels simultaneously. 
echo If you have a free NGROK account, one of these may fail.
echo.
echo Make sure NGROK is installed and added to your PATH before running this.
echo.

echo Starting NGROK for Frontend (Port 5173)...
start cmd /k "ngrok http 5173"

echo Starting NGROK for Backend (Port 3000)...
start cmd /k "ngrok http 3000"

echo Done! Check the command prompt windows for your ngrok URLs.

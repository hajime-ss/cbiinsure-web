@echo off
echo =========================================
echo   Starting CBIINSURE Local Environment
echo =========================================

echo Starting Backend Server (Port 3000)...
start cmd /k "cd server && node index.js"

echo Starting Frontend Client (Port 5173)...
start cmd /k "cd client && npm run dev"

echo Done! The server and client are starting in separate windows.

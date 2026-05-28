@echo off
:: Force the script to run in its own folder
cd /d "%~dp0"

:: Kill any existing background processes that might be hogging ports
taskkill /IM node.exe /F 2>nul

echo Starting Backend...
cd backend
start "Backend" cmd /k "node server.js"
cd ..

echo Waiting for backend to bind to port 5000...
timeout /t 10

echo Starting Frontend...
cd frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo IF THE SITE DOES NOT LOAD: 
echo Look at the two black windows that just opened. 
echo One of them will show an error message in red/white.
echo ========================================================
pause
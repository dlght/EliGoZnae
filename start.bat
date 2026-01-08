@echo off
echo.
echo 🎯 EliGoZnae - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🚀 Starting development server...
    echo Your app will open at http://localhost:3000
    echo.
    call npm run dev
) else (
    echo.
    echo ❌ Installation failed. Please check the error messages above.
    pause
    exit /b 1
)

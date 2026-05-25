@echo off
setlocal

echo.
echo === AI Engineer App: Build Standalone ===
echo.

if exist node_modules goto build
echo [1/2] Installing dependencies (first run only, takes 3-5 min)...
call npm install
if errorlevel 1 goto fail_install
goto build

:build
echo [2/2] Building static version to ./out ...
call npm run build
if errorlevel 1 goto fail_build

echo.
echo === Build complete ===
echo.
echo Output folder: %CD%\out
echo.
echo Next steps:
echo   - Run locally now:    npm run preview
echo   - Move to another PC: copy "out" folder + run-anywhere.bat
echo   - Publish online:     drag "out" folder to https://app.netlify.com/drop
echo.
pause
exit /b 0

:fail_install
echo.
echo ERROR: npm install failed.
echo Possible reasons:
echo   1. Node.js is not installed. Install LTS: https://nodejs.org/
echo   2. PowerShell execution policy. Run in PowerShell:
echo      Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
echo.
pause
exit /b 1

:fail_build
echo.
echo ERROR: build failed. Check the output above.
echo.
pause
exit /b 1

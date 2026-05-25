@echo off
setlocal

if not exist out goto missing

echo.
echo Starting AI Engineer App at http://localhost:3000
echo Press Ctrl+C or close this window to stop.
echo.

call npx --yes serve@latest out -l 3000
exit /b 0

:missing
echo.
echo ERROR: folder "out" not found next to this script.
echo.
echo Build the app first:
echo   1. Open the project folder in this Windows machine
echo   2. Double-click build-standalone.bat
echo   3. Copy the resulting "out" folder + this script to wherever you need
echo.
pause
exit /b 1

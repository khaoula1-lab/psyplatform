@echo off
echo ================================================
echo   ARRET DE LA PLATEFORME PSYPLATFORM
echo ================================================
echo.

echo Arret des serveurs Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Plateforme arretee avec succes!
echo.
pause

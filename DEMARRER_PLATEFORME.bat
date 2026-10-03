@echo off
echo ================================================
echo   DEMARRAGE DE LA PLATEFORME PSYPLATFORM
echo ================================================
echo.

REM Verification de Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Installez Node.js depuis https://nodejs.org/
    pause
    exit
)

echo [1/2] Demarrage du BACKEND...
echo.
start "PsyPlatform Backend" cmd /k "cd backend && npm start"

echo Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Demarrage du FRONTEND...
echo.
start "PsyPlatform Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ================================================
echo   PLATEFORME EN COURS DE DEMARRAGE
echo ================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Deux fenetres vont s'ouvrir:
echo - Backend (port 5000)
echo - Frontend (port 3000)
echo.
echo Attendez quelques secondes puis ouvrez:
echo http://localhost:3000
echo.
echo IMPORTANT: Ne fermez PAS les fenetres qui s'ouvrent!
echo.
pause

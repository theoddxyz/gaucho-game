@echo off
chcp 65001 >nul
title GAUCHO - Servidor Local

echo.
echo  ══════════════════════════════════════════
echo       GAUCHO  —  Servidor Local (LAN)
echo  ══════════════════════════════════════════
echo.

:: Buscar IP de Tailscale
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "tailscale" /A') do (
    set _FOUND_TS=1
)

echo  [Tu IP de Tailscale]
powershell -NoProfile -Command "Get-NetIPAddress -InterfaceAlias 'Tailscale' -AddressFamily IPv4 2>$null | Select-Object -ExpandProperty IPAddress | ForEach-Object { Write-Host '  http://' $_ ':3000   <-- el otro jugador abre ESTO' -NoNewline; Write-Host '' }"

echo.
echo  [Tu IP local (misma red WiFi)]
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set _IP=%%i
    setlocal enabledelayedexpansion
    set _IP=!_IP: =!
    echo    http://!_IP!:3000
    endlocal
)

echo.
echo  Iniciando servidor...
echo  (Cerrá esta ventana para apagar el servidor)
echo.
echo  ══════════════════════════════════════════
echo.

node --env-file=.env server.js

pause

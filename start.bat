@echo off
title Catalog Paket Brosur - PT. Fath Indah Travel Service
echo ================================================================
echo  Menjalankan Catalog Paket Brosur PT. Fath Indah Travel Service
echo  URL: http://localhost:3000
echo ================================================================
cd /d "%~dp0"
start "" http://localhost:3000
node server.js
pause


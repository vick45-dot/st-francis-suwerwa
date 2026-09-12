@echo off
REM ============================================================
REM  Local preview for the St. Francis website.
REM  Double-click this file, then open http://localhost:8000
REM
REM  The site also works by opening index.html directly, but the
REM  content manager at /admin/ needs a server to run.
REM ============================================================

echo.
echo   Starting local preview server...
echo.
echo   Website          ^>  http://localhost:8000
echo   Content manager  ^>  http://localhost:8000/admin/
echo   Offline dashboard^>  http://localhost:8000/dashboard/
echo.
echo   Press Ctrl+C to stop.
echo.

where python >nul 2>nul
if %errorlevel%==0 ( start "" http://localhost:8000 & python -m http.server 8000 & goto :eof )
where py >nul 2>nul
if %errorlevel%==0 ( start "" http://localhost:8000 & py -m http.server 8000 & goto :eof )
where npx >nul 2>nul
if %errorlevel%==0 ( start "" http://localhost:8000 & npx --yes serve -l 8000 . & goto :eof )

echo   Neither Python nor Node.js was found on this machine.
echo   Install Python from python.org, then run this file again.
echo.
pause

@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul

echo.
echo ============================================
echo   BUILD - Porto Cabral
echo ============================================

set ROOT=%~dp0
set FRONTEND_DIR=%ROOT%frontend
set BACKEND_DIR=%ROOT%backend
set STATIC_DIR=%BACKEND_DIR%\src\main\resources\static
set ANGULAR_DIST=%FRONTEND_DIR%\dist\porto-cabral-frontend\browser

:: ---- 1. Build do Frontend Angular ----
echo.
echo [1/3] Compilando frontend Angular (producao)...
cd /d "%FRONTEND_DIR%"
call npm run build -- --configuration production
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha no build do frontend. Verifique se o Node.js esta instalado.
    pause
    exit /b 1
)

:: ---- 2. Copiar frontend para os recursos estaticos do backend ----
echo.
echo [2/3] Copiando arquivos do frontend para o backend...
if exist "%STATIC_DIR%" rmdir /s /q "%STATIC_DIR%"
mkdir "%STATIC_DIR%"

if not exist "%ANGULAR_DIST%" (
    echo ERRO: Pasta de saida do Angular nao encontrada: %ANGULAR_DIST%
    pause
    exit /b 1
)

xcopy /e /i /q /y "%ANGULAR_DIST%\*" "%STATIC_DIR%\"
if %errorlevel% neq 0 (
    echo ERRO: Falha ao copiar arquivos do frontend.
    pause
    exit /b 1
)
echo Arquivos copiados com sucesso para: %STATIC_DIR%

:: ---- 3. Build do Backend Spring Boot ----
echo.
echo [3/3] Compilando backend Spring Boot (pode demorar alguns minutos)...
cd /d "%BACKEND_DIR%"
call mvnw.cmd package -DskipTests
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha no build do backend. Verifique se o Java 25 esta instalado.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   BUILD CONCLUIDO COM SUCESSO!
echo ============================================
echo.
echo JAR gerado: backend\target\backend-0.0.1-SNAPSHOT.jar
echo.
echo Proximo passo: gerar o instalador
echo   1. Instale o Inno Setup 6 (https://jrsoftware.org/isdl.php)
echo   2. Abra o arquivo: installer\setup.iss
echo   3. Clique em "Compile" (Ctrl+F9)
echo   4. O instalador sera gerado em: dist\PortoCabral-Instalador.exe
echo.
pause

@echo off
echo 🚀 Iniciando setup do backend SEAD...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado. Instale o Python 3.8+ primeiro.
    pause
    exit /b 1
)

echo ✅ Python encontrado

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker não encontrado. Você precisará configurar PostgreSQL manualmente.
) else (
    echo ✅ Docker encontrado
)

echo.
echo 📦 Criando ambiente virtual...
python -m venv venv

echo 🔧 Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo 📥 Instalando dependências...
pip install -r requirements.txt

if exist .env (
    echo ✅ Arquivo .env já existe
) else (
    echo 📝 Criando arquivo .env...
    copy .env.example .env
    echo ⚠️  Configure as variáveis no arquivo .env antes de continuar
)

echo.
echo 🐳 Subindo banco de dados com Docker...
docker-compose up -d postgres

REM Aguardar um pouco para o banco subir
echo ⏳ Aguardando banco de dados inicializar...
timeout /t 10 /nobreak >nul

echo 🗃️  Criando tabelas no banco...
python -c "from database import engine, Base; from models import *; Base.metadata.create_all(bind=engine); print('Tabelas criadas com sucesso!')"

echo.
echo ✅ Setup concluído!
echo.
echo 🚀 Para iniciar o servidor:
echo    python main.py
echo.
echo 📚 Documentação da API:
echo    http://localhost:8000/docs
echo.
echo 🧪 Para testar a API:
echo    python test_api.py
echo.

pause

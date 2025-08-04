# Scripts úteis para desenvolvimento

# Ativar ambiente virtual
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Subir banco de dados com Docker
docker-compose up -d postgres

# Verificar status do Docker
docker-compose ps

# Executar servidor de desenvolvimento
python main.py

# Ou com uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Criar migração
alembic revision --autogenerate -m "Descrição da migração"

# Aplicar migrações
alembic upgrade head

# Reverter última migração
alembic downgrade -1

# Ver histórico de migrações
alembic history

# Parar containers
docker-compose down

# Resetar banco de dados (cuidado!)
docker-compose down -v

# Ver logs do banco
docker-compose logs postgres

# Conectar ao banco via psql
docker exec -it sead_postgres psql -U usuario -d sead_eventos

# SEAD - Calendário de Eventos - Backend

API desenvolvida com FastAPI e PostgreSQL para gerenciamento de calendário de eventos da SEAD.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Gerenciador de migrações
- **Pydantic** - Validação de dados
- **Docker** - Containerização (opcional)

## 📋 Pré-requisitos

- Python 3.8+
- PostgreSQL 12+
- pip (gerenciador de pacotes Python)

## 🔧 Instalação e Configuração

### 1. Configurar o ambiente virtual

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Ativar ambiente virtual (Linux/Mac)
source venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar banco de dados

#### Opção A: PostgreSQL Local

1. Instale o PostgreSQL
2. Crie um banco de dados:
```sql
CREATE DATABASE sead_eventos;
CREATE USER usuario WITH PASSWORD 'senha';
GRANT ALL PRIVILEGES ON DATABASE sead_eventos TO usuario;
```

#### Opção B: Docker (Recomendado)

```bash
# Subir o banco de dados
docker-compose up -d postgres

# Verificar se está funcionando
docker-compose ps
```

### 4. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar as configurações no arquivo .env
```

### 5. Executar migrações (opcional)

```bash
# Inicializar Alembic (apenas na primeira vez)
alembic init alembic

# Criar migração
alembic revision --autogenerate -m "Tabelas iniciais"

# Aplicar migrações
alembic upgrade head
```

## 🚀 Executando a aplicação

### Desenvolvimento

```bash
# Executar o servidor de desenvolvimento
python main.py

# Ou usando uvicorn diretamente
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Produção

```bash
# Executar em produção
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🛠️ Endpoints Principais

### Eventos

- `POST /api/eventos` - Submeter formulário completo
- `GET /api/eventos` - Listar todos os eventos
- `GET /api/eventos/{id}` - Buscar evento por ID
- `PUT /api/eventos/{id}` - Atualizar evento
- `DELETE /api/eventos/{id}` - Deletar evento

### Unidades

- `GET /api/unidades` - Listar todas as unidades
- `GET /api/unidades/{id}` - Buscar unidade por ID
- `DELETE /api/unidades/{id}` - Deletar unidade

### Saúde

- `GET /api/health` - Verificar saúde da API

## 📝 Estrutura do Projeto

```
backend/
├── main.py              # Arquivo principal da aplicação
├── config.py            # Configurações da aplicação
├── database.py          # Configuração do banco de dados
├── models.py            # Modelos SQLAlchemy
├── schemas.py           # Schemas Pydantic
├── services.py          # Lógica de negócio
├── routes.py            # Rotas da API
├── requirements.txt     # Dependências Python
├── .env                 # Variáveis de ambiente
├── docker-compose.yml   # Docker Compose para desenvolvimento
├── alembic.ini          # Configuração do Alembic
└── alembic/             # Migrações do banco
    ├── env.py
    ├── script.py.mako
    └── versions/
```

## 🔒 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | `postgresql://usuario:senha@localhost:5432/sead_eventos` |
| `SECRET_KEY` | Chave secreta da aplicação | `sua_chave_secreta_aqui` |
| `DEBUG` | Modo debug | `True` |
| `CORS_ORIGINS` | Origens permitidas para CORS | `http://localhost:5173` |

## 🐳 Docker

### Subir apenas o banco de dados

```bash
docker-compose up -d postgres
```

### Subir banco + PgAdmin

```bash
docker-compose up -d
```

**PgAdmin**: http://localhost:5050
- Email: admin@sead.com
- Senha: admin123

### Conectar ao banco via PgAdmin

- Host: postgres (ou localhost se rodando local)
- Porta: 5432
- Database: sead_eventos
- Username: usuario
- Password: senha

## 🧪 Testando a API

### Teste básico de saúde

```bash
curl http://localhost:8000/api/health
```

### Submeter formulário

```bash
curl -X POST "http://localhost:8000/api/eventos" \
     -H "Content-Type: application/json" \
     -d '{
       "nome_unidade": "Exemplo Unidade",
       "eventos": [
         {
           "nome": "Evento Teste",
           "unidade_responsavel": "Exemplo Unidade",
           "quantidade_pessoas": 50,
           "mes_previsto": "Janeiro",
           "coffee_break_manha": true,
           "almoco": true
         }
       ]
     }'
```

## 🔧 Desenvolvimento

### Estrutura de resposta da API

Todas as respostas seguem o padrão:

```json
{
  "success": boolean,
  "message": "string",
  "data": object,
  "errors": object
}
```

### Códigos de status HTTP

- `200` - Sucesso
- `201` - Criado
- `400` - Erro de validação
- `404` - Não encontrado
- `500` - Erro interno

## 📦 Dependências Principais

- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `sqlalchemy` - ORM
- `psycopg2-binary` - Driver PostgreSQL
- `alembic` - Migrações
- `python-dotenv` - Carregamento de .env
- `pydantic` - Validação de dados

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

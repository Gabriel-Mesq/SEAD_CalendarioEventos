-- Script de inicialização do banco de dados
-- Este script será executado automaticamente pelo Docker

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Comentários sobre as tabelas que serão criadas pelo SQLAlchemy
COMMENT ON SCHEMA public IS 'Schema principal para o sistema SEAD de calendário de eventos';

-- O SQLAlchemy criará as tabelas automaticamente baseado nos modelos

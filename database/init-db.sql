-- Criar bancos se não existirem
CREATE DATABASE IF NOT EXISTS betalent_db;
CREATE DATABASE IF NOT EXISTS betalent_db_test;

-- Garantir que o usuário tenha acesso total a ambos os bancos
GRANT ALL PRIVILEGES ON betalent_db.* TO 'betalent_user'@'%';
GRANT ALL PRIVILEGES ON betalent_db_test.* TO 'betalent_user'@'%';

-- Reforçar permissões globais para evitar erros de criação de tabelas temporárias
GRANT ALL PRIVILEGES ON *.* TO 'betalent_user'@'%';

FLUSH PRIVILEGES;

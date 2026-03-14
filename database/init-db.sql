CREATE DATABASE IF NOT EXISTS betalent_db;
CREATE DATABASE IF NOT EXISTS betalent_db_test;
GRANT ALL PRIVILEGES ON betalent_db.* TO 'betalent_user'@'%';
GRANT ALL PRIVILEGES ON betalent_db_test.* TO 'betalent_user'@'%';
FLUSH PRIVILEGES;

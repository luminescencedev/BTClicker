CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username Varchar(20) UNIQUE NOT NULL,
    password Varchar(255) NOT NULL,
    progression JSONB
);
DROP DATABASE IF EXISTS booknotes;

CREATE DATABASE booknotes;

\c booknotes

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE,
    title VARCHAR(50),
    author VARCHAR(50),
    rating INTEGER,
    review TEXT,
    date_read DATE
);

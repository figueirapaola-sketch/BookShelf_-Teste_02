const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(__dirname, 'bookshelf.db');
const db = new DatabaseSync(dbPath);

// Initialize schema (Sem dados mocados)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'author', -- 'author' | 'professor' | 'admin'
    bio TEXT,
    avatar TEXT,
    institution TEXT, -- Escola, ETEC, universidade ou cargo
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    author_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    genre TEXT NOT NULL,
    synopsis TEXT,
    cover_image TEXT,
    isbn TEXT,
    publisher TEXT,
    city TEXT,
    year TEXT,
    dedication TEXT,
    epigraph TEXT,
    epigraph_author TEXT,
    foreword TEXT,
    afterword TEXT,
    about_author TEXT,
    is_template INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    order_num INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    illustrations TEXT, -- JSON string array of { id, url, caption, position }
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    opinion_type TEXT NOT NULL, -- 'concordo' | 'discordo' | 'reflexao'
    cover_image TEXT,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    opinion_type TEXT DEFAULT 'concordo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log('✅ Banco de dados conectado com esquema limpo (sem dados mocados).');

module.exports = db;

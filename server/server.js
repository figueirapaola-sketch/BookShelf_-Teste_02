const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// ==========================================
// AUTH & USERS ROUTES
// ==========================================

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass });
});

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role = 'author', bio = '', avatar = '', institution = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    // Validate allowed roles
    const validRoles = ['author', 'professor', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'author';

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema.' });
    }

    const defaultAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role, bio, avatar, institution)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, password, userRole, bio, defaultAvatar, institution);

    const newUser = db.prepare('SELECT id, name, email, role, bio, avatar, institution, created_at FROM users WHERE id = ?').get(Number(result.lastInsertRowid));
    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: err.message || 'Erro interno ao salvar cadastro.' });
  }
});

// List Authors & Members
app.get('/api/users', (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.bio, u.avatar, u.institution, u.created_at,
           (SELECT COUNT(*) FROM books WHERE author_id = u.id) as books_count,
           (SELECT COUNT(*) FROM articles WHERE author_id = u.id) as articles_count
    FROM users u
    ORDER BY u.created_at DESC
  `).all();
  res.json(users);
});

// Get User Profile with their books and articles
app.get('/api/users/:id', (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, bio, avatar, institution, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const books = db.prepare('SELECT * FROM books WHERE author_id = ? ORDER BY created_at DESC').all(user.id);
  const articles = db.prepare('SELECT * FROM articles WHERE author_id = ? ORDER BY created_at DESC').all(user.id);

  res.json({
    ...user,
    books,
    articles
  });
});

// Update Profile
app.put('/api/users/:id', (req, res) => {
  const { name, bio, avatar, institution, role } = req.body;
  const userId = req.params.id;

  db.prepare(`
    UPDATE users
    SET name = COALESCE(?, name),
        bio = COALESCE(?, bio),
        avatar = COALESCE(?, avatar),
        institution = COALESCE(?, institution),
        role = COALESCE(?, role)
    WHERE id = ?
  `).run(name, bio, avatar, institution, role, userId);

  if (name) {
    db.prepare('UPDATE books SET author_name = ? WHERE author_id = ?').run(name, userId);
    db.prepare('UPDATE articles SET author_name = ? WHERE author_id = ?').run(name, userId);
  }

  const updatedUser = db.prepare('SELECT id, name, email, role, bio, avatar, institution, created_at FROM users WHERE id = ?').get(userId);
  res.json({ user: updatedUser });
});

// Delete Profile (Admin only or user self-deletion)
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Delete cascade
  db.prepare('DELETE FROM comments WHERE user_id = ?').run(userId);
  db.prepare('DELETE FROM chapters WHERE book_id IN (SELECT id FROM books WHERE author_id = ?)').run(userId);
  db.prepare('DELETE FROM books WHERE author_id = ?').run(userId);
  db.prepare('DELETE FROM articles WHERE author_id = ?').run(userId);
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);

  res.json({ message: 'Perfil e todas as publicações excluídos com sucesso.' });
});

// ==========================================
// BOOKS ROUTES
// ==========================================

// Get all books
app.get('/api/books', (req, res) => {
  const { search, genre, template } = req.query;
  let query = 'SELECT b.*, (SELECT COUNT(*) FROM chapters WHERE book_id = b.id) as chapters_count FROM books b WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (b.title LIKE ? OR b.author_name LIKE ? OR b.synopsis LIKE ?)';
    const searchVal = `%${search}%`;
    params.push(searchVal, searchVal, searchVal);
  }

  if (genre && genre !== 'Todos') {
    query += ' AND b.genre = ?';
    params.push(genre);
  }

  if (template === 'true') {
    query += ' AND b.is_template = 1';
  }

  query += ' ORDER BY b.created_at DESC';

  const books = db.prepare(query).all(...params);
  res.json(books);
});

// Get single book with chapters
app.get('/api/books/:id', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Livro não encontrado.' });
  }

  // Increment view
  db.prepare('UPDATE books SET views = views + 1 WHERE id = ?').run(book.id);

  const chapters = db.prepare('SELECT * FROM chapters WHERE book_id = ? ORDER BY order_num ASC').all(book.id);

  // Parse illustrations JSON safely
  const parsedChapters = chapters.map(ch => {
    let illustrations = [];
    try {
      illustrations = ch.illustrations ? JSON.parse(ch.illustrations) : [];
    } catch {
      illustrations = [];
    }
    return { ...ch, illustrations };
  });

  res.json({
    ...book,
    chapters: parsedChapters
  });
});

// Create new book
app.post('/api/books', (req, res) => {
  const {
    title, subtitle, author_id, genre, synopsis, cover_image,
    isbn, publisher, city, year, dedication, epigraph, epigraph_author,
    foreword, afterword, about_author, chapters = []
  } = req.body;

  if (!title || !author_id) {
    return res.status(400).json({ error: 'Título e autor são obrigatórios.' });
  }

  const author = db.prepare('SELECT name FROM users WHERE id = ?').get(author_id);
  if (!author) {
    return res.status(404).json({ error: 'Autor não encontrado.' });
  }

  const defaultCover = cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80';

  const result = db.prepare(`
    INSERT INTO books (
      title, subtitle, author_id, author_name, genre, synopsis, cover_image,
      isbn, publisher, city, year, dedication, epigraph, epigraph_author,
      foreword, afterword, about_author
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    subtitle || '',
    author_id,
    author.name,
    genre || 'Literatura Geral',
    synopsis || '',
    defaultCover,
    isbn || '978-65-' + Math.floor(100000 + Math.random() * 900000) + '-0',
    publisher || 'BookShelf Edições',
    city || 'São Paulo - SP',
    year || new Date().getFullYear().toString(),
    dedication || '',
    epigraph || '',
    epigraph_author || '',
    foreword || '',
    afterword || '',
    about_author || ''
  );

  const bookId = Number(result.lastInsertRowid);

  // Insert chapters
  const insertChapter = db.prepare(`
    INSERT INTO chapters (book_id, order_num, title, content, illustrations)
    VALUES (?, ?, ?, ?, ?)
  `);

  if (chapters && chapters.length > 0) {
    chapters.forEach((ch, idx) => {
      const illustrationsJson = typeof ch.illustrations === 'string'
        ? ch.illustrations
        : JSON.stringify(ch.illustrations || []);

      insertChapter.run(
        bookId,
        idx + 1,
        ch.title || `Capítulo ${idx + 1}`,
        ch.content || '',
        illustrationsJson
      );
    });
  } else {
    // Add default chapter 1 if none provided
    insertChapter.run(
      bookId,
      1,
      'Capítulo 1: O Início',
      'Escreva aqui as primeiras linhas da sua história...',
      '[]'
    );
  }

  res.status(201).json({ id: bookId, message: 'Livro criado com sucesso!' });
});

// Update book
app.put('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const {
    title, subtitle, genre, synopsis, cover_image,
    isbn, publisher, city, year, dedication, epigraph, epigraph_author,
    foreword, afterword, about_author, chapters
  } = req.body;

  db.prepare(`
    UPDATE books
    SET title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        genre = COALESCE(?, genre),
        synopsis = COALESCE(?, synopsis),
        cover_image = COALESCE(?, cover_image),
        isbn = COALESCE(?, isbn),
        publisher = COALESCE(?, publisher),
        city = COALESCE(?, city),
        year = COALESCE(?, year),
        dedication = COALESCE(?, dedication),
        epigraph = COALESCE(?, epigraph),
        epigraph_author = COALESCE(?, epigraph_author),
        foreword = COALESCE(?, foreword),
        afterword = COALESCE(?, afterword),
        about_author = COALESCE(?, about_author)
    WHERE id = ?
  `).run(
    title, subtitle, genre, synopsis, cover_image,
    isbn, publisher, city, year, dedication, epigraph, epigraph_author,
    foreword, afterword, about_author, bookId
  );

  // Update chapters if provided
  if (Array.isArray(chapters)) {
    db.prepare('DELETE FROM chapters WHERE book_id = ?').run(bookId);
    const insertChapter = db.prepare(`
      INSERT INTO chapters (book_id, order_num, title, content, illustrations)
      VALUES (?, ?, ?, ?, ?)
    `);

    chapters.forEach((ch, idx) => {
      const illustrationsJson = typeof ch.illustrations === 'string'
        ? ch.illustrations
        : JSON.stringify(ch.illustrations || []);

      insertChapter.run(
        bookId,
        idx + 1,
        ch.title || `Capítulo ${idx + 1}`,
        ch.content || '',
        illustrationsJson
      );
    });
  }

  res.json({ message: 'Livro atualizado com sucesso!' });
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  db.prepare('DELETE FROM chapters WHERE book_id = ?').run(bookId);
  db.prepare('DELETE FROM books WHERE id = ?').run(bookId);
  res.json({ message: 'Livro excluído com sucesso.' });
});

// Like book
app.post('/api/books/:id/like', (req, res) => {
  db.prepare('UPDATE books SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  const updated = db.prepare('SELECT likes FROM books WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// ==========================================
// ARTICLES (ARTIGOS DE OPINIÃO) ROUTES
// ==========================================

// List articles
app.get('/api/articles', (req, res) => {
  const { category, opinion_type, search } = req.query;
  let query = 'SELECT a.*, (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comments_count FROM articles a WHERE 1=1';
  const params = [];

  if (category && category !== 'Todas') {
    query += ' AND a.category = ?';
    params.push(category);
  }

  if (opinion_type && opinion_type !== 'todos') {
    query += ' AND a.opinion_type = ?';
    params.push(opinion_type);
  }

  if (search) {
    query += ' AND (a.title LIKE ? OR a.author_name LIKE ? OR a.content LIKE ?)';
    const searchVal = `%${search}%`;
    params.push(searchVal, searchVal, searchVal);
  }

  query += ' ORDER BY a.created_at DESC';
  const articles = db.prepare(query).all(...params);
  res.json(articles);
});

// Get single article with comments
app.get('/api/articles/:id', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Artigo não encontrado.' });
  }

  // Increment view
  db.prepare('UPDATE articles SET views_count = views_count + 1 WHERE id = ?').run(article.id);

  const comments = db.prepare('SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC').all(article.id);
  res.json({
    ...article,
    comments
  });
});

// Create article
app.post('/api/articles', (req, res) => {
  const { author_id, title, subtitle, category, opinion_type, cover_image, content } = req.body;
  if (!title || !author_id || !content) {
    return res.status(400).json({ error: 'Título, autor e conteúdo são obrigatórios.' });
  }

  const author = db.prepare('SELECT name FROM users WHERE id = ?').get(author_id);
  if (!author) {
    return res.status(404).json({ error: 'Autor não encontrado.' });
  }

  const defaultCover = cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80';

  const result = db.prepare(`
    INSERT INTO articles (author_id, author_name, title, subtitle, category, opinion_type, cover_image, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    author_id,
    author.name,
    title,
    subtitle || '',
    category || 'Geral',
    opinion_type || 'reflexao',
    defaultCover,
    content
  );

  res.status(201).json({ id: Number(result.lastInsertRowid), message: 'Artigo de opinião publicado!' });
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const { title, subtitle, category, opinion_type, cover_image, content } = req.body;

  db.prepare(`
    UPDATE articles
    SET title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        category = COALESCE(?, category),
        opinion_type = COALESCE(?, opinion_type),
        cover_image = COALESCE(?, cover_image),
        content = COALESCE(?, content)
    WHERE id = ?
  `).run(title, subtitle, category, opinion_type, cover_image, content, articleId);

  res.json({ message: 'Artigo atualizado com sucesso!' });
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  const articleId = req.params.id;
  db.prepare('DELETE FROM comments WHERE article_id = ?').run(articleId);
  db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
  res.json({ message: 'Artigo excluído com sucesso.' });
});

// Like article
app.post('/api/articles/:id/like', (req, res) => {
  db.prepare('UPDATE articles SET likes_count = likes_count + 1 WHERE id = ?').run(req.params.id);
  const updated = db.prepare('SELECT likes_count FROM articles WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Add comment to article
app.post('/api/articles/:id/comments', (req, res) => {
  const articleId = req.params.id;
  const { user_id, content, opinion_type = 'concordo' } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'Usuário e conteúdo são obrigatórios.' });
  }

  const user = db.prepare('SELECT name, avatar FROM users WHERE id = ?').get(user_id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const result = db.prepare(`
    INSERT INTO comments (article_id, user_id, user_name, user_avatar, content, opinion_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(articleId, user_id, user.name, user.avatar, content, opinion_type);

  const newComment = db.prepare('SELECT * FROM comments WHERE id = ?').get(Number(result.lastInsertRowid));
  res.status(201).json(newComment);
});

// Delete comment
app.delete('/api/articles/:articleId/comments/:commentId', (req, res) => {
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.commentId);
  res.json({ message: 'Comentário removido.' });
});

// ==========================================
// ADMIN DASHBOARD ROUTES
// ==========================================

app.get('/api/admin/stats', (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalBooks = db.prepare('SELECT COUNT(*) as count FROM books').get().count;
  const totalChapters = db.prepare('SELECT COUNT(*) as count FROM chapters').get().count;
  const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;
  const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;

  res.json({
    totalUsers,
    totalBooks,
    totalChapters,
    totalArticles,
    totalComments
  });
});

// Serve Frontend build in production or standalone mode
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`\n🚀 BookShelf Server rodando com sucesso!`);
  console.log(`📍 Acesse no seu navegador: http://localhost:${PORT}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  A porta ${PORT} já está em uso por outro processo!`);
    console.error(`Feche o outro terminal aberto ou reinicie o aplicativo.\n`);
  } else {
    console.error('Erro no servidor:', err);
  }
});

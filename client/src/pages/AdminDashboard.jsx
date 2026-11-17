import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  BookOpen,
  Feather,
  Trash2,
  ExternalLink,
  Plus,
  AlertTriangle,
  CheckCircle,
  Eye,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, isAdmin, switchUser, presetUsers } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'books', 'articles'
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [statsRes, usersRes, booksRes, articlesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/users'),
        fetch('/api/books'),
        fetch('/api/articles')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (booksRes.ok) setBooks(await booksRes.json());
      if (articlesRes.ok) setArticles(await articlesRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${userName}" e todas as suas obras e artigos?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Usuário excluído pelo administrador.');
        loadAllData();
      }
    } catch (err) {
      alert('Erro ao excluir usuário.');
    }
  };

  const handleDeleteBook = async (bookId, title) => {
    if (!window.confirm(`Tem certeza que deseja excluir o livro "${title}" do site?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Livro removido do catálogo com sucesso.');
        loadAllData();
      }
    } catch (err) {
      alert('Erro ao excluir livro.');
    }
  };

  const handleDeleteArticle = async (articleId, title) => {
    if (!window.confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Artigo removido com sucesso.');
        loadAllData();
      }
    } catch (err) {
      alert('Erro ao excluir artigo.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">
          Acesso Restrito ao Administrador Geral (Dono do Site)
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          O perfil atualmente conectado (<strong>{currentUser?.name || 'Visitante'}</strong>) tem nível de <strong>Escritor</strong>. Para gerenciar, excluir perfis e moderar todos os livros e artigos do site, alterne para a conta de administrador.
        </p>
        <div>
          <button
            onClick={() => switchUser(presetUsers[0])}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-2 mx-auto text-sm cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Entrar como Administrador Geral (Dono)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-rose-300 uppercase tracking-widest bg-rose-950/80 px-3 py-1 rounded-full mb-2 border border-rose-800">
            <Shield className="w-3.5 h-3.5" />
            <span>Painel do Dono do Site • Acesso Mestre</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Controle & Moderação Geral BookShelf
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mt-1">
            Aqui você tem autoridade total para visualizar, adicionar, editar e excluir qualquer perfil, livro ou artigo de opinião cadastrado no sistema.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/books/new"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Livro</span>
          </Link>
          <Link
            to="/articles/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Artigo</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase">Total Usuários</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 block">
            {stats?.totalUsers || users.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase">Total Livros</span>
            <BookOpen className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 block">
            {stats?.totalBooks || books.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase">Total Artigos</span>
            <Feather className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 block">
            {stats?.totalArticles || articles.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase">Comentários</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 block">
            {stats?.totalComments || 0}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-6 text-sm font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'users'
                ? 'border-rose-700 text-rose-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gerenciar Perfis ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`pb-3 px-6 text-sm font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'books'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Gerenciar Livros ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 px-6 text-sm font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'articles'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>Gerenciar Artigos ({articles.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Lista de Todos os Autores e Administradores Cadastrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Autor / Nome</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Papel</th>
                    <th className="py-3 px-4">Livros</th>
                    <th className="py-3 px-4">Artigos</th>
                    <th className="py-3 px-4 text-right">Ações do Dono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-4 flex items-center space-x-2.5">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="font-bold text-stone-900">{u.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.role === 'admin'
                              ? 'bg-rose-100 text-rose-800'
                              : u.role === 'professor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.role === 'admin' ? 'Administrador' : u.role === 'professor' ? 'Professor' : 'Escritor'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{u.books_count || 0}</td>
                      <td className="py-3 px-4 font-semibold">{u.articles_count || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/authors/${u.id}`}
                          className="inline-flex items-center space-x-1 text-stone-600 hover:text-stone-900 font-semibold p-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </Link>

                        {u.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-800 font-semibold p-1"
                            title="Excluir perfil permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir Perfil</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKS MANAGEMENT */}
        {activeTab === 'books' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Catálogo Geral de Livros Publicados
              </span>
              <Link
                to="/books/new"
                className="bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Novo Livro</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Livro</th>
                    <th className="py-3 px-4">Autor</th>
                    <th className="py-3 px-4">Gênero</th>
                    <th className="py-3 px-4">Status / Modelo</th>
                    <th className="py-3 px-4">Leituras</th>
                    <th className="py-3 px-4 text-right">Ações do Dono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {books.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-4 flex items-center space-x-2.5">
                        <img
                          src={b.cover_image}
                          alt={b.title}
                          className="w-8 h-10 object-cover rounded shadow-2xs"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block truncate max-w-xs">{b.title}</span>
                          <span className="text-[10px] text-stone-400">ISBN: {b.isbn || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{b.author_name}</td>
                      <td className="py-3 px-4">{b.genre}</td>
                      <td className="py-3 px-4">
                        {b.is_template === 1 ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Modelo Oficial
                          </span>
                        ) : (
                          <span className="text-stone-400">Normal</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold">{b.views || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/books/${b.id}`}
                          className="inline-flex items-center space-x-1 text-amber-800 hover:text-amber-950 font-semibold p-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Ler</span>
                        </Link>

                        <button
                          onClick={() => handleDeleteBook(b.id, b.title)}
                          className="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-800 font-semibold p-1"
                          title="Excluir livro do site"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Artigos de Opinião e Ensaios da Comunidade
              </span>
              <Link
                to="/articles/new"
                className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Novo Artigo</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Artigo / Tese</th>
                    <th className="py-3 px-4">Autor</th>
                    <th className="py-3 px-4">Posicionamento</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Curtidas</th>
                    <th className="py-3 px-4 text-right">Ações do Dono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900 block truncate max-w-sm">{art.title}</span>
                      </td>
                      <td className="py-3 px-4">{art.author_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            art.opinion_type === 'discordo'
                              ? 'bg-rose-100 text-rose-800'
                              : art.opinion_type === 'concordo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {art.opinion_type === 'discordo' ? 'Discorda' : art.opinion_type === 'concordo' ? 'Concorda' : 'Reflexão'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">{art.category}</td>
                      <td className="py-3 px-4 font-semibold">{art.likes_count || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/articles/${art.id}`}
                          className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-900 font-semibold p-1"
                        >
                          <Feather className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </Link>

                        <button
                          onClick={() => handleDeleteArticle(art.id, art.title)}
                          className="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-800 font-semibold p-1"
                          title="Excluir artigo do site"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

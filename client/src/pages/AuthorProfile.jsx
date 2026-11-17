import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import {
  User,
  BookOpen,
  Feather,
  Edit3,
  Trash2,
  Shield,
  Eye,
  ThumbsUp,
  Calendar,
  Plus,
  Check,
  X,
  GraduationCap,
  School
} from 'lucide-react';

export default function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin, updateProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books'); // 'books' or 'articles'

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Autor não encontrado');
      const data = await res.json();
      setProfile(data);
      setEditName(data.name);
      setEditBio(data.bio || '');
      setEditAvatar(data.avatar || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await updateProfile(id, {
        name: editName,
        bio: editBio,
        avatar: editAvatar
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert('Erro ao atualizar perfil.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('ATENÇÃO: Deseja realmente excluir este perfil? Todos os livros e artigos associados também serão removidos.')) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Perfil excluído com sucesso.');
        navigate('/authors');
      }
    } catch (err) {
      alert('Erro ao excluir perfil.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Excluir este livro?')) return;
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      alert('Erro ao excluir livro.');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Excluir este artigo?')) return;
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      alert('Erro ao excluir artigo.');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-stone-400">Carregando perfil do autor...</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-700 font-bold mb-3">Autor não encontrado.</p>
        <Link to="/authors" className="text-amber-800 underline text-sm">
          Ver lista de autores
        </Link>
      </div>
    );
  }

  const isOwnerOrAdmin = isAdmin || currentUser?.id === profile.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle decorative banner */}
        <div className="h-28 bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 mb-6"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          {/* Avatar and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-stone-100 shrink-0 relative group">
              <img
                src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {profile.name}
                </h1>
                {profile.role === 'admin' ? (
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1" title="Administrador / Dono do Site">
                    <Shield className="w-3 h-3 text-rose-600" />
                    <span>Dono / Admin</span>
                  </span>
                ) : profile.role === 'professor' ? (
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1" title="Professor / Educador">
                    <GraduationCap className="w-3 h-3 text-blue-600" />
                    <span>Professor(a)</span>
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <BookOpen className="w-3 h-3 text-amber-700" />
                    <span>Escritor(a)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">{profile.email}</p>
              {profile.institution && (
                <div className="text-xs text-stone-600 flex items-center space-x-1 justify-center sm:justify-start pt-0.5 font-medium">
                  <School className="w-3.5 h-3.5 text-stone-400" />
                  <span>{profile.institution}</span>
                </div>
              )}
              <div className="text-xs text-stone-400 flex items-center space-x-1 justify-center sm:justify-start pt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Membro da BookShelf desde 2026</span>
              </div>
            </div>
          </div>

          {/* Action buttons (Edit Profile / Delete Profile) */}
          {isOwnerOrAdmin && (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Perfil & Foto</span>
              </button>

              <button
                onClick={handleDeleteProfile}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-2 rounded-xl transition border border-rose-200"
                title="Excluir este perfil (Dono ou Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Biografia do Autor:
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed font-serif max-w-3xl">
            {profile.bio || 'Este autor ainda não adicionou uma descrição biográfica.'}
          </p>
        </div>

        {/* Stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100 max-w-md">
          <div className="text-center sm:text-left">
            <span className="text-2xl font-serif font-bold text-amber-800 block">
              {profile.books?.length || 0}
            </span>
            <span className="text-xs text-stone-500 font-medium">Livros Publicados</span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-2xl font-serif font-bold text-emerald-800 block">
              {profile.articles?.length || 0}
            </span>
            <span className="text-xs text-stone-500 font-medium">Artigos de Opinião</span>
          </div>
        </div>
      </div>

      {/* Tabs: Books vs Articles */}
      <div className="space-y-6">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('books')}
            className={`pb-3 px-6 text-sm font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'books'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Livros Escritos ({profile.books?.length || 0})</span>
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
            <span>Artigos de Opinião ({profile.articles?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: BOOKS */}
        {activeTab === 'books' && (
          <div>
            {profile.books && profile.books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profile.books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                          {book.genre}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {book.synopsis || 'Sem sinopse.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <Link
                          to={`/books/${book.id}`}
                          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center space-x-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Ler Livro</span>
                        </Link>

                        {isOwnerOrAdmin && (
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/books/${book.id}/edit`}
                              className="text-xs font-semibold text-stone-600 hover:text-amber-800 flex items-center space-x-1 p-1"
                              title="Editar livro"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Editar</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Excluir livro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
                <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-stone-600 text-sm">Este autor ainda não publicou livros.</p>
                {currentUser?.id === profile.id && (
                  <Link
                    to="/books/new"
                    className="inline-flex items-center space-x-1 bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Escrever meu primeiro livro</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARTICLES */}
        {activeTab === 'articles' && (
          <div>
            {profile.articles && profile.articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.articles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-stone-500">
                          {art.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            art.opinion_type === 'discordo'
                              ? 'bg-rose-100 text-rose-800'
                              : art.opinion_type === 'concordo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {art.opinion_type === 'discordo'
                            ? 'Discorda'
                            : art.opinion_type === 'concordo'
                            ? 'Concorda'
                            : 'Reflexão'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {art.subtitle || art.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <Link
                        to={`/articles/${art.id}`}
                        className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                      >
                        <Feather className="w-3.5 h-3.5" />
                        <span>Ler Artigo</span>
                      </Link>

                      {isOwnerOrAdmin && (
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/articles/${art.id}/edit`}
                            className="text-stone-600 hover:text-emerald-800 flex items-center space-x-1 p-1"
                            title="Editar artigo"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Editar</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Excluir artigo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
                <Feather className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-stone-600 text-sm">Este autor ainda não publicou artigos de opinião.</p>
                {currentUser?.id === profile.id && (
                  <Link
                    to="/articles/new"
                    className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Escrever meu primeiro artigo</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-700" />
                <span>Editar Dados do Perfil</span>
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome do Autor / Pseudônimo:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Biografia / Breve Descrição:
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Conte um pouco sobre suas paixões literárias, estilo de escrita..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <ImageUploader
                  label="Foto de Perfil do Autor"
                  value={editAvatar}
                  onChange={setEditAvatar}
                  placeholder="URL da foto ou envie o arquivo do computador"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingEdit ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

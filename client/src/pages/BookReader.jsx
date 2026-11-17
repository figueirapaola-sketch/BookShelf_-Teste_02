import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  ThumbsUp,
  Eye,
  Share2,
  Printer,
  Trash2,
  Edit,
  ArrowLeft,
  Sparkles,
  Maximize2
} from 'lucide-react';

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('cover'); // 'cover', 'titlepage', 'cip', 'dedication', 'foreword', chapter-0, chapter-1..., 'afterword', 'about'
  const [theme, setTheme] = useState('paper'); // 'paper', 'light', 'dark'
  const [fontSize, setFontSize] = useState('base'); // 'sm', 'base', 'lg', 'xl'
  const [showToc, setShowToc] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error('Livro não encontrado');
        const data = await res.json();
        setBook(data);
        setLikes(data.likes || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      const res = await fetch(`/api/books/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setHasLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Livro excluído com sucesso.');
        navigate('/books');
      }
    } catch (err) {
      alert('Erro ao excluir livro.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500">
        Carregando obra editorial...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-stone-700 font-bold mb-4">Livro não encontrado.</p>
        <Link to="/books" className="text-amber-800 underline">
          Voltar para a biblioteca
        </Link>
      </div>
    );
  }

  const isOwnerOrAdmin = isAdmin || currentUser?.id === book.author_id;

  // Build navigation items sequence
  const navSections = [
    { key: 'cover', label: 'Capa Oficial' },
    { key: 'titlepage', label: 'Folha de Rosto' },
    { key: 'cip', label: 'Ficha Catalográfica (CIP)' },
    ...(book.dedication || book.epigraph ? [{ key: 'dedication', label: 'Dedicatória & Epígrafe' }] : []),
    ...(book.foreword ? [{ key: 'foreword', label: 'Prefácio' }] : []),
    ...(book.chapters || []).map((ch, idx) => ({
      key: `chapter-${idx}`,
      label: ch.title || `Capítulo ${idx + 1}`
    })),
    ...(book.afterword ? [{ key: 'afterword', label: 'Posfácio' }] : []),
    { key: 'about', label: 'Sobre o Autor & Contracapa' }
  ];

  const currentIndex = navSections.findIndex((s) => s.key === activeSection);
  const prevSection = currentIndex > 0 ? navSections[currentIndex - 1] : null;
  const nextSection = currentIndex < navSections.length - 1 ? navSections[currentIndex + 1] : null;

  // Themes
  const themeClasses = {
    paper: 'bg-[#faf8f4] text-[#2c2621] border-stone-300',
    light: 'bg-white text-stone-900 border-stone-200',
    dark: 'bg-stone-900 text-stone-200 border-stone-800'
  };

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-stone-100 text-stone-900'}`}>
      {/* Top Floating Reader Bar */}
      <div className={`sticky top-0 z-40 px-4 py-2.5 border-b flex items-center justify-between backdrop-blur-md ${theme === 'dark' ? 'bg-stone-900/90 border-stone-800 text-white' : 'bg-white/90 border-stone-200 text-stone-800'}`}>
        <div className="flex items-center space-x-3">
          <Link
            to="/books"
            className="flex items-center space-x-1 text-xs font-semibold hover:text-amber-700 transition p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Biblioteca</span>
          </Link>

          <button
            onClick={() => setShowToc(!showToc)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-200/60 hover:bg-stone-200 transition"
          >
            <List className="w-3.5 h-3.5" />
            <span>Sumário ({navSections.length})</span>
          </button>
        </div>

        {/* Center: Book Title */}
        <div className="text-center truncate max-w-xs sm:max-w-md hidden md:block">
          <span className="font-serif font-bold text-sm truncate block">{book.title}</span>
          <span className="text-[10px] text-stone-500 block -mt-0.5">Por {book.author_name}</span>
        </div>

        {/* Right Reader Controls */}
        <div className="flex items-center space-x-2">
          {/* Font sizing */}
          <div className="flex space-x-1 text-xs bg-stone-200/50 rounded-lg p-0.5">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-500'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-0.5 rounded ${fontSize === 'base' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-500'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-500'}`}
            >
              A+
            </button>
          </div>

          {/* Theme switcher */}
          <div className="flex space-x-1 text-xs bg-stone-200/50 rounded-lg p-0.5">
            <button
              onClick={() => setTheme('paper')}
              className={`px-2 py-0.5 rounded font-medium ${theme === 'paper' ? 'bg-[#faf8f4] text-stone-900 shadow-xs font-bold' : 'text-stone-500'}`}
              title="Papel Editorial"
            >
              📖
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2 py-0.5 rounded font-medium ${theme === 'light' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500'}`}
              title="Claro"
            >
              ☀️
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2 py-0.5 rounded font-medium ${theme === 'dark' ? 'bg-stone-800 text-white shadow-xs font-bold' : 'text-stone-500'}`}
              title="Noturno"
            >
              🌙
            </button>
          </div>

          {/* Print / Actions */}
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 transition"
            title="Imprimir / Salvar PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {isOwnerOrAdmin && (
            <>
              <Link
                to={`/books/${book.id}/edit`}
                className="p-1.5 rounded-lg text-amber-700 hover:text-amber-900 transition flex items-center space-x-1"
                title="Editar Livro"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDeleteBook}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 transition"
                title="Excluir livro (Dono / Admin)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Table of Contents Drawer / Sidebar */}
        {showToc && (
          <aside className="w-72 shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto bg-white/70 backdrop-blur-xs rounded-2xl p-4 border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
              Estrutura Editorial
            </div>
            <nav className="space-y-1">
              {navSections.map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    activeSection === sec.key
                      ? 'bg-amber-100 text-amber-900 font-bold border-l-4 border-amber-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span className="truncate">{sec.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-4 border-t border-stone-200 text-xs text-stone-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>Visualizações:</span>
                <span className="font-bold">{book.views || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Curtidas:</span>
                <span className="font-bold">{likes}</span>
              </div>
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`w-full mt-2 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                  hasLiked
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{hasLiked ? 'Você curtiu esta obra!' : 'Curtir este livro'}</span>
              </button>
            </div>
          </aside>
        )}

        {/* The Diagrammed Book Page */}
        <main className="flex-1 max-w-3xl mx-auto">
          <div
            className={`min-h-[800px] rounded-2xl border p-8 sm:p-14 shadow-md transition-all ${themeClasses[theme]} book-paper`}
          >
            {/* 1. SECTION: COVER */}
            {activeSection === 'cover' && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-8 animate-in fade-in">
                <div className="w-64 sm:w-80 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-stone-800 relative group">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left">
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
                      {book.genre}
                    </span>
                    <h1 className="font-serif text-2xl font-bold leading-tight mb-1">
                      {book.title}
                    </h1>
                    <p className="text-xs text-stone-300">Por {book.author_name}</p>
                  </div>
                </div>

                <div className="max-w-md space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">{book.title}</h2>
                  {book.subtitle && (
                    <p className="text-sm font-serif italic text-stone-600">{book.subtitle}</p>
                  )}
                  <p className="text-xs font-medium tracking-widest uppercase text-amber-800 pt-2">
                    {book.author_name}
                  </p>
                </div>

                <button
                  onClick={() => setActiveSection('titlepage')}
                  className="bg-amber-800 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-amber-900 transition flex items-center space-x-1"
                >
                  <span>Abrir o Livro (Folha de Rosto)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 2. SECTION: TITLE PAGE (FOLHA DE ROSTO) */}
            {activeSection === 'titlepage' && (
              <div className="min-h-[600px] flex flex-col justify-between text-center py-12 animate-in fade-in font-serif">
                <div className="text-sm tracking-widest uppercase font-bold text-stone-600">
                  {book.author_name}
                </div>

                <div className="space-y-4 my-16">
                  <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">{book.title}</h1>
                  {book.subtitle && (
                    <h2 className="text-lg italic text-stone-600 max-w-lg mx-auto">
                      {book.subtitle}
                    </h2>
                  )}
                </div>

                <div className="text-xs space-y-1 text-stone-600 tracking-wider">
                  <p className="font-bold uppercase text-stone-800">{book.publisher || 'Editora BookShelf'}</p>
                  <p>{book.city || 'São Paulo - SP'}</p>
                  <p>{book.year || '2026'}</p>
                </div>
              </div>
            )}

            {/* 3. SECTION: CIP (FICHA CATALOGRÁFICA / DIREITOS AUTORAIS) */}
            {activeSection === 'cip' && (
              <div className="py-12 animate-in fade-in space-y-8 text-xs font-sans">
                <div className="border-b border-stone-200 pb-4">
                  <h3 className="font-bold text-stone-800 uppercase tracking-widest text-[11px]">
                    Elementos Pré-Textuais • Registro Oficial
                  </h3>
                </div>

                <div className="space-y-3 text-stone-600 leading-relaxed">
                  <p>© {book.year || '2026'} por {book.author_name}.</p>
                  <p>Todos os direitos reservados. Nenhuma parte desta obra pode ser reproduzida sem prévia autorização da editora e do autor.</p>
                  <p>Publicação independente diagramada e hospedada via plataforma <strong>BookShelf</strong>.</p>
                </div>

                {/* CIP Card Box standard */}
                <div className="border-2 border-stone-400 p-6 rounded-lg font-mono text-[11px] leading-relaxed max-w-lg mx-auto bg-stone-50/50">
                  <p className="text-center font-bold mb-3 border-b border-stone-300 pb-2">
                    Dados Internacionais de Catalogação na Publicação (CIP)<br />
                    (Câmara Brasileira do Livro, SP, Brasil)
                  </p>
                  <div className="space-y-1.5 text-stone-700">
                    <p className="font-bold">{book.author_name.split(' ').reverse().join(', ')}.</p>
                    <p className="pl-4">
                      {book.title} : {book.subtitle || 'obra literária'} / {book.author_name}. -- {book.city || 'São Paulo'} : {book.publisher || 'BookShelf Edições'}, {book.year || '2026'}.
                    </p>
                    <p className="pl-4">ISBN: {book.isbn || '978-65-80123-45-9'}</p>
                    <p className="pl-4">1. {book.genre} 2. Literatura Brasileira I. Título.</p>
                    <p className="text-right pt-2 text-[10px]">CDD-{book.genre === 'Ficção Científica' ? 'B869.3' : 'B869'}</p>
                  </div>
                </div>

                <div className="text-center text-stone-500 text-[10px] pt-4">
                  Índice para catálogo sistemático: 1. Literatura : {book.genre}
                </div>
              </div>
            )}

            {/* 4. SECTION: DEDICATION & EPIGRAPH */}
            {activeSection === 'dedication' && (
              <div className="min-h-[500px] flex flex-col justify-around py-12 animate-in fade-in font-serif">
                {book.dedication && (
                  <div className="text-right max-w-md ml-auto pr-8 py-8">
                    <p className="italic text-base text-stone-700 leading-relaxed">
                      "{book.dedication}"
                    </p>
                  </div>
                )}

                {book.epigraph && (
                  <div className="text-right max-w-md ml-auto pr-8 py-8 border-t border-stone-200/60">
                    <blockquote className="italic text-base text-stone-800 leading-relaxed mb-2">
                      "{book.epigraph}"
                    </blockquote>
                    {book.epigraph_author && (
                      <cite className="text-xs uppercase tracking-wider text-stone-500 block not-italic">
                        — {book.epigraph_author}
                      </cite>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. SECTION: FOREWORD */}
            {activeSection === 'foreword' && (
              <div className="py-8 animate-in fade-in space-y-6">
                <div className="text-center border-b border-stone-200 pb-4 mb-6">
                  <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
                    Elemento Pré-Textual
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-stone-900">Prefácio</h2>
                </div>

                <div className={`font-serif whitespace-pre-line text-stone-800 ${fontClasses[fontSize]}`}>
                  {book.foreword}
                </div>
              </div>
            )}

            {/* 6. SECTION: CHAPTERS (WITH ILLUSTRATIONS) */}
            {activeSection.startsWith('chapter-') && (() => {
              const chIndex = parseInt(activeSection.replace('chapter-', ''), 10);
              const chapter = book.chapters?.[chIndex];
              if (!chapter) return null;

              const topIllustrations = (chapter.illustrations || []).filter(
                (i) => i.position === 'top' || !i.position
              );
              const middleIllustrations = (chapter.illustrations || []).filter(
                (i) => i.position === 'middle'
              );
              const bottomIllustrations = (chapter.illustrations || []).filter(
                (i) => i.position === 'bottom'
              );

              return (
                <div className="py-8 animate-in fade-in space-y-8">
                  {/* Chapter Header */}
                  <div className="text-center border-b border-stone-200 pb-6 mb-8">
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
                      Capítulo {chIndex + 1}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      {chapter.title}
                    </h2>
                  </div>

                  {/* Top Illustrations */}
                  {topIllustrations.map((ill, i) => (
                    <figure key={i} className="my-6 text-center space-y-2">
                      <div className="rounded-xl overflow-hidden shadow-md max-w-xl mx-auto border border-stone-300">
                        <img
                          src={ill.url}
                          alt={ill.caption}
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                      {ill.caption && (
                        <figcaption className="text-xs italic text-stone-600 font-serif max-w-lg mx-auto">
                          {ill.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}

                  {/* Chapter Text Body */}
                  <div className={`font-serif whitespace-pre-line text-stone-800 text-justify ${fontClasses[fontSize]}`}>
                    {chapter.content || (
                      <p className="italic text-stone-400 text-center py-12">
                        Este capítulo ainda não possui texto inserido.
                      </p>
                    )}
                  </div>

                  {/* Middle Illustrations */}
                  {middleIllustrations.map((ill, i) => (
                    <figure key={i} className="my-6 text-center space-y-2">
                      <div className="rounded-xl overflow-hidden shadow-md max-w-xl mx-auto border border-stone-300">
                        <img
                          src={ill.url}
                          alt={ill.caption}
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                      {ill.caption && (
                        <figcaption className="text-xs italic text-stone-600 font-serif max-w-lg mx-auto">
                          {ill.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}

                  {/* Bottom Illustrations */}
                  {bottomIllustrations.map((ill, i) => (
                    <figure key={i} className="my-6 text-center space-y-2">
                      <div className="rounded-xl overflow-hidden shadow-md max-w-xl mx-auto border border-stone-300">
                        <img
                          src={ill.url}
                          alt={ill.caption}
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                      {ill.caption && (
                        <figcaption className="text-xs italic text-stone-600 font-serif max-w-lg mx-auto">
                          {ill.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              );
            })()}

            {/* 7. SECTION: AFTERWORD */}
            {activeSection === 'afterword' && (
              <div className="py-8 animate-in fade-in space-y-6">
                <div className="text-center border-b border-stone-200 pb-4 mb-6">
                  <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
                    Elemento Pós-Textual
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-stone-900">Posfácio</h2>
                </div>

                <div className={`font-serif whitespace-pre-line text-stone-800 ${fontClasses[fontSize]}`}>
                  {book.afterword}
                </div>
              </div>
            )}

            {/* 8. SECTION: ABOUT AUTHOR & BACK COVER */}
            {activeSection === 'about' && (
              <div className="py-8 animate-in fade-in space-y-8">
                <div className="text-center border-b border-stone-200 pb-4 mb-6">
                  <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
                    Elemento Pós-Textual • Orelha do Livro
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-stone-900">Sobre o Autor</h2>
                </div>

                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-700 shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(book.author_name)}`}
                      alt={book.author_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {book.author_name}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-serif">
                      {book.about_author || 'Biografia não cadastrada.'}
                    </p>
                    <Link
                      to={`/authors/${book.author_id}`}
                      className="inline-block text-xs font-semibold text-amber-800 hover:text-amber-900 underline"
                    >
                      Ver perfil completo do autor e outros livros →
                    </Link>
                  </div>
                </div>

                {/* Back cover synopsis */}
                <div className="mt-8 pt-6 border-t border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                    Sinopse da Contracapa
                  </h4>
                  <p className="text-sm font-serif italic text-stone-700 leading-relaxed">
                    "{book.synopsis}"
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-600">
              {prevSection ? (
                <button
                  onClick={() => setActiveSection(prevSection.key)}
                  className="flex items-center space-x-1 hover:text-amber-800 p-2 rounded-lg hover:bg-stone-200/40 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{prevSection.label}</span>
                </button>
              ) : (
                <div></div>
              )}

              <span className="text-stone-400">
                {currentIndex + 1} de {navSections.length}
              </span>

              {nextSection ? (
                <button
                  onClick={() => setActiveSection(nextSection.key)}
                  className="flex items-center space-x-1 text-amber-800 hover:text-amber-950 p-2 rounded-lg hover:bg-amber-100/50 transition font-bold"
                >
                  <span>{nextSection.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

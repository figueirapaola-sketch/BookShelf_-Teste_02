import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Eye,
  ThumbsUp,
  Award,
  Layers
} from 'lucide-react';

export default function BooksCatalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [onlyTemplate, setOnlyTemplate] = useState(false);

  useEffect(() => {
    async function fetchBooks() {
      try {
        let url = `/api/books?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (selectedGenre !== 'Todos') url += `genre=${encodeURIComponent(selectedGenre)}&`;
        if (onlyTemplate) url += `template=true&`;

        const res = await fetch(url);
        if (res.ok) setBooks(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [search, selectedGenre, onlyTemplate]);

  const GENRES = [
    'Todos',
    'Ficção Científica & Distopia',
    'Contos & Crônicas',
    'Fantasia & Aventura',
    'Romance & Drama',
    'Não-Ficção & Ensaio',
    'Tecnologia & Sociedade'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Catálogo Editorial de Livros
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Explore as obras diagramadas com estrutura editorial completa pelos autores da comunidade.
          </p>
        </div>

        <Link
          to="/books/new"
          className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2 text-sm shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Novo Livro</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, autor ou palavra-chave..."
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Quick Filter: Template only */}
          <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer shrink-0 select-none">
            <input
              type="checkbox"
              checked={onlyTemplate}
              onChange={(e) => setOnlyTemplate(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>Apenas Modelo Editorial Oficial</span>
          </label>
        </div>

        {/* Genre Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Gênero:
          </span>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedGenre === g
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">Carregando catálogo...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700 text-base">Nenhum livro encontrado</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Não encontramos nenhuma obra com os filtros selecionados. Tente ajustar os termos ou escreva seu próprio livro!
          </p>
          <Link
            to="/books/new"
            className="inline-block mt-2 bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Escrever novo livro agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';
                    }}
                  />
                  {book.is_template === 1 && (
                    <span className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Modelo Oficial</span>
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                    {book.genre}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-2 text-base leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Por{' '}
                    <Link
                      to={`/authors/${book.author_id}`}
                      className="text-stone-700 hover:text-amber-800 font-medium underline"
                    >
                      {book.author_name}
                    </Link>
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {book.synopsis || 'Sem sinopse disponível.'}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{book.views || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{book.likes || 0}</span>
                    </span>
                  </div>

                  <Link
                    to={`/books/${book.id}`}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Ler Obra
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

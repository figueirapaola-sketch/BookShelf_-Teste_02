import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Feather,
  Search,
  MessageSquare,
  ThumbsUp,
  Eye,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function ArticlesFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedOpinion, setSelectedOpinion] = useState('todos'); // 'todos', 'concordo', 'discordo', 'reflexao'

  useEffect(() => {
    async function fetchArticles() {
      try {
        let url = `/api/articles?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (selectedCategory !== 'Todas') url += `category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedOpinion !== 'todos') url += `opinion_type=${encodeURIComponent(selectedOpinion)}&`;

        const res = await fetch(url);
        if (res.ok) setArticles(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [search, selectedCategory, selectedOpinion]);

  const CATEGORIES = [
    'Todas',
    'Tecnologia & Arte',
    'Hábitos de Leitura',
    'Mercado Editorial & Cultura',
    'Educação & Sociedade',
    'Filosofia & Cotidiano'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Feather className="w-3.5 h-3.5" />
            <span>Tribuna de Ensaios & Opinião</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Artigos & Pontos de Vista
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Espaço aberto para autores expressarem argumentos sinceros sobre temas que admiram ou discordam radicalmente.
          </p>
        </div>

        <Link
          to="/articles/new"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2 text-sm shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Escrever Artigo de Opinião</span>
        </Link>
      </div>

      {/* Filter and Stance Selector */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por temas, teses, autores..."
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Stance Buttons (Concordo / Discordo / Reflexao) */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider self-center mr-2">
            Posicionamento:
          </span>

          <button
            onClick={() => setSelectedOpinion('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedOpinion === 'todos'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos os Artigos
          </button>

          <button
            onClick={() => setSelectedOpinion('discordo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              selectedOpinion === 'discordo'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Discordo / Crítica</span>
          </button>

          <button
            onClick={() => setSelectedOpinion('concordo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              selectedOpinion === 'concordo'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Concordo / Defesa</span>
          </button>

          <button
            onClick={() => setSelectedOpinion('reflexao')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              selectedOpinion === 'reflexao'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Reflexão Filosófica</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Categoria:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Feed List */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">Carregando artigos...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <Feather className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700 text-base">Nenhum artigo encontrado</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Seja o primeiro a defender ou criticar um tema publicando seu próprio ensaio opinativo!
          </p>
          <Link
            to="/articles/new"
            className="inline-block mt-2 bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Publicar primeiro artigo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  <img
                    src={art.cover_image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600';
                    }}
                  />
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider backdrop-blur-md ${
                      art.opinion_type === 'discordo'
                        ? 'bg-rose-900/90 text-white'
                        : art.opinion_type === 'concordo'
                        ? 'bg-emerald-900/90 text-white'
                        : 'bg-amber-900/90 text-white'
                    }`}
                  >
                    {art.opinion_type === 'discordo'
                      ? '✕ Discorda'
                      : art.opinion_type === 'concordo'
                      ? '✓ Concorda'
                      : '✦ Reflexão'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <h2 className="font-serif font-bold text-stone-900 text-lg leading-snug group-hover:text-emerald-800 transition line-clamp-2">
                    {art.title}
                  </h2>

                  <p className="text-xs text-stone-500">
                    Por{' '}
                    <Link
                      to={`/authors/${art.author_id}`}
                      className="text-stone-800 hover:text-emerald-800 font-semibold underline"
                    >
                      {art.author_name}
                    </Link>
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {art.subtitle || art.content}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1" title="Visualizações">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{art.views_count || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Curtidas">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{art.likes_count || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Comentários">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{art.comments_count || 0}</span>
                    </span>
                  </div>

                  <Link
                    to={`/articles/${art.id}`}
                    className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                  >
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

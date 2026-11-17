import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Feather,
  Sparkles,
  ArrowRight,
  ThumbsUp,
  Eye,
  FileCheck2,
  Image as ImageIcon,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { EDITORIAL_SECTIONS_GUIDE } from '../utils/editorialTemplate';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [booksRes, articlesRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/articles')
        ]);

        if (booksRes.ok) setBooks(await booksRes.json());
        if (articlesRes.ok) setArticles(await articlesRes.json());
      } catch (err) {
        console.error('Erro ao carregar dados da home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const templateBook = books.find((b) => b.is_template === 1) || books[0];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-stone-50 to-stone-100 border-b border-stone-200 py-16 sm:py-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-100/80 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Modelo Editorial Oficial para Editoras & Feira Literária</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
                Escreva seu livro com a estrutura de uma{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 underline decoration-amber-300 decoration-wavy decoration-2">
                  verdadeira editora
                </span>
                .
              </h1>

              <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                O <strong>BookShelf</strong> foi feito para autores que desejam publicar com rigor profissional: ficha catalográfica (CIP), dedicatórias, sumário dinâmico, capítulos diagramados com ilustrações nas páginas e um espaço aberto para debater opiniões.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/books/new"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2 text-base group"
                >
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition" />
                  <span>Escrever um Livro Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/articles/new"
                  className="bg-white hover:bg-stone-100 text-stone-800 font-semibold px-6 py-3.5 rounded-xl border border-stone-300 shadow-xs hover:shadow transition flex items-center space-x-2 text-base"
                >
                  <Feather className="w-5 h-5 text-emerald-600" />
                  <span>Publicar Artigo de Opinião</span>
                </Link>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/80 text-stone-700 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                    ✓
                  </div>
                  <span className="font-medium">Pré e Pós Textuais</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                    ✓
                  </div>
                  <span className="font-medium">Figuras nas Páginas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                    ✓
                  </div>
                  <span className="font-medium">Debates e Opiniões</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Book Card or Welcome Card */}
            <div className="lg:col-span-5 flex justify-center">
              {templateBook ? (
                <div className="relative group w-full max-w-sm">
                  {/* Glowing backdrop */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>

                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200 p-5 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Obra em Destaque</span>
                      </span>
                      <span className="text-xs text-stone-500">{templateBook.genre}</span>
                    </div>

                    {/* Book Cover Visual */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner group-hover:scale-[1.02] transition duration-300">
                      <img
                        src={templateBook.cover_image}
                        alt={templateBook.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                        <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                          Por {templateBook.author_name}
                        </div>
                        <h3 className="font-serif text-lg font-bold leading-snug line-clamp-2">
                          {templateBook.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 italic">
                      "{templateBook.synopsis}"
                    </p>

                    <div className="pt-2 flex items-center space-x-2">
                      <Link
                        to={`/books/${templateBook.id}`}
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-center py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center space-x-1"
                      >
                        <BookOpen className="w-4 h-4 mr-1.5" />
                        <span>Folhear Livro</span>
                      </Link>

                      <Link
                        to="/books/new"
                        className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold transition border border-amber-200"
                        title="Escrever novo livro"
                      >
                        Escrever
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group w-full max-w-sm">
                  <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200 p-8 text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-xl text-stone-900">
                        Sua Estante está Pronta!
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Nenhum dado mockado carregado. Cadastre o primeiro <strong>Autor</strong>, <strong>Professor</strong> ou <strong>Administrador</strong> para publicar seus próprios livros e artigos.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link
                        to="/register"
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white text-center py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow"
                      >
                        <span>Cadastrar Novo Perfil</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/login"
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-center py-2.5 rounded-xl text-xs font-semibold transition block"
                      >
                        Já possuo conta (Entrar)
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL STRUCTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Padrão Profissional da Indústria</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            Tudo o que uma editora precisa para publicar
          </h2>
          <p className="text-sm text-stone-600">
            O BookShelf traz de fábrica a organização completa exigida pelas normas editoriais para que seu livro saia pronto para publicação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDITORIAL_SECTIONS_GUIDE.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-serif text-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{sec.phase}</h3>
                    <p className="text-xs text-stone-500">{sec.desc}</p>
                  </div>
                </div>

                <ul className="space-y-3 mt-4">
                  {sec.items.map((item, i) => (
                    <li key={i} className="text-xs border-l-2 border-amber-300 pl-3 py-0.5">
                      <span className="font-semibold text-stone-800 block">{item.name}</span>
                      <span className="text-stone-500">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  to="/editorial-guide"
                  className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
                >
                  <span>Ver detalhes do guia</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED BOOKS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Biblioteca de Obras Publicadas
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Livros escritos pela comunidade com ilustrações e páginas diagramadas
            </p>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-400">Carregando catálogo...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-600 font-medium">Nenhum livro cadastrado ainda.</p>
            <Link
              to="/books/new"
              className="mt-4 inline-block bg-amber-700 text-white text-xs px-4 py-2 rounded-lg font-semibold"
            >
              Criar o primeiro livro
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition group flex flex-col"
              >
                {/* Book Cover Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {book.is_template === 1 && (
                    <span className="absolute top-2 left-2 bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Modelo Oficial
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                    {book.genre}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-1 text-base">
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-500 mb-2">Por {book.author_name}</p>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {book.synopsis || 'Sem sinopse disponível.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
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
                      className="font-semibold text-amber-800 hover:text-amber-950 flex items-center space-x-0.5"
                    >
                      <span>Ler</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* OPINION ARTICLES & DEBATES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/20 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-stone-800">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                <Feather className="w-4 h-4" />
                <span>Espaço da Opinião & Crítica</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white">
                Artigos: O que nossos autores pensam e debatem
              </h2>
              <p className="text-sm text-stone-400 mt-1 max-w-xl">
                Espaço livre para reflexões, discordâncias sinceras e análises sobre literatura, tecnologia e cultura.
              </p>
            </div>

            <Link
              to="/articles/new"
              className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center space-x-2 shrink-0"
            >
              <Feather className="w-4 h-4" />
              <span>Publicar Artigo</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((art) => (
              <div
                key={art.id}
                className="bg-stone-800/80 rounded-2xl p-5 border border-stone-700/60 flex flex-col justify-between hover:border-stone-500 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-stone-400 font-medium">{art.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        art.opinion_type === 'discordo'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                          : art.opinion_type === 'concordo'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                      }`}
                    >
                      {art.opinion_type === 'discordo'
                        ? 'Discorda / Crítica'
                        : art.opinion_type === 'concordo'
                        ? 'Concorda / Apoia'
                        : 'Reflexão Neutra'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-2 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-stone-300 line-clamp-3 mb-4 leading-relaxed">
                    {art.subtitle || art.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-700 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-stone-200 truncate max-w-[120px]">
                      {art.author_name}
                    </span>
                  </div>

                  <Link
                    to={`/articles/${art.id}`}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Ler artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 pt-4">
            <Link
              to="/articles"
              className="text-sm font-semibold text-stone-300 hover:text-white inline-flex items-center space-x-1 underline decoration-stone-600 hover:decoration-white"
            >
              <span>Ver todos os artigos de opinião e participar dos debates</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

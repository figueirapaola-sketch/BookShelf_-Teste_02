import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Feather, Shield, Search, GraduationCap } from 'lucide-react';

export default function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadAuthors() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) setAuthors(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAuthors();
  }, []);

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.bio && a.bio.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Comunidade Literária</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Autores & Ensaístas da Plataforma
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Conheça as mentes criativas por trás dos livros e dos artigos de debate da BookShelf.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar autor pelo nome ou bio..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
        />
      </div>

      {/* Authors Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">Carregando autores...</div>
      ) : filteredAuthors.length === 0 ? (
        <div className="text-center py-12 text-stone-500 bg-white rounded-2xl border border-stone-200">
          Nenhum autor encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs shrink-0 group-hover:scale-105 transition">
                    <img
                      src={
                        author.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`
                      }
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-amber-800 transition">
                        {author.name}
                      </h3>
                    </div>
                    {author.role === 'admin' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        <Shield className="w-2.5 h-2.5" />
                        <span>Dono / Administrador</span>
                      </span>
                    ) : author.role === 'professor' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <GraduationCap className="w-2.5 h-2.5" />
                        <span>Professor(a)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>Escritor(a)</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {author.bio || 'Sem descrição biográfica disponível.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-stone-500">
                  <span className="flex items-center space-x-1" title="Livros Publicados">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>{author.books_count || 0} livros</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Artigos de Opinião">
                    <Feather className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{author.articles_count || 0} artigos</span>
                  </span>
                </div>

                <Link
                  to={`/authors/${author.id}`}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  Ver Perfil →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

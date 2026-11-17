import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Code2, Sparkles, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Book<span className="text-amber-500">Shelf</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Plataforma digital desenvolvida para democratizar a publicação de livros com estrutura editorial completa (elementos pré-textuais, textuais com ilustrações e pós-textuais) e fomentar o debate livre por meio de artigos de opinião.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 rounded-lg p-2.5 max-w-md">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Projeto Técnico apresentado na Feira do 3º ano de Desenvolvimento de Sistemas (3º DS).</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/books" className="hover:text-amber-400 transition">
                  Catálogo de Livros
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-amber-400 transition">
                  Artigos & Debates
                </Link>
              </li>
              <li>
                <Link to="/authors" className="hover:text-amber-400 transition">
                  Perfis de Autores
                </Link>
              </li>
              <li>
                <Link to="/editorial-guide" className="hover:text-amber-400 transition">
                  Guia do Modelo Editorial
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-rose-400 transition flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Painel do Administrador</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Standard */}
          <div>
            <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider mb-3">
              Padrão Editorial
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>✓ Capa, Folha de Rosto e Ficha Catalográfica (CIP)</li>
              <li>✓ Dedicatória e Epígrafe</li>
              <li>✓ Sumário Dinâmico e Prefácio</li>
              <li>✓ Capítulos com Figuras e Ilustrações</li>
              <li>✓ Posfácio e Biografia do Autor</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} BookShelf • Todos os direitos reservados para a comunidade literária.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Desenvolvido com</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para a Feira do 3º DS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

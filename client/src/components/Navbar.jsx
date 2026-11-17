import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Feather,
  FileText,
  Users,
  Shield,
  PlusCircle,
  ChevronDown,
  LogOut,
  User,
  Info,
  GraduationCap,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, isAdmin, isProfessor, isAuthor, allAuthors, switchUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full flex items-center space-x-1">
            <Shield className="w-2.5 h-2.5" />
            <span>Dono / Admin</span>
          </span>
        );
      case 'professor':
        return (
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex items-center space-x-1">
            <GraduationCap className="w-2.5 h-2.5" />
            <span>Professor(a)</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center space-x-1">
            <BookOpen className="w-2.5 h-2.5" />
            <span>Escritor(a)</span>
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Bar for 3º DS Presentation */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wider">
            3º DS • Feira
          </span>
          <span className="hidden sm:inline text-stone-300">
            Plataforma de Publicação Editorial & Artigos de Opinião
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="text-stone-400 hidden sm:inline">Conectado como:</span>
              <span className="font-bold text-white">{currentUser.name}</span>
              {currentUser.role === 'admin' ? (
                <span className="bg-rose-900 text-rose-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                  Dono
                </span>
              ) : currentUser.role === 'professor' ? (
                <span className="bg-blue-900 text-blue-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                  Professor
                </span>
              ) : (
                <span className="bg-amber-900 text-amber-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                  Autor
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/register"
                className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center space-x-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Criar Cadastro</span>
              </Link>
              <span className="text-stone-600">•</span>
              <Link
                to="/login"
                className="text-stone-300 hover:text-white transition flex items-center space-x-1"
              >
                <LogIn className="w-3 h-3" />
                <span>Entrar</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition">
                Book<span className="text-amber-700">Shelf</span>
              </div>
              <div className="text-[10px] text-stone-500 -mt-1 tracking-wider uppercase">
                Editora & Opinião
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Início
            </Link>

            <Link
              to="/books"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                isActive('/books') ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Livros</span>
            </Link>

            <Link
              to="/articles"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                isActive('/articles') ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Artigos de Opinião</span>
            </Link>

            <Link
              to="/authors"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                isActive('/authors') ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Membros & Autores</span>
            </Link>

            <Link
              to="/editorial-guide"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                isActive('/editorial-guide') ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Info className="w-4 h-4 text-stone-500" />
              <span>Guia Editorial</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                  isActive('/admin') ? 'bg-rose-50 text-rose-800 font-bold' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Shield className="w-4 h-4 text-rose-600" />
                <span>Painel do Dono</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </Link>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Escrever</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showCreateMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowCreateMenu(false)}
                >
                  <Link
                    to="/books/new"
                    className="flex items-start px-4 py-2.5 hover:bg-amber-50 transition group"
                  >
                    <BookOpen className="w-5 h-5 text-amber-700 mt-0.5 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-stone-900 group-hover:text-amber-800">
                        Novo Livro Editorial
                      </div>
                      <div className="text-xs text-stone-500">
                        Com capas, capítulos e ilustrações
                      </div>
                    </div>
                  </Link>

                  <div className="border-t border-stone-100 my-1"></div>

                  <Link
                    to="/articles/new"
                    className="flex items-start px-4 py-2.5 hover:bg-emerald-50 transition group"
                  >
                    <Feather className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-stone-900 group-hover:text-emerald-800">
                        Publicar Artigo de Opinião
                      </div>
                      <div className="text-xs text-stone-500">
                        Defenda ou discorde de uma tese
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile / Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-stone-100 transition border border-stone-200 bg-white"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                  />
                  <div className="hidden lg:block text-left pr-1">
                    <div className="text-xs font-bold text-stone-800 truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-stone-500 flex items-center space-x-1">
                      {getRoleBadge(currentUser.role)}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-500">Perfil ativo:</p>
                      <p className="text-sm font-bold text-stone-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-stone-400 truncate">{currentUser.email}</p>
                      <div className="mt-1">{getRoleBadge(currentUser.role)}</div>
                    </div>

                    <Link
                      to={`/authors/${currentUser.id}`}
                      className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition"
                    >
                      <User className="w-4 h-4 mr-2.5 text-stone-500" />
                      Meu Perfil & Minhas Obras
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 font-medium transition"
                      >
                        <Shield className="w-4 h-4 mr-2.5 text-rose-600" />
                        Painel do Dono do Site
                      </Link>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    {allAuthors.length > 1 && (
                      <>
                        <div className="px-4 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                          Outras Contas Criadas:
                        </div>

                        {allAuthors
                          .filter((u) => u.id !== currentUser.id)
                          .map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                switchUser(u);
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 text-stone-700 transition"
                            >
                              <span className="truncate">{u.name}</span>
                              <span className="text-[10px] text-stone-400 capitalize">
                                {u.role === 'admin' ? 'Dono' : u.role === 'professor' ? 'Prof.' : 'Autor'}
                              </span>
                            </button>
                          ))}

                        <div className="border-t border-stone-100 my-1"></div>
                      </>
                    )}

                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 text-xs text-amber-800 hover:bg-amber-50 font-semibold transition"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-2 text-amber-700" />
                      Cadastrar Novo Perfil
                    </Link>

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-xs text-stone-500 hover:text-red-600 flex items-center transition"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 transition"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs transition"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

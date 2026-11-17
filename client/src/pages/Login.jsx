import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/books');
      }
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Acessar BookShelf
          </h1>
          <p className="text-xs text-stone-500">
            Entre com suas credenciais cadastradas
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Entrando...' : 'Entrar na Conta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-amber-800 font-bold underline">
            Cadastre-se como Autor, Professor ou Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

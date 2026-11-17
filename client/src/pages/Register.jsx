import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import {
  UserPlus,
  BookOpen,
  GraduationCap,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User,
  School,
  ArrowRight
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Selected Role: 'author', 'professor', 'admin'
  const [role, setRole] = useState('author');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        bio,
        avatar,
        institution
      });

      // Redirect depending on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/books');
      }
    } catch (err) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Criar Cadastro no BookShelf
          </h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Escolha seu tipo de perfil para começar a publicar livros, orientar e gerenciar a plataforma.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. ROLE SELECTION CARDS */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
              1. Selecione o seu Tipo de Perfil:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Autor */}
              <div
                onClick={() => setRole('author')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  role === 'author'
                    ? 'border-amber-700 bg-amber-50/50 shadow-sm ring-1 ring-amber-700'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  {role === 'author' && <CheckCircle2 className="w-5 h-5 text-amber-700" />}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Escritor / Autor</h3>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Escreva livros com modelo editorial oficial, adicione figuras nas páginas e publique artigos.
                  </p>
                </div>
              </div>

              {/* Card 2: Professor */}
              <div
                onClick={() => setRole('professor')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  role === 'professor'
                    ? 'border-blue-700 bg-blue-50/50 shadow-sm ring-1 ring-blue-700'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  {role === 'professor' && <CheckCircle2 className="w-5 h-5 text-blue-700" />}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Professor / Educador</h3>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Perfil acadêmico para orientar alunos do DS, produzir ensaios críticos e debates reflexivos.
                  </p>
                </div>
              </div>

              {/* Card 3: Administrador */}
              <div
                onClick={() => setRole('admin')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  role === 'admin'
                    ? 'border-rose-700 bg-rose-50/50 shadow-sm ring-1 ring-rose-700'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  {role === 'admin' && <CheckCircle2 className="w-5 h-5 text-rose-700" />}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Administrador (Dono)</h3>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Controle total da plataforma: pode excluir perfis, aprovar/excluir livros e moderar todos os artigos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PERSONAL INFORMATION */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest border-t border-stone-100 pt-6">
              2. Dados de Acesso & Identificação:
            </label>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome Completo / Pseudônimo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Gabriel Silveira ou Prof. Carlos"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  E-mail de Acesso *
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
                  {role === 'professor'
                    ? 'Instituição / Disciplina (Ex: ETEC - 3º DS)'
                    : role === 'admin'
                    ? 'Cargo / Função Administrativa'
                    : 'Gênero Literário Favorito ou Cidade'}
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder={
                      role === 'professor'
                        ? 'Ex: ETEC / Desenvolvimento de Sistemas'
                        : role === 'admin'
                        ? 'Ex: Dono Geral do Sistema'
                        : 'Ex: São Paulo - SP / Ficção Científica'
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. PROFILE BIO & PICTURE */}
          <div className="space-y-4 border-t border-stone-100 pt-6">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">
              3. Foto de Perfil & Biografia:
            </label>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Breve Biografia / Apresentação
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre suas aspirações, livros favoritos ou interesses..."
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <ImageUploader
                label="Foto de Perfil"
                value={avatar}
                onChange={setAvatar}
                placeholder="URL da sua foto ou envie o arquivo do computador"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-amber-800 font-bold underline">
                Entrar agora
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Cadastrando...' : 'Finalizar Cadastro'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

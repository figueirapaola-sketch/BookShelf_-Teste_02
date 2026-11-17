import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import {
  Feather,
  Save,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function ArticleEditor() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [currentArticleId, setCurrentArticleId] = useState(paramId ? Number(paramId) : null);
  const [lastSaved, setLastSaved] = useState('');
  const [notification, setNotification] = useState('');

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Tecnologia & Arte');
  const [opinionType, setOpinionType] = useState('discordo'); // 'concordo', 'discordo', 'reflexao'
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing article if editing
  useEffect(() => {
    if (!paramId) return;
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${paramId}`);
        if (!res.ok) throw new Error('Artigo não encontrado');
        const data = await res.json();
        setCurrentArticleId(data.id);
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setCategory(data.category || 'Tecnologia & Arte');
        setOpinionType(data.opinion_type || 'discordo');
        setCoverImage(data.cover_image || '');
        setContent(data.content || '');
        setLastSaved(`Carregado (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
      } catch (err) {
        console.error('Erro ao carregar artigo para edição:', err);
      }
    }
    loadArticle();
  }, [paramId]);

  const handleSave = async (shouldNavigate = false) => {
    if (!title.trim() || !content.trim()) {
      alert('Por favor, informe título e o conteúdo do artigo antes de salvar.');
      return;
    }

    if (!currentUser) {
      alert('Você precisa estar conectado para salvar ou publicar um artigo.');
      return;
    }

    setSaving(true);
    try {
      const isUpdate = Boolean(currentArticleId);
      const url = isUpdate ? `/api/articles/${currentArticleId}` : '/api/articles';
      const method = isUpdate ? 'PUT' : 'POST';

      const payload = {
        author_id: currentUser.id,
        title,
        subtitle,
        category,
        opinion_type: opinionType,
        cover_image: coverImage,
        content
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Falha ao salvar artigo');
      }

      const data = await res.json();
      const savedId = currentArticleId || data.id;

      if (!currentArticleId && data.id) {
        setCurrentArticleId(data.id);
        window.history.replaceState(null, '', `/articles/${data.id}/edit`);
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(`Salvo às ${timeStr}`);
      setNotification(`✅ Artigo salvo com sucesso no seu perfil às ${timeStr}!`);
      setTimeout(() => setNotification(''), 5000);

      if (shouldNavigate) {
        navigate(`/articles/${savedId}`);
      }
    } catch (err) {
      alert('Erro ao salvar artigo: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(true);
  };

  const loadSampleArticle = () => {
    setTitle('O Efeito do Algoritmo na Originalidade Artística: Por que discordo das tendências automatizadas');
    setSubtitle('Como a busca obsessiva por métricas de retenção empobrece a imaginação dos novos autores.');
    setCategory('Tecnologia & Arte');
    setOpinionType('discordo');
    setCoverImage('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80');
    setContent(`Vivemos um período curioso na história da cultura ocidental: nunca tivemos tantas ferramentas para disseminar arte e, paradoxalmente, nunca estivemos tão submetidos a fórmulas idênticas.

Quando um algoritmo passa a ditar qual duração de vídeo retém mais atenção ou qual estrutura de enredo garante mais cliques no primeiro minuto, ele não está incentivando a criatividade; está selecionando o menor denominador comum.

Discordo frontalmente de que a tecnologia deva domesticar a literatura. O papel de um escritor não é alimentar o feed com dopamina barata a cada parágrafo, mas sim convidar o leitor para a travessia de um mistério que exige paciência, silêncio e reflexão.

Que a BookShelf continue sendo este porto seguro onde a divergência de ideias e o amor à arte humana tenham prioridade sobre qualquer gráfico de engajamento.`);
  };

  const CATEGORIES = [
    'Tecnologia & Arte',
    'Hábitos de Leitura',
    'Mercado Editorial & Cultura',
    'Educação & Sociedade',
    'Filosofia & Cotidiano'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-stone-900 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Feather className="w-4 h-4" />
            <span>Tribuna de Ensaios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            {currentArticleId ? 'Editar Artigo de Opinião' : 'Publicar Artigo de Opinião'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
            Defenda ou critique um conceito literário, técnico ou social de forma fundamentada.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSampleArticle}
          className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Preencher Exemplo de Opinião</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Persistent Quick Save Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-4 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Feather className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-stone-900 truncate">
              {title.trim() ? title : 'Novo Artigo (Rascunho)'}
            </p>
            <div className="flex items-center space-x-2 text-[11px]">
              {lastSaved ? (
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                  <span>{lastSaved}</span>
                </span>
              ) : (
                <span className="text-stone-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Alterações não salvas</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            title="Salvar artigo agora sem sair da página"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Artigo'}</span>
          </button>

          {currentArticleId && (
            <Link
              to={`/articles/${currentArticleId}`}
              className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-50 transition flex items-center space-x-1"
            >
              <span>Ver Publicado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Título do Artigo *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Por que discordo do fim dos livros impressos..."
            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Subtítulo / Tese Principal
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Breve frase que resume o seu argumento central"
            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Stance and Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Stance Selector */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Qual é o seu Posicionamento? *
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                  opinionType === 'discordo'
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="stance"
                  value="discordo"
                  checked={opinionType === 'discordo'}
                  onChange={() => setOpinionType('discordo')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-rose-900 block">Discordo / Crítica</span>
                  <span className="text-[11px] text-stone-500">
                    Artigo refutando ou questionando uma ideia comum.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                  opinionType === 'concordo'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="stance"
                  value="concordo"
                  checked={opinionType === 'concordo'}
                  onChange={() => setOpinionType('concordo')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Concordo / Defesa</span>
                  <span className="text-[11px] text-stone-500">
                    Artigo defendendo e apoiando um posicionamento.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                  opinionType === 'reflexao'
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="stance"
                  value="reflexao"
                  checked={opinionType === 'reflexao'}
                  onChange={() => setOpinionType('reflexao')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Reflexão Filosófica</span>
                  <span className="text-[11px] text-stone-500">
                    Análise com múltiplos ângulos e indagações.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Category & Image */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Categoria Temática
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {CATEGORIES.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <ImageUploader
                label="Imagem de Destaque do Artigo"
                value={coverImage}
                onChange={setCoverImage}
                placeholder="URL ou arquivo de imagem para o cabeçalho"
              />
            </div>
          </div>
        </div>

        {/* Content - Writing Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-stone-700">
              Corpo do Artigo / Ensaio *
            </label>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              title="Salvar artigo agora enquanto escreve"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Salvando...' : 'Salvar enquanto escreve'}</span>
            </button>
          </div>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Desenvolva seus argumentos com clareza, exemplos e reflexões..."
            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed font-serif"
          />
        </div>

        {/* Submit / Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-stone-100 gap-4">
          <span className="text-xs text-stone-500 order-2 sm:order-1">
            Autor responsável: <strong>{currentUser?.name || 'Visitante'}</strong>
          </span>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end order-1 sm:order-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-emerald-700" />
              <span>{saving ? 'Salvando...' : 'Salvar Artigo'}</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publicando...' : currentArticleId ? 'Salvar & Ver Artigo' : 'Publicar Artigo'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

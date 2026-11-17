import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import { EDITORIAL_TEMPLATE_SAMPLE } from '../utils/editorialTemplate';
import {
  BookOpen,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Info,
  CheckCircle,
  FileText,
  AlignLeft,
  ChevronDown,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function BookEditor() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [currentBookId, setCurrentBookId] = useState(paramId ? Number(paramId) : null);
  const [lastSaved, setLastSaved] = useState('');

  // Form states
  const [activeTab, setActiveTab] = useState('cover'); // 'cover', 'pretextual', 'chapters', 'posttextual'

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [genre, setGenre] = useState('Ficção Científica');
  const [synopsis, setSynopsis] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Pre-textual
  const [publisher, setPublisher] = useState('BookShelf Edições');
  const [city, setCity] = useState('São Paulo - SP');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isbn, setIsbn] = useState('');
  const [dedication, setDedication] = useState('');
  const [epigraph, setEpigraph] = useState('');
  const [epigraphAuthor, setEpigraphAuthor] = useState('');
  const [foreword, setForeword] = useState('');

  // Post-textual
  const [afterword, setAfterword] = useState('');
  const [aboutAuthor, setAboutAuthor] = useState(currentUser?.bio || '');

  // Chapters list
  const [chapters, setChapters] = useState([
    {
      title: 'Capítulo 1: O Começo',
      content: '',
      illustrations: []
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  // Load existing book for editing if paramId is present
  useEffect(() => {
    if (!paramId) return;
    async function loadBook() {
      try {
        const res = await fetch(`/api/books/${paramId}`);
        if (!res.ok) throw new Error('Livro não encontrado');
        const data = await res.json();
        setCurrentBookId(data.id);
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setGenre(data.genre || 'Ficção Científica');
        setSynopsis(data.synopsis || '');
        setCoverImage(data.cover_image || '');
        setPublisher(data.publisher || 'BookShelf Edições');
        setCity(data.city || 'São Paulo - SP');
        setYear(data.year || new Date().getFullYear().toString());
        setIsbn(data.isbn || '');
        setDedication(data.dedication || '');
        setEpigraph(data.epigraph || '');
        setEpigraphAuthor(data.epigraph_author || '');
        setForeword(data.foreword || '');
        setAfterword(data.afterword || '');
        setAboutAuthor(data.about_author || '');
        if (data.chapters && data.chapters.length > 0) {
          setChapters(data.chapters);
        }
        setLastSaved(`Carregado (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
      } catch (err) {
        console.error('Erro ao carregar livro para edição:', err);
      }
    }
    loadBook();
  }, [paramId]);

  // Load sample template from editor
  const loadEditorialSample = () => {
    setTitle(EDITORIAL_TEMPLATE_SAMPLE.title);
    setSubtitle(EDITORIAL_TEMPLATE_SAMPLE.subtitle);
    setGenre(EDITORIAL_TEMPLATE_SAMPLE.genre);
    setSynopsis(EDITORIAL_TEMPLATE_SAMPLE.synopsis);
    setCoverImage(EDITORIAL_TEMPLATE_SAMPLE.cover_image);
    setIsbn(EDITORIAL_TEMPLATE_SAMPLE.isbn);
    setPublisher(EDITORIAL_TEMPLATE_SAMPLE.publisher);
    setCity(EDITORIAL_TEMPLATE_SAMPLE.city);
    setYear(EDITORIAL_TEMPLATE_SAMPLE.year);
    setDedication(EDITORIAL_TEMPLATE_SAMPLE.dedication);
    setEpigraph(EDITORIAL_TEMPLATE_SAMPLE.epigraph);
    setEpigraphAuthor(EDITORIAL_TEMPLATE_SAMPLE.epigraph_author);
    setForeword(EDITORIAL_TEMPLATE_SAMPLE.foreword);
    setAfterword(EDITORIAL_TEMPLATE_SAMPLE.afterword);
    setAboutAuthor(EDITORIAL_TEMPLATE_SAMPLE.about_author);
    setChapters(EDITORIAL_TEMPLATE_SAMPLE.chapters);

    setNotification('✨ Modelo de exemplo editorial carregado com sucesso!');
    setTimeout(() => setNotification(''), 4000);
  };

  // Chapter operations
  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        title: `Capítulo ${chapters.length + 1}`,
        content: '',
        illustrations: []
      }
    ]);
  };

  const removeChapter = (idx) => {
    if (chapters.length === 1) {
      alert('O livro precisa ter pelo menos um capítulo.');
      return;
    }
    setChapters(chapters.filter((_, i) => i !== idx));
  };

  const updateChapterTitle = (idx, val) => {
    const updated = [...chapters];
    updated[idx].title = val;
    setChapters(updated);
  };

  const updateChapterContent = (idx, val) => {
    const updated = [...chapters];
    updated[idx].content = val;
    setChapters(updated);
  };

  // Illustration operations inside chapters
  const addIllustrationToChapter = (chapterIdx) => {
    const updated = [...chapters];
    const ch = updated[chapterIdx];
    const newIll = {
      id: Date.now(),
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      caption: `Figura ${chapterIdx + 1}.${(ch.illustrations?.length || 0) + 1}: Descrição da imagem da página`,
      position: 'top' // 'top', 'middle', 'bottom'
    };
    ch.illustrations = [...(ch.illustrations || []), newIll];
    setChapters(updated);
  };

  const updateIllustration = (chapterIdx, illIdx, field, val) => {
    const updated = [...chapters];
    updated[chapterIdx].illustrations[illIdx][field] = val;
    setChapters(updated);
  };

  const removeIllustration = (chapterIdx, illIdx) => {
    const updated = [...chapters];
    updated[chapterIdx].illustrations = updated[chapterIdx].illustrations.filter((_, i) => i !== illIdx);
    setChapters(updated);
  };

  // Save book (either update existing or create new)
  const handleSave = async (shouldNavigate = false) => {
    if (!currentUser) {
      alert('Você precisa estar conectado como autor para salvar o livro.');
      return;
    }

    let bookTitle = title.trim();
    if (!bookTitle) {
      const prompted = window.prompt('Por favor, informe o título do seu livro para salvar:', 'Meu Livro Sem Título');
      if (!prompted || !prompted.trim()) {
        setActiveTab('cover');
        return;
      }
      bookTitle = prompted.trim();
      setTitle(bookTitle);
    }

    setSaving(true);
    try {
      const bookPayload = {
        title: bookTitle,
        subtitle,
        author_id: currentUser.id,
        genre,
        synopsis,
        cover_image: coverImage,
        isbn,
        publisher,
        city,
        year,
        dedication,
        epigraph,
        epigraph_author: epigraphAuthor,
        foreword,
        afterword,
        about_author: aboutAuthor,
        chapters
      };

      const isUpdate = Boolean(currentBookId);
      const url = isUpdate ? `/api/books/${currentBookId}` : '/api/books';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookPayload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Falha ao salvar o livro');
      }

      const data = await res.json();
      const savedId = currentBookId || data.id;

      if (!currentBookId && data.id) {
        setCurrentBookId(data.id);
        window.history.replaceState(null, '', `/books/${data.id}/edit`);
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(`Salvo às ${timeStr}`);
      setNotification(`✅ Livro "${bookTitle}" salvo com sucesso no seu perfil às ${timeStr}!`);
      setTimeout(() => setNotification(''), 5000);

      if (shouldNavigate) {
        navigate(`/books/${savedId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar livro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(true);
  };

  const GENRES = [
    'Ficção Científica',
    'Fantasia & Aventura',
    'Romance & Drama',
    'Contos & Crônicas',
    'Poesia & Haicais',
    'Mistério & Suspense',
    'Não-Ficção & Ensaio',
    'Tecnologia & Sociedade',
    'Infantojuvenil'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner and Quick Template Loader */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-2xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Editor Editorial BookShelf</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Escreva e Diagrama seu Livro
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mt-1">
            Preencha os elementos que uma editora precisa ou use o modelo pronto com ilustrações para ver como funciona.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEditorialSample}
          className="bg-white hover:bg-amber-50 text-amber-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Carregar Modelo de Exemplo de Editora</span>
        </button>
      </div>

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Quick Save Bar / Persistent Status Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-4 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-stone-900 truncate">
              {title.trim() ? title : 'Novo Livro (Rascunho)'}
            </p>
            <div className="flex items-center space-x-2 text-[11px]">
              {lastSaved ? (
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600 inline" />
                  <span>{lastSaved}</span>
                </span>
              ) : (
                <span className="text-stone-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Alterações não salvas</span>
                </span>
              )}
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">{chapters.length} capítulo(s)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            title="Salvar o livro agora sem sair da página"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Livro'}</span>
          </button>

          {currentBookId && (
            <Link
              to={`/books/${currentBookId}`}
              className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-50 transition flex items-center space-x-1"
            >
              <span>Ver no Leitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Editorial Phase Tabs */}
      <div className="flex border-b border-stone-200 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('cover')}
          className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition border-b-2 flex items-center space-x-2 ${
            activeTab === 'cover'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Capa & Identificação</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pretextual')}
          className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition border-b-2 flex items-center space-x-2 ${
            activeTab === 'pretextual'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Elementos Pré-Textuais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chapters')}
          className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition border-b-2 flex items-center space-x-2 ${
            activeTab === 'chapters'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Capítulos & Figuras ({chapters.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posttextual')}
          className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition border-b-2 flex items-center space-x-2 ${
            activeTab === 'posttextual'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          <span>4. Elementos Pós-Textuais</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* TAB 1: COVER & IDENTIFICATION */}
        {activeTab === 'cover' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Identificação da Obra & Capa</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Informações visuais e catalográficas essenciais que figuram na capa e no catálogo da editora.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Título Principal do Livro *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: O Eco dos Algoritmos"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Subtítulo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ex: Crônicas de um Amanhã Conectado"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Gênero Literário
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    {GENRES.map((g, i) => (
                      <option key={i} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Sinopse Editorial (Contracapa)
                  </label>
                  <textarea
                    rows={4}
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Resumo envolvente que desperta o interesse do leitor..."
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Imagem da Capa do Livro"
                  value={coverImage}
                  onChange={setCoverImage}
                  placeholder="URL ou envie o arquivo da capa"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('pretextual')}
                className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 transition"
              >
                Próximo: Elementos Pré-Textuais →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PRE-TEXTUAL */}
        {activeTab === 'pretextual' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <span>Elementos Pré-Textuais (Normas Editoriais)</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Páginas formais que antecedem o início do texto: Folha de Rosto, Ficha Catalográfica (CIP), Dedicatória, Epígrafe e Prefácio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Editora Publicadora
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cidade de Publicação
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ano de Edição
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4">
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Código ISBN / Registro de Ficha Catalográfica
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Ex: 978-65-80123-45-9"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Código padronizado de identificação do livro internacional. Se deixar em branco, geramos um provisório.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-stone-100 pt-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Dedicatória do Autor
                </label>
                <textarea
                  rows={3}
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="Ex: Dedico este livro aos meus pais e a todos os leitores sonhadores..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm italic"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Epígrafe (Citação inspiradora)
                  </label>
                  <textarea
                    rows={2}
                    value={epigraph}
                    onChange={(e) => setEpigraph(e.target.value)}
                    placeholder="Ex: 'O futuro já chegou — só não está uniformemente distribuído.'"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm italic"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={epigraphAuthor}
                    onChange={(e) => setEpigraphAuthor(e.target.value)}
                    placeholder="Autor da citação (Ex: William Gibson)"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4">
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Prefácio / Apresentação da Obra
              </label>
              <textarea
                rows={4}
                value={foreword}
                onChange={(e) => setForeword(e.target.value)}
                placeholder="Texto de introdução que situa o leitor no tema do livro..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('cover')}
                className="text-stone-600 hover:text-stone-900 text-sm font-semibold"
              >
                ← Voltar para Capa
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chapters')}
                className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 transition"
              >
                Próximo: Capítulos & Ilustrações →
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CHAPTERS & ILLUSTRATIONS */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Área de Escrita dos Capítulos:</span> Escreva sua história abaixo e insira ilustrações.
                  Você pode salvar o livro a qualquer momento sem perder o que escreveu!
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 shrink-0 self-end sm:self-auto cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Salvando...' : 'Salvar Livro Agora'}</span>
              </button>
            </div>

            {chapters.map((ch, chIdx) => (
              <div
                key={chIdx}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {chIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={ch.title}
                      onChange={(e) => updateChapterTitle(chIdx, e.target.value)}
                      placeholder="Título do Capítulo"
                      className="font-bold text-base text-stone-900 px-2 py-1 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 w-full max-w-md"
                    />
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      title="Salvar alterações do livro agora"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-700" />
                      <span>{saving ? 'Salvando...' : 'Salvar Livro'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeChapter(chIdx)}
                      className="text-stone-400 hover:text-red-600 transition p-1"
                      title="Excluir capítulo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chapter Text Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Texto do Capítulo
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="text-amber-700 hover:text-amber-900 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                      title="Salvar alterações enquanto escreve"
                    >
                      <Save className="w-3 h-3 text-amber-700" />
                      <span>Salvar enquanto escreve</span>
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    value={ch.content}
                    onChange={(e) => updateChapterContent(chIdx, e.target.value)}
                    placeholder="Escreva a narrativa, parágrafos ou diálogos deste capítulo..."
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed font-serif"
                  />
                </div>

                {/* Illustrations Section for this Chapter */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-700" />
                      <span>Figuras & Ilustrações da Página ({ch.illustrations?.length || 0})</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => addIllustrationToChapter(chIdx)}
                      className="bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 shadow-2xs transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-700" />
                      <span>Adicionar Figura nesta Página</span>
                    </button>
                  </div>

                  {ch.illustrations && ch.illustrations.length > 0 ? (
                    <div className="space-y-4 pt-2">
                      {ch.illustrations.map((ill, illIdx) => (
                        <div
                          key={ill.id || illIdx}
                          className="bg-white rounded-xl p-4 border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative"
                        >
                          <div className="md:col-span-3">
                            <img
                              src={ill.url}
                              alt={ill.caption}
                              className="w-full h-24 object-cover rounded-lg border border-stone-200"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200';
                              }}
                            />
                          </div>

                          <div className="md:col-span-8 space-y-2">
                            <div>
                              <label className="text-[11px] font-semibold text-stone-600 block">
                                URL da Imagem / Ilustração:
                              </label>
                              <input
                                type="url"
                                value={ill.url}
                                onChange={(e) => updateIllustration(chIdx, illIdx, 'url', e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[11px] font-semibold text-stone-600 block">
                                  Legenda da Figura:
                                </label>
                                <input
                                  type="text"
                                  value={ill.caption}
                                  onChange={(e) => updateIllustration(chIdx, illIdx, 'caption', e.target.value)}
                                  placeholder="Ex: Figura 1.1: O laboratório"
                                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs italic"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-semibold text-stone-600 block">
                                  Posição na Página:
                                </label>
                                <select
                                  value={ill.position || 'top'}
                                  onChange={(e) => updateIllustration(chIdx, illIdx, 'position', e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                                >
                                  <option value="top">Início (Topo da Página)</option>
                                  <option value="middle">Meio (Entre os Parágrafos)</option>
                                  <option value="bottom">Fim (Rodapé do Capítulo)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeIllustration(chIdx, illIdx)}
                              className="text-stone-400 hover:text-red-600 p-1 transition"
                              title="Remover figura"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-stone-400 italic">
                      Nenhuma ilustração adicionada neste capítulo ainda.
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={addChapter}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Mais um Capítulo</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  title="Salvar alterações sem sair da edição"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Salvando...' : 'Salvar Livro (Continuar Escrevendo)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('posttextual')}
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 transition cursor-pointer"
                >
                  Próximo: Elementos Pós-Textuais →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: POST-TEXTUAL & PUBLISH */}
        {activeTab === 'posttextual' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
                <AlignLeft className="w-5 h-5 text-amber-700" />
                <span>Elementos Pós-Textuais & Finalização</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Encerramento da obra: Posfácio e Biografia sobre o Autor para contracapa ou orelha.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Posfácio / Considerações Finais
              </label>
              <textarea
                rows={4}
                value={afterword}
                onChange={(e) => setAfterword(e.target.value)}
                placeholder="Mensagem final ao leitor após o encerramento da história..."
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Sobre o Autor (Orelha / Contracapa)
              </label>
              <textarea
                rows={3}
                value={aboutAuthor}
                onChange={(e) => setAboutAuthor(e.target.value)}
                placeholder="Breve biografia do autor, sua cidade, interesses e outras publicações..."
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <p className="font-bold mb-1">Pronto para Publicar!</p>
              Ao clicar em <strong>"Publicar Livro Oficial"</strong>, sua obra será diagramada automaticamente no leitor com todas as partes pré-textuais, ficha catalográfica e capítulos ilustrados.
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveTab('chapters')}
                className="text-stone-600 hover:text-stone-900 text-sm font-semibold"
              >
                ← Voltar para Capítulos
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center space-x-2 text-base disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Publicando...' : 'Publicar Livro Oficial'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Feather,
  ArrowLeft,
  ThumbsUp,
  Eye,
  MessageSquare,
  Trash2,
  Edit3,
  Share2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  User
} from 'lucide-react';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // New comment state
  const [commentText, setCommentText] = useState('');
  const [commentOpinion, setCommentOpinion] = useState('concordo'); // 'concordo' or 'discordo'
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error('Artigo não encontrado');
        const data = await res.json();
        setArticle(data);
        setLikes(data.likes_count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      const res = await fetch(`/api/articles/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes_count);
        setHasLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentUser) {
      alert('Você precisa estar conectado para comentar.');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/articles/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          content: commentText,
          opinion_type: commentOpinion
        })
      });

      if (res.ok) {
        const newC = await res.json();
        setArticle((prev) => ({
          ...prev,
          comments: [newC, ...(prev.comments || [])]
        }));
        setCommentText('');
      }
    } catch (err) {
      alert('Erro ao enviar comentário.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Excluir este comentário?')) return;
    try {
      const res = await fetch(`/api/articles/${id}/comments/${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setArticle((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId)
        }));
      }
    } catch (err) {
      alert('Erro ao excluir comentário.');
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Artigo excluído com sucesso.');
        navigate('/articles');
      }
    } catch (err) {
      alert('Erro ao excluir artigo.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400">
        Carregando artigo...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-stone-700 font-bold mb-4">Artigo não encontrado.</p>
        <Link to="/articles" className="text-emerald-700 underline">
          Voltar para os artigos
        </Link>
      </div>
    );
  }

  const isOwnerOrAdmin = isAdmin || currentUser?.id === article.author_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button and actions */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <Link
          to="/articles"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para todos os artigos</span>
        </Link>

        {isOwnerOrAdmin && (
          <div className="flex items-center space-x-3">
            <Link
              to={`/articles/${article.id}/edit`}
              className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition"
              title="Editar este artigo"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Artigo</span>
            </Link>
            <button
              onClick={handleDeleteArticle}
              className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Artigo</span>
            </button>
          </div>
        )}
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        {/* Category & Opinion Stance */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
            {article.category}
          </span>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 ${
              article.opinion_type === 'discordo'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : article.opinion_type === 'concordo'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {article.opinion_type === 'discordo' && <XCircle className="w-3.5 h-3.5 text-rose-700" />}
            {article.opinion_type === 'concordo' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
            {article.opinion_type === 'reflexao' && <HelpCircle className="w-3.5 h-3.5 text-amber-700" />}
            <span>
              {article.opinion_type === 'discordo'
                ? 'Ponto de Vista: Discordância Crítica'
                : article.opinion_type === 'concordo'
                ? 'Ponto de Vista: Concordância & Defesa'
                : 'Ponto de Vista: Ensaio Reflexivo'}
            </span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-stone-600 font-serif leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Author info bar */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(article.author_name)}`}
                alt={article.author_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Link
                to={`/authors/${article.author_id}`}
                className="text-sm font-bold text-stone-900 hover:text-emerald-800 underline block"
              >
                {article.author_name}
              </Link>
              <div className="text-[11px] text-stone-500">
                Publicado em {new Date(article.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-stone-500">
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.views_count || 0} visualizações</span>
            </span>

            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                hasLiked
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {article.cover_image && (
        <div className="rounded-2xl overflow-hidden shadow-md max-h-[420px] bg-stone-100">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content */}
      <article className="prose prose-stone max-w-none font-serif text-base sm:text-lg text-stone-800 leading-relaxed whitespace-pre-line text-justify border-b border-stone-200 pb-12">
        {article.content}
      </article>

      {/* COMMENTS & DEBATE SECTION */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-2xl text-stone-900 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-emerald-700" />
            <span>Debate dos Leitores ({article.comments?.length || 0})</span>
          </h3>
          <span className="text-xs text-stone-500">Expresse seu posicionamento</span>
        </div>

        {/* Comment Input Box */}
        <form onSubmit={handleAddComment} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">Seu comentário / opinião:</span>
            <div className="flex space-x-1.5 text-xs">
              <button
                type="button"
                onClick={() => setCommentOpinion('concordo')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  commentOpinion === 'concordo'
                    ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ✓ Concordo com o autor
              </button>
              <button
                type="button"
                onClick={() => setCommentOpinion('discordo')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  commentOpinion === 'discordo'
                    ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-400'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ✕ Discordo do autor
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Escreva seu comentário defendendo ou contestando os argumentos deste artigo...`}
            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone-500">
              Comentando como: <strong>{currentUser?.name || 'Visitante'}</strong>
            </span>
            <button
              type="submit"
              disabled={submittingComment}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingComment ? 'Publicando...' : 'Publicar Opinião'}</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={
                        comment.user_avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.user_name)}`
                      }
                      alt={comment.user_name}
                      className="w-7 h-7 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">
                        {comment.user_name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comment.opinion_type === 'discordo'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {comment.opinion_type === 'discordo' ? 'Discorda' : 'Concorda'}
                    </span>

                    {(isAdmin || currentUser?.id === comment.user_id) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Excluir comentário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans pl-9">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-400 italic">
              Nenhum comentário ainda. Participe do debate deixando sua opinião acima!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Layers,
  AlignLeft,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { EDITORIAL_SECTIONS_GUIDE } from '../utils/editorialTemplate';

export default function EditorialGuide() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Prático da Publicação Editorial</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
          O que uma Editora Real precisa para publicar um Livro?
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Na <strong>BookShelf</strong>, cada livro publicado segue os padrões acadêmicos e editoriais da ABNT e da Câmara Brasileira do Livro (CBL). Conheça a anatomia de um livro profissional:
        </p>
      </div>

      {/* 3 Core Blocks */}
      <div className="space-y-8">
        {/* BLOCK 1: PRE-TEXTUAL */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-100 pb-4">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold font-serif flex items-center justify-center text-lg">
              1
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Elementos Pré-Textuais
              </h2>
              <p className="text-xs text-stone-500">
                Páginas obrigatórias que antecedem o início da história e asseguram a legalidade e autoria da obra.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>Folha de Rosto & Identificação</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Contém o nome do autor, título completo, subtítulo, cidade, editora publicadora e ano de edição. É a certidão de nascimento da obra impressa.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Ficha Catalográfica (CIP) & ISBN</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                O ISBN (International Standard Book Number) é o código de barras internacional do livro. O quadro de Catalogação na Publicação classifica a obra segundo o sistema decimal de Dewey (CDD) para bibliotecas de todo o planeta.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Dedicatória & Epígrafe</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A dedicatória homenageia pessoas especiais na vida do escritor. A epígrafe traz uma citação inspiradora de outro pensador que sintetiza o espírito da obra.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Sumário & Prefácio</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                O sumário lista os capítulos na exata ordem em que surgem. O prefácio situa o leitor no contexto da escrita, podendo ser redigido pelo próprio autor ou por um convidado de prestígio.
              </p>
            </div>
          </div>
        </div>

        {/* BLOCK 2: TEXTUAL */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-100 pb-4">
            <span className="w-10 h-10 rounded-xl bg-amber-700 text-white font-bold font-serif flex items-center justify-center text-lg">
              2
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Elementos Textuais & Ilustrações
              </h2>
              <p className="text-xs text-stone-500">
                O miolo do livro, onde o enredo ou análise teórica ganham forma.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Capítulos & Ritmo Narrativo</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Divisões temáticas ou cronológicas que dão pausas naturais à respiração da leitura.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Figuras & Ilustrações de Página</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Na BookShelf, cada página de capítulo permite anexar figuras com legendas formais (ex: "Figura 1.1") e escolher sua posição (topo, meio ou rodapé), enriquecendo livros infantis, técnicos e romances ilustrados.
              </p>
            </div>
          </div>
        </div>

        {/* BLOCK 3: POST-TEXTUAL */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-100 pb-4">
            <span className="w-10 h-10 rounded-xl bg-stone-900 text-white font-bold font-serif flex items-center justify-center text-lg">
              3
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Elementos Pós-Textuais
              </h2>
              <p className="text-xs text-stone-500">
                O fechamento da experiência do leitor e o contato duradouro com o autor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <AlignLeft className="w-4 h-4 text-stone-700" />
                <span>Posfácio & Agradecimentos</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Reflexão madura do autor após a história terminada, explicando o impacto da escrita e agradecendo aos colaboradores.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-bold text-stone-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-stone-700" />
                <span>Sobre o Autor & Contracapa</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A tradicional orelha do livro com foto do autor, sua cidade natal, prêmios e sinopse de contracapa que convida novos leitores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
        <h3 className="font-serif text-2xl font-bold">
          Quer ver este modelo funcionando na prática?
        </h3>
        <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto">
          Nosso livro modelo oficial já vem diagramado com todos estes elementos e ilustrações nas páginas para você folhear ou usar como base.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/books/1"
            className="bg-white hover:bg-stone-100 text-stone-900 font-bold px-6 py-3 rounded-xl text-sm shadow transition flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Folhear Livro Modelo de Exemplo</span>
          </Link>

          <Link
            to="/books/new"
            className="bg-amber-950/80 hover:bg-amber-950 text-white font-bold px-6 py-3 rounded-xl text-sm transition border border-amber-500/40 flex items-center space-x-2"
          >
            <span>Escrever Meu Próprio Livro</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

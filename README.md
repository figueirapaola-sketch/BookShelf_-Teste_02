# 📖 BookShelf — Plataforma Editorial & Artigos de Opinião

> **Projeto Desenvolvido para o 3º DS (Desenvolvimento de Sistemas)**  
> Apresentação prática para feiras técnicas e literárias.

---

## 🌟 Sobre o Projeto

O **BookShelf** é uma plataforma web completa projetada para democratizar a publicação de livros com o mesmo rigor estrutural exigido por **editoras profissionais**, além de oferecer um espaço dinâmico de **artigos de opinião** para que autores debatam e defendam pontos de vista ("concordo", "discordo", "reflexão").

Construído com **Node.js**, **React (Tailwind CSS)** e **SQLite** nativo, o sistema é **100% autônomo e funciona offline**, garantindo estabilidade total em estandes de feiras escolares sem depender de conexão com a internet externa.

---

## 📚 Funcionalidades Principais

### 1. Editor & Estrutura Editorial Profissional
O sistema divide o livro nas três fases fundamentais de uma publicação:
- **Elementos Pré-Textuais**:
  - Capa com arte e tipografia
  - Folha de Rosto (Autoria, Cidade, Editora, Ano)
  - **Ficha Catalográfica (CIP)** formatada no padrão bibliotecário com código ISBN fictício ou real
  - Dedicatória e Epígrafe com autoria da citação
  - Sumário dinâmico e Prefácio / Apresentação
- **Elementos Textuais**:
  - Capítulos organizados e reordenáveis
  - **Ilustrações / Figuras por página**: suporte para adicionar gravuras nas páginas com legendas (ex: *"Figura 1.1"*) e escolha de posição (*topo, meio ou rodapé da página*).
- **Elementos Pós-Textuais**:
  - Posfácio e considerações finais
  - Orelha do livro com **"Sobre o Autor"** e foto
  - Contracapa com sinopse de impacto

> ✨ **Modelo de Exemplo de Editora**: O livro *"O Eco dos Algoritmos: Crônicas de um Amanhã Conectado"* já vem pré-instalado com todas as seções e ilustrações preenchidas para demonstração imediata na feira! No editor, há também o botão *"Carregar Modelo de Exemplo"* que preenche um livro inteiro em 1 segundo.

### 2. Leitor Interativo (Book Reader)
- Experiência visual de folheio de livro real (`book-paper`).
- Sumário retrátil navegável com 1 clique para qualquer parte da obra.
- Alternador de modos de leitura: **Papel Editorial** (creme), **Claro** (branco puro) e **Noturno** (escuro).
- Ajuste de tamanho de fonte (A-, A, A+) e botão de impressão/PDF.
- Contador de leituras e curtidas em tempo real.

### 3. Espaço de Artigos de Opinião & Debates
- Publicação de ensaios e artigos opinativos onde autores se posicionam abertamente:
  - ✕ **Discordo / Crítica**
  - ✓ **Concordo / Defesa**
  - ✦ **Reflexão Filosófica / Neutra**
- Categorias temáticas (*Tecnologia & Arte, Hábitos de Leitura, Educação, Mercado Editorial*).
- Seção de debate nos artigos, onde leitores podem comentar expressando se concordam ou discordam da tese.

### 4. Perfis de Autores
- Foto de perfil (upload do computador ou galeria rápida).
- Biografia do autor e dados de contato.
- Vitrine com abas automáticas contendo **todos os livros** e **todos os artigos** que o autor já escreveu.
- Edição do próprio perfil em modal intuitivo.

### 5. Níveis de Acesso: Escritor vs. Administrador (Dono do Site)
- **Perfil de Escritor**: cria e edita suas próprias obras e artigos, participa dos debates.
- **Perfil de Administrador (Dono do Site)**:
  - **Dashboard Administrativo Geral** com métricas completas (usuários, livros, capítulos, artigos, comentários).
  - Capacidade de **excluir qualquer perfil/usuário**.
  - Capacidade de **adicionar, editar ou excluir qualquer livro** do catálogo geral.
  - Capacidade de **moderar ou excluir qualquer artigo de opinião**.

### 6. Recurso Especial para a Feira: Troca Rápida de Perfil
No topo de todas as páginas, há uma barra de demonstração que permite alternar instantaneamente com 1 clique entre:
- 🛡️ **Administrador Geral** (Dono do site)
- ✍️ **Helena Souza** (Escritora de ficção científica e autora do livro modelo)
- ✍️ **Prof. Carlos Mendes** (Ensaísta e crítico)
- 🚀 **Autor Visitante da Feira** (Perfil livre para qualquer visitante do estande testar na hora)

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js com Express.
- **Banco de Dados**: SQLite Nativo (`node:sqlite`), sem necessidade de instalar servidores MySQL externos nem drivers nativos pesados.
- **Uploads**: Multer com armazenamento local na pasta `server/uploads/` e suporte a URLs e presets.
- **Frontend**: React 19 com Vite, Tailwind CSS v4, Lucide React (ícones modernos) e React Router DOM.
- **Design & Tipografia**: Fontes Lora (estilo editorial clássico) e Plus Jakarta Sans.

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Sistema (Modo Integrado - Recomendado para a Feira)

No terminal do projeto, execute:

```bash
npm start
```

Pronto! Acesse no navegador:
👉 **http://localhost:5000**

*(O servidor Node.js já entrega a API e o aplicativo React compilado com todas as imagens e dados pré-carregados).*

---

### 2. Modo Desenvolvimento (Hot Reload)

Se desejar alterar código e ver atualizações em tempo real:

**Terminal 1 (Backend):**
```bash
npm run dev:server
```

**Terminal 2 (Frontend):**
```bash
npm run dev:client
```

Acesse em: **http://localhost:3000** (com proxy automático para a API).

---

## 👨‍💻 Créditos
Projeto desenvolvido com carinho para o **3º DS** — Feira Técnica e Literária.

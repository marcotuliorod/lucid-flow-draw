# Free Flow Process

Editor online de processos e fluxogramas - Crie diagramas de forma simples e intuitiva.

## 🚀 Sobre o Projeto

Free Flow Process é uma aplicação web moderna para criação e edição de diagramas de processos, fluxogramas e processos BPMN. Desenvolvida com React, TypeScript e integrada com Supabase para persistência de dados.

### ✨ Funcionalidades

- 📊 **Editor Visual**: Interface drag-and-drop intuitiva
- 🎨 **Elementos BPMN**: Suporte completo a elementos de processo
- 💾 **Salvamento Automático**: Seus projetos são salvos automaticamente
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🔐 **Autenticação**: Sistema seguro de login e registro
- 📤 **Exportação PDF**: Exporte seus diagramas em alta qualidade
- 🌙 **Tema Escuro/Claro**: Interface adaptável às suas preferências

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Build Tool**: Vite
- **Deploy**: Lovable Platform

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase (para backend)

**URL**: https://lovable.dev/projects/c3ec2516-aaa9-4fcb-b3a7-76ab00b0488c

## 🚀 Como começar

### Desenvolvimento Local

1. **Clone o repositório**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Instale as dependências**
   ```sh
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```sh
   # Crie um arquivo .env.local com:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Inicie o servidor de desenvolvimento**
   ```sh
   npm run dev
   ```

### Outras formas de editar

**Via Lovable (Recomendado)**
- Acesse o [Projeto Lovable](https://lovable.dev/projects/c3ec2516-aaa9-4fcb-b3a7-76ab00b0488c)
- Faça mudanças via chat com AI
- Deploy automático

**GitHub Codespaces**
- Clique em "Code" → "Codespaces" → "New codespace"
- Edite diretamente no browser

**Edição direta no GitHub**
- Navegue até o arquivo desejado
- Clique no ícone de edição (lápis)
- Faça commit das mudanças

## 🏗️ Arquitetura

### Frontend
```
src/
├── components/          # Componentes reutilizáveis
│   ├── editor/         # Componentes do editor
│   ├── auth/           # Componentes de autenticação
│   └── ui/             # Componentes base (shadcn/ui)
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
└── types/              # Definições de tipos TypeScript
```

### Backend (Supabase)
- **Database**: PostgreSQL com Row Level Security
- **Auth**: Sistema completo de autenticação
- **Storage**: Armazenamento de arquivos e imagens
- **Real-time**: Sincronização em tempo real

## 📦 Scripts Disponíveis

```sh
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview da build
npm run lint         # Verificar qualidade do código
```

## 🚀 Deploy

### Via Lovable (Recomendado)
1. Acesse [Lovable](https://lovable.dev/projects/c3ec2516-aaa9-4fcb-b3a7-76ab00b0488c)
2. Clique em "Publish"
3. Configure domínio (opcional)

### Domínio Customizado
- Navegue até Project > Settings > Domains
- Clique em "Connect Domain"
- Siga as instruções DNS

### Deploy Manual
Consulte [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para instruções detalhadas.

## 🔧 Configuração

### Supabase Setup
1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as tabelas usando as migrations em `supabase/migrations/`
3. Ative Row Level Security
4. Configure políticas de acesso

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testes

```sh
npm run test         # Executar testes
npm run test:watch   # Modo watch
npm run test:coverage # Cobertura de testes
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📖 [Documentação](https://docs.lovable.dev/)
- 💬 [Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🎥 [Tutoriais YouTube](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

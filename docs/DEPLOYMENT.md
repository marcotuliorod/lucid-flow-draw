# Guia de Deployment

## Deploy no Lovable

### Pré-requisitos
- Projeto configurado no Lovable
- Conta conectada ao Supabase
- Todos os testes passando

### Passos para Deploy

1. **Verificar configurações**
   ```bash
   # Verificar se todas as variáveis estão configuradas
   npm run build
   ```

2. **Deploy via Lovable**
   - Acesse seu projeto no Lovable
   - Clique em "Publish" no canto superior direito
   - Escolha o domínio (yourapp.lovable.app ou domínio customizado)
   - Confirme o deploy

### Configurações de Produção

#### Supabase
- Verificar Row Level Security (RLS) ativado
- Confirmar políticas de segurança
- Testar autenticação em produção

#### Performance
- Build otimizada ativada
- Assets minificados
- Lazy loading implementado

#### SEO
- Meta tags configuradas
- Structured data implementado
- Robots.txt configurado

### Monitoramento

#### Analytics (Opcional)
Para adicionar Google Analytics:
```html
<!-- Adicionar no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

#### Error Tracking (Opcional)
Para adicionar Sentry:
```bash
npm install @sentry/react
```

### Domínio Customizado

1. **Configurar no Lovable**
   - Vá em Project > Settings > Domains
   - Clique em "Connect Domain"
   - Siga as instruções DNS

2. **Atualizar URLs**
   - Atualizar canonical links
   - Atualizar Open Graph URLs
   - Atualizar Supabase redirect URLs

### Checklist de Deploy

- [ ] Build sem erros
- [ ] Testes passando
- [ ] Supabase funcionando
- [ ] Meta tags atualizadas
- [ ] Performance otimizada
- [ ] Error boundaries funcionando
- [ ] Loading states implementados
- [ ] Responsivo em todos dispositivos
- [ ] Accessible (a11y)
- [ ] SEO otimizado

### Rollback

Se algo der errado:
1. No Lovable, vá para o histórico do projeto
2. Encontre a versão anterior estável
3. Clique em "Revert to this version"

### Manutenção

#### Atualizações Regulares
- Monitorar logs do Supabase
- Verificar performance no lighthouse
- Atualizar dependências mensalmente
- Backup regular dos dados

#### Troubleshooting Comum

**Build falhando:**
```bash
# Limpar cache
rm -rf node_modules
npm install
npm run build
```

**Supabase connection issues:**
- Verificar URLs e keys
- Testar conectividade
- Verificar CORS settings

**Performance issues:**
- Verificar bundle size
- Otimizar imagens
- Revisar lazy loading
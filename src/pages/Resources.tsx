import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow, 
  Users, 
  Download, 
  Zap, 
  ArrowLeft,
  Palette,
  MousePointer,
  Move,
  RotateCcw,
  Share2,
  FileDown,
  Cloud,
  Lock,
  Sparkles,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Resources = () => {
  const features = [
    {
      category: "Ferramentas de Desenho",
      items: [
        {
          icon: MousePointer,
          title: "Seleção Inteligente",
          description: "Selecione e manipule elementos com precisão usando nossa ferramenta de seleção avançada",
          tag: "Básico"
        },
        {
          icon: Palette,
          title: "Formas Variadas",
          description: "Crie elementos com formas predefinidas: retângulos, círculos, losangos e formas especiais para processos",
          tag: "Essencial"
        },
        {
          icon: Move,
          title: "Conectores Automáticos",
          description: "Conecte elementos automaticamente com setas inteligentes que se ajustam ao layout",
          tag: "Inteligente"
        },
        {
          icon: Layers,
          title: "Camadas Organizadas",
          description: "Organize seus elementos em camadas para melhor controle visual e estrutural",
          tag: "Pro"
        }
      ]
    },
    {
      category: "Edição e Personalização",
      items: [
        {
          icon: Sparkles,
          title: "Edição de Texto",
          description: "Edite textos diretamente nos elementos com duplo clique para personalização rápida",
          tag: "Básico"
        },
        {
          icon: RotateCcw,
          title: "Histórico de Ações",
          description: "Desfaça e refaça ações com controle completo sobre o histórico de modificações",
          tag: "Útil"
        },
        {
          icon: Zap,
          title: "Zoom Dinâmico",
          description: "Ajuste o zoom para trabalhar com precisão ou visualizar o projeto completo",
          tag: "Navegação"
        }
      ]
    },
    {
      category: "Colaboração e Compartilhamento",
      items: [
        {
          icon: Users,
          title: "Projetos Privados",
          description: "Crie e gerencie projetos privados com segurança e controle de acesso",
          tag: "Segurança"
        },
        {
          icon: Share2,
          title: "Compartilhamento Fácil",
          description: "Compartilhe seus projetos com colegas e clientes de forma simples e eficiente",
          tag: "Colaboração"
        },
        {
          icon: Cloud,
          title: "Salvamento Automático",
          description: "Seus projetos são salvos automaticamente na nuvem, sem perda de dados",
          tag: "Automático"
        }
      ]
    },
    {
      category: "Exportação e Integração",
      items: [
        {
          icon: FileDown,
          title: "Exportação Múltipla",
          description: "Exporte seus fluxos em diversos formatos: PNG, SVG, PDF e mais",
          tag: "Flexível"
        },
        {
          icon: Download,
          title: "Templates Prontos",
          description: "Acesse uma biblioteca de templates para diferentes tipos de processos",
          tag: "Produtividade"
        },
        {
          icon: Lock,
          title: "Segurança Avançada",
          description: "Proteção completa dos dados com criptografia e backup automático",
          tag: "Segurança"
        }
      ]
    }
  ];

  const getTagColor = (tag: string) => {
    const colors = {
      "Básico": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Essencial": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      "Inteligente": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Pro": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      "Útil": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      "Navegação": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      "Segurança": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "Colaboração": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "Automático": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Flexível": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Produtividade": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
    };
    return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">Free Flow Process</span>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-light">
                Sobre
              </Button>
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                Recursos
              </Button>
              <Button 
                asChild
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-light"
              >
                <Link to="/login">Entrar</Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full border border-purple-200 dark:border-purple-800 mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Recursos Completos</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extralight text-slate-900 dark:text-white leading-tight mb-6">
            Tudo que você precisa para
            <span className="block text-purple-600 font-light">criar fluxos perfeitos</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl mx-auto">
            Descubra todas as funcionalidades do Free Flow Process e como elas podem transformar 
            sua forma de criar e documentar processos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-16">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-light text-slate-900 dark:text-white mb-8 text-center">
                {category.category}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((feature, featureIndex) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={featureIndex} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <Badge className={getTagColor(feature.tag)}>
                            {feature.tag}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-medium text-slate-900 dark:text-white">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700">
          <h3 className="text-3xl font-light text-slate-900 dark:text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Experimente todos estes recursos gratuitamente e transforme sua forma de trabalhar com processos.
          </p>
          <Button 
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            size="lg"
          >
            <Link to="/login">
              Começar agora
              <Zap className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Resources;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PenTool, Users, Download, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  if (isLoggedIn) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <PenTool className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">ProcessFlow</span>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-light">
                Sobre
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-light">
                Recursos
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Inovação em processos</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extralight text-slate-900 dark:text-white leading-tight">
                Desenhe processos de forma
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 font-light"> inteligente</span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-lg">
                Crie, edite e compartilhe diagramas de processos com uma interface moderna e intuitiva. 
                Transforme ideias complexas em fluxos visuais simples.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "Interface intuitiva e moderna",
                "Colaboração em tempo real",
                "Exportação profissional em PDF"
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-light">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                onClick={() => handleLogin('Google')}
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                size="lg"
              >
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-light">
                Gratuito • Sem cartão de crédito
              </p>
            </div>
          </div>

          {/* Right Content - Process Flow Visualization */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
              {/* Process Flow Diagram */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Exemplo de Processo</h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
                </div>
                
                {/* Flow Steps */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">Início</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center space-x-4 pl-8">
                    <div className="w-20 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">Processo</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700"></div>
                  </div>

                  {/* Decision */}
                  <div className="flex items-center space-x-4 pl-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm transform rotate-45">
                      <span className="text-white text-xs font-medium transform -rotate-45">OK?</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center space-x-4 pl-8">
                    <div className="w-16 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">Fim</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -z-10 top-8 left-8 w-72 h-72 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>

        {/* Login Modal */}
        <div className="mt-16 flex justify-center">
          <Card className="max-w-md w-full p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-light text-slate-900 dark:text-white mb-2">
                  Entre na plataforma
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-light">
                  Escolha sua forma preferida de acesso
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => handleLogin('Google')}
                  className="w-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 py-3 rounded-xl font-light"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Entrar com Google
                </Button>

                <Button 
                  onClick={() => handleLogin('Facebook')}
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white transition-all duration-200 py-3 rounded-xl font-light"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Entrar com Facebook
                </Button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-light">
                Ao continuar, você concorda com nossos Termos de Uso
              </p>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-8 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <PenTool className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3">Interface Intuitiva</h3>
            <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">Design moderno e limpo que permite criar processos rapidamente sem complexidade</p>
          </div>

          <div className="text-center p-8 group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3">Colaboração</h3>
            <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">Compartilhe e colabore em tempo real com sua equipe de forma eficiente</p>
          </div>

          <div className="text-center p-8 group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Download className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3">Exportação PDF</h3>
            <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">Exporte seus processos em PDF com qualidade profissional e layout otimizado</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

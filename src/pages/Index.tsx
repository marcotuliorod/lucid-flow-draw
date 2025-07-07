
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Workflow, Users, Download, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
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
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-light">
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

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full border border-purple-200 dark:border-purple-800">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Fluxo livre de ideias</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extralight text-slate-900 dark:text-white leading-tight">
                Desenhe processos com
                <span className="block text-purple-600 font-light"> fluidez total</span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-lg">
                Liberte sua criatividade com Free Flow Process. Crie, edite e compartilhe diagramas 
                de processos sem limitações, com uma interface que flui naturalmente com suas ideias.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "Design fluido e intuitivo",
                "Colaboração em tempo real",
                "Exportação profissional"
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
                onClick={handleGetStarted}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                size="lg"
              >
                Comece seu fluxo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-light">
                Gratuito • Fluxo livre • Sem limitações
              </p>
            </div>
          </div>

          {/* Right Content - Process Flow Visualization */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-800 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
              {/* Process Flow Diagram */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Fluxo de Exemplo</h3>
                  <div className="w-16 h-0.5 bg-purple-500 mx-auto"></div>
                </div>
                
                {/* Flow Steps */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">Início</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center space-x-4 pl-8">
                    <div className="w-20 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">Processo</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                  </div>

                  {/* Decision */}
                  <div className="flex items-center space-x-4 pl-4">
                    <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center shadow-sm transform rotate-45">
                      <span className="text-white text-xs font-medium transform -rotate-45">OK?</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center space-x-4 pl-8">
                    <div className="w-16 h-12 bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">Fim</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -z-10 top-8 left-8 w-72 h-72 bg-purple-100 dark:bg-purple-900 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-8 group">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Workflow className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3">Fluxo Natural</h3>
            <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">Interface que se adapta ao seu modo de pensar, permitindo criar processos de forma orgânica</p>
          </div>

          <div className="text-center p-8 group">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3">Colaboração Fluida</h3>
            <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">Trabalhe em equipe com sincronização em tempo real e compartilhamento simplificado</p>
          </div>

          <div className="text-center p-8 group">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Download className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3">Exportação Elegante</h3>
            <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">Exporte seus fluxos em alta qualidade com layouts profissionais e personalizáveis</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

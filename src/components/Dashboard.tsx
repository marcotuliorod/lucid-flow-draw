
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Plus, 
  FileText, 
  Calendar, 
  Download,
  Trash2,
  Edit,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface Project {
  id: string;
  name: string;
  lastModified: string;
  elements: number;
  status: 'draft' | 'completed';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Processo de Vendas',
      lastModified: '2025-01-03',
      elements: 12,
      status: 'completed'
    },
    {
      id: '2',
      name: 'Fluxo de Atendimento',
      lastModified: '2025-01-02',
      elements: 8,
      status: 'draft'
    },
    {
      id: '3',
      name: 'Processo de Compras',
      lastModified: '2024-12-28',
      elements: 15,
      status: 'completed'
    }
  ]);

  const handleNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Novo Processo',
      lastModified: new Date().toISOString().split('T')[0],
      elements: 0,
      status: 'draft'
    };
    setProjects([newProject, ...projects]);
    navigate(`/editor/${newProject.id}`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 font-light">
                Perfil
              </Button>
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 font-light">
                Sair
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extralight text-slate-900 dark:text-white mb-3">
            Seus Processos
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-light text-lg">
            Gerencie e organize todos os seus diagramas de processo
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
            <Input
              placeholder="Buscar processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl font-light"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-light">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button 
              onClick={handleNewProject}
              className="h-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-light text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(project.lastModified).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {project.elements} elementos
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={project.status === 'completed' ? 'default' : 'secondary'}
                  className={project.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 font-light' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border-0 font-light'
                  }
                >
                  {project.status === 'completed' ? 'Concluído' : 'Rascunho'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/editor/${project.id}`)}
                    className="bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-light"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-light"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-light"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-light text-slate-900 dark:text-white mb-3">
              {searchTerm ? 'Nenhum processo encontrado' : 'Nenhum processo criado ainda'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 font-light text-lg">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando seu primeiro diagrama de processo'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleNewProject}
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Processo
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

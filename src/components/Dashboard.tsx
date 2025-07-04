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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ProcessFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                Perfil
              </Button>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                Sair
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Seus Processos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie e organize todos os seus diagramas de processo
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Buscar processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button 
              onClick={handleNewProject}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(project.lastModified).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {project.elements} elementos
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={project.status === 'completed' ? 'default' : 'secondary'}
                  className={project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
                >
                  {project.status === 'completed' ? 'Concluído' : 'Rascunho'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/editor/${project.id}`)}
                    className="bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'Nenhum processo encontrado' : 'Nenhum processo criado ainda'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando seu primeiro diagrama de processo'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleNewProject}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
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

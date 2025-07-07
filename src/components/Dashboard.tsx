
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Workflow, 
  Plus, 
  FileText, 
  Calendar, 
  Search,
  Trash2,
  Edit,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import ThemeToggle from "./ThemeToggle";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { projects, loading, deleteProject } = useProjects(user?.id);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteProject = async (projectId: string) => {
    const { error } = await deleteProject(projectId);
    if (error) {
      toast.error("Erro ao deletar projeto");
    } else {
      toast.success("Projeto deletado com sucesso!");
    }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-300">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">Free Flow Process</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bem-vindo, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-slate-900 dark:text-white mb-2">
              Meus Fluxos
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-light">
              Gerencie seus diagramas de processo
            </p>
          </div>
          <Button 
            onClick={() => navigate('/editor/new')}
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-700 hover:via-pink-600 hover:to-rose-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Fluxo
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar fluxos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg border-slate-200 dark:border-slate-600"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white truncate max-w-32">
                      {project.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 font-light">
                  {project.elements.length} elementos
                </Badge>
              </div>

              <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/editor/${project.id}`)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-light text-slate-900 dark:text-white mb-2">
              {searchTerm ? 'Nenhum fluxo encontrado' : 'Nenhum fluxo ainda'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-6">
              {searchTerm ? 'Tente outro termo de busca' : 'Comece criando seu primeiro fluxo de processo'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/editor/new')}
                className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-700 hover:via-pink-600 hover:to-rose-600 text-white font-medium rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Fluxo
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

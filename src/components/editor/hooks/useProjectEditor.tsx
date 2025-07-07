import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";

export const useProjectEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { saveProject, getProject } = useProjects(user?.id);
  
  const [projectName, setProjectName] = useState("Novo Processo");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectElements, setProjectElements] = useState<any[]>([]);

  // Load project if editing existing one
  useEffect(() => {
    console.log('ProcessEditor: useEffect triggered - id:', id, 'user:', user?.id);
    if (id && id !== 'new' && user) {
      console.log('ProcessEditor: Calling loadProject');
      loadProject(id);
    }
  }, [id, user]);

  const loadProject = async (projectId: string) => {
    console.log('ProcessEditor: Loading project with ID:', projectId);
    setLoading(true);
    try {
      console.log('ProcessEditor: Calling getProject...');
      const { data, error } = await getProject(projectId);
      console.log('ProcessEditor: getProject returned - data:', data, 'error:', error);
      
      if (error) {
        console.error('ProcessEditor: Error loading project:', error);
        toast.error("Erro ao carregar projeto");
        setLoading(false);
        navigate('/dashboard');
        return;
      }

      if (data) {
        console.log('ProcessEditor: Project data found, setting state...');
        console.log('ProcessEditor: Setting project data - Name:', data.name, 'Elements:', data.elements);
        setProjectName(data.name);
        setCurrentProjectId(data.id);
        setProjectElements(data.elements || []);
        console.log('ProcessEditor: loadElements called, setting loading to false');
        setLoading(false);
        toast.success("Projeto carregado com sucesso!");
        return data.elements || [];
      } else {
        console.warn('ProcessEditor: No data received from getProject');
        toast.error("Projeto não encontrado");
        setLoading(false);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('ProcessEditor: Unexpected error loading project:', err);
      toast.error("Erro inesperado ao carregar projeto");
      setLoading(false);
      navigate('/dashboard');
    }
  };

  const handleSave = async (elements: any[]) => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await saveProject(projectName, elements, currentProjectId || undefined);
      
      if (error) {
        console.error('Error saving project:', error);
        toast.error("Erro ao salvar projeto");
      } else {
        toast.success("Projeto salvo com sucesso!");
        if (data && !currentProjectId) {
          setCurrentProjectId(data.id);
          navigate(`/editor/${data.id}`, { replace: true });
        }
      }
    } catch (err) {
      console.error('Unexpected error saving project:', err);
      toast.error("Erro inesperado ao salvar projeto");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    console.log('Exportando PDF...');
    toast.info("Funcionalidade de exportação em desenvolvimento");
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return {
    projectName,
    setProjectName,
    currentProjectId,
    loading,
    projectElements,
    handleSave,
    handleExportPDF,
    handleBackToDashboard,
    loadProject
  };
};
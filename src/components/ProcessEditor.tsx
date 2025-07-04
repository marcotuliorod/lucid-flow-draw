
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditorHeader from "./editor/EditorHeader";
import EditorToolbar from "./editor/EditorToolbar";
import Canvas from "./editor/Canvas";
import { useCanvas } from "./editor/hooks/useCanvas";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";

const ProcessEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { saveProject, getProject } = useProjects(user?.id);
  
  const [projectName, setProjectName] = useState("Novo Processo");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    canvasRef,
    elements,
    selectedElement,
    selectedTool,
    setSelectedTool,
    editingText,
    tempText,
    setTempText,
    isDrawing,
    startPos,
    currentPos,
    nearElement,
    findNearElement,
    getConnectionPoint,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementDoubleClick,
    handleTextSubmit,
    handleKeyPress,
    setSelectedElement,
    loadElements
  } = useCanvas();

  // Load project if editing existing one
  useEffect(() => {
    if (id && id !== 'new' && user) {
      loadProject(id);
    }
  }, [id, user]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const { data, error } = await getProject(projectId);
      
      if (error) {
        console.error('Error loading project:', error);
        toast.error("Erro ao carregar projeto");
        navigate('/dashboard');
        return;
      }

      if (data) {
        setProjectName(data.name);
        setCurrentProjectId(data.id);
        loadElements(data.elements || []);
        toast.success("Projeto carregado com sucesso!");
      }
    } catch (err) {
      console.error('Unexpected error loading project:', err);
      toast.error("Erro inesperado ao carregar projeto");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
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

  if (loading && !elements.length) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-300">Carregando projeto...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <EditorHeader
        projectName={projectName}
        setProjectName={setProjectName}
        elementsCount={elements.length}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onLogout={handleBackToDashboard}
        saving={loading}
      />

      <div className="flex flex-1">
        <EditorToolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
        />

        <Canvas
          canvasRef={canvasRef}
          elements={elements}
          selectedElement={selectedElement}
          selectedTool={selectedTool}
          editingText={editingText}
          tempText={tempText}
          isDrawing={isDrawing}
          startPos={startPos}
          currentPos={currentPos}
          nearElement={nearElement}
          findNearElement={findNearElement}
          getConnectionPoint={getConnectionPoint}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onElementClick={setSelectedElement}
          onElementDoubleClick={handleElementDoubleClick}
          onTextChange={setTempText}
          onTextSubmit={handleTextSubmit}
          onKeyPress={handleKeyPress}
          onToolSelect={setSelectedTool}
        />
      </div>
    </div>
  );
};

export default ProcessEditor;

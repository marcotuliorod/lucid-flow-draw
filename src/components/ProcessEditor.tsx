
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditorHeader from "./editor/EditorHeader";
import EditorToolbar from "./editor/EditorToolbar";
import Canvas from "./editor/Canvas";
import MiniMap from "./editor/MiniMap";
import LayersPanel from "./editor/LayersPanel";
import { useCanvas } from "./editor/hooks/useCanvas";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";

const ProcessEditor = () => {
  console.log('ProcessEditor: Component initialized');
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('ProcessEditor: Route params - id:', id);
  const { user } = useAuth();
  console.log('ProcessEditor: User:', user?.id);
  const { saveProject, getProject } = useProjects(user?.id);
  
  const [projectName, setProjectName] = useState("Novo Processo");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
    loadElements,
    addImageElement
  } = useCanvas();

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
      const { data, error } = await getProject(projectId);
      console.log('ProcessEditor: Project data received:', data);
      console.log('ProcessEditor: Project error:', error);
      
      if (error) {
        console.error('Error loading project:', error);
        toast.error("Erro ao carregar projeto");
        navigate('/dashboard');
        return;
      }

      if (data) {
        console.log('ProcessEditor: Setting project data - Name:', data.name, 'Elements:', data.elements);
        setProjectName(data.name);
        setCurrentProjectId(data.id);
        loadElements(data.elements || []);
        toast.success("Projeto carregado com sucesso!");
      } else {
        console.warn('ProcessEditor: No data received from getProject');
        toast.error("Projeto não encontrado");
        navigate('/dashboard');
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

  const handleImageUpload = async (file: File) => {
    const { validateImageFile, uploadImageToStorage } = await import('@/lib/fileValidation');
    const { supabase } = await import('@/integrations/supabase/client');

    // Validate file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Arquivo inválido');
      return;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      // Upload to secure storage
      const uploadResult = await uploadImageToStorage(file, user.id, supabase);
      
      if (uploadResult.success && uploadResult.url) {
        addImageElement(uploadResult.url, 100, 100);
        toast.success('Imagem adicionada com sucesso');
      } else {
        toast.error(uploadResult.error || 'Erro no upload da imagem');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Erro inesperado no upload da imagem');
    }
  };

  // New advanced functionality handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      loadElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      loadElements(history[historyIndex + 1]);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 25));
  };

  const handleAlignLeft = () => {
    // Placeholder for alignment functionality
    toast.info("Funcionalidade de alinhamento em desenvolvimento");
  };

  const handleAlignCenter = () => {
    // Placeholder for alignment functionality
    toast.info("Funcionalidade de alinhamento em desenvolvimento");
  };

  const handleAlignRight = () => {
    // Placeholder for alignment functionality
    toast.info("Funcionalidade de alinhamento em desenvolvimento");
  };

  const handleGroup = () => {
    // Placeholder for grouping functionality
    toast.info("Funcionalidade de agrupamento em desenvolvimento");
  };

  const handleUngroup = () => {
    // Placeholder for ungrouping functionality
    toast.info("Funcionalidade de desagrupamento em desenvolvimento");
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const handleElementDelete = (elementId: string) => {
    const newElements = elements.filter(el => el.id !== elementId);
    loadElements(newElements);
  };

  console.log('ProcessEditor: Rendering - loading:', loading, 'elements.length:', elements.length);

  if (loading && !elements.length) {
    console.log('ProcessEditor: Showing loading screen');
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-300">Carregando projeto...</div>
      </div>
    );
  }

  console.log('ProcessEditor: Rendering editor interface');

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
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onAlignLeft={handleAlignLeft}
        onAlignCenter={handleAlignCenter}
        onAlignRight={handleAlignRight}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        onToggleGrid={handleToggleGrid}
        showGrid={showGrid}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
      />

      <div className="flex flex-1">
        <EditorToolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          onImageUpload={handleImageUpload}
        />

        <div className="relative flex-1">
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
            showGrid={showGrid}
            zoom={zoom}
          />

          {/* Mini-map */}
          <MiniMap
            elements={elements}
            canvasSize={{ width: 2000, height: 1500 }}
            viewportPosition={viewportPosition}
            zoom={zoom / 100}
            onViewportChange={setViewportPosition}
          />

          {/* Layers Panel */}
          <LayersPanel
            elements={elements}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            onElementDelete={handleElementDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessEditor;

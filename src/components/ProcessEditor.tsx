
import { useState, useEffect } from "react";
import EditorHeader from "./editor/EditorHeader";
import EditorToolbar from "./editor/EditorToolbar";
import Canvas from "./editor/Canvas";
import MiniMap from "./editor/MiniMap";
import LayersPanel from "./editor/LayersPanel";
import { useCanvas } from "./editor/hooks/useCanvas";
import { useProjectEditor } from "./editor/hooks/useProjectEditor";
import { useEditorActions } from "./editor/hooks/useEditorActions";
import { useImageUpload } from "./editor/hooks/useImageUpload";

const ProcessEditor = () => {
  console.log('ProcessEditor: Component initialized');
  
  const {
    projectName,
    setProjectName,
    currentProjectId,
    loading,
    projectElements,
    handleSave,
    handleExportPDF,
    handleBackToDashboard,
    loadProject
  } = useProjectEditor();

  const {
    zoom,
    viewportPosition,
    setViewportPosition,
    showGrid,
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    handleAlignLeft,
    handleAlignCenter,
    handleAlignRight,
    handleGroup,
    handleUngroup,
    handleToggleGrid,
    canUndo,
    canRedo
  } = useEditorActions();

  const { handleImageUpload } = useImageUpload();

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

  // Load project elements into canvas when they become available OR add test elements
  // Only load once when project is initially loaded, don't overwrite local changes
  useEffect(() => {
    console.log('ProcessEditor: Loading elements effect - projectElements:', projectElements, 'currentProjectId:', currentProjectId, 'current elements.length:', elements.length);
    
    // Only load from database if we don't have elements locally yet
    if (projectElements.length > 0 && elements.length === 0) {
      console.log('ProcessEditor: Loading project elements into canvas (initial load):', projectElements);
      loadElements(projectElements);
    } else if (currentProjectId === null && !loading && elements.length === 0) {
      // Se for um novo projeto, adicionar elementos de teste para debug
      console.log('ProcessEditor: Adding test elements for new project');
      const testElements = [
        {
          id: 'test-1',
          type: 'rectangle' as const,
          x: 100,
          y: 100,
          width: 150,
          height: 80,
          text: 'Teste 1',
          color: '#3b82f6'
        },
        {
          id: 'test-2', 
          type: 'rectangle' as const,
          x: 300,
          y: 200,
          width: 150,
          height: 80,
          text: 'Teste 2',
          color: '#ef4444'
        }
      ];
      console.log('ProcessEditor: Loading test elements:', testElements);
      loadElements(testElements);
    } else if (projectElements.length > 0 && elements.length > 0) {
      console.log('ProcessEditor: Skipping database reload - local elements exist:', elements.length);
    }
  }, [projectElements, loadElements, currentProjectId, loading, elements.length]);

  const handleElementDelete = (elementId: string) => {
    const newElements = elements.filter(el => el.id !== elementId);
    loadElements(newElements);
  };

  const handleSaveProject = () => {
    handleSave(elements);
  };

  const handleImageUploadWrapper = (file: File) => {
    handleImageUpload(file, addImageElement);
  };

  const handleUndoWrapper = () => {
    handleUndo(loadElements);
  };

  const handleRedoWrapper = () => {
    handleRedo(loadElements);
  };

  console.log('ProcessEditor: Rendering - loading:', loading, 'elements.length:', elements.length);

  if (loading && !elements.length) {
    console.log('ProcessEditor: Showing loading screen');
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-slate-600 dark:text-slate-300">Carregando projeto...</div>
        </div>
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
        onSave={handleSaveProject}
        onExportPDF={handleExportPDF}
        onLogout={handleBackToDashboard}
        saving={loading}
        onUndo={handleUndoWrapper}
        onRedo={handleRedoWrapper}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onAlignLeft={handleAlignLeft}
        onAlignCenter={handleAlignCenter}
        onAlignRight={handleAlignRight}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        onToggleGrid={handleToggleGrid}
        showGrid={showGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
      />

      {/* Mobile Toolbar */}
      <div className="md:hidden">
        <EditorToolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          onImageUpload={handleImageUploadWrapper}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Toolbar */}
        <div className="hidden md:block">
          <EditorToolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            onImageUpload={handleImageUploadWrapper}
          />
        </div>

        <div className="relative flex-1 flex flex-col">
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

          {/* Mini-map - Oculto em mobile */}
          <div className="hidden lg:block">
            <MiniMap
              elements={elements}
              canvasSize={{ width: 2000, height: 1500 }}
              viewportPosition={viewportPosition}
              zoom={zoom / 100}
              onViewportChange={setViewportPosition}
            />
          </div>

          {/* Layers Panel - Oculto em mobile */}
          <div className="hidden lg:block">
            <LayersPanel
              elements={elements}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              onElementDelete={handleElementDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessEditor;

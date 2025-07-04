
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditorHeader from "./editor/EditorHeader";
import EditorToolbar from "./editor/EditorToolbar";
import Canvas from "./editor/Canvas";
import { useCanvas } from "./editor/hooks/useCanvas";

const ProcessEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectName, setProjectName] = useState("Novo Processo");

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
    setSelectedElement
  } = useCanvas();

  const handleExportPDF = () => {
    console.log('Exportando PDF...');
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${projectName}.pdf`;
    link.click();
  };

  const handleSave = () => {
    console.log('Salvando projeto...');
  };

  const handleLogout = () => {
    console.log('Fazendo logout...');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <EditorHeader
        projectName={projectName}
        setProjectName={setProjectName}
        elementsCount={elements.length}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onLogout={handleLogout}
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

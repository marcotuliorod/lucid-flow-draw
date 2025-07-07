import { CanvasElement } from "../types";
import { useCanvasState } from "./useCanvasState";
import { useElementUtils } from "./useElementUtils";
import { useElementCreation } from "./useElementCreation";
import { useTextEditing } from "./useTextEditing";
import { useMouseHandlers } from "./useMouseHandlers";

export const useCanvas = (initialElements: CanvasElement[] = []) => {
  const {
    canvasRef,
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    selectedTool,
    setSelectedTool,
    editingText,
    setEditingText,
    tempText,
    setTempText,
    isDrawing,
    setIsDrawing,
    startPos,
    setStartPos,
    currentPos,
    setCurrentPos,
    nearElement,
    setNearElement,
    loadElements
  } = useCanvasState(initialElements);

  const {
    getDefaultText,
    findNearElement,
    getConnectionPoint,
    findClickedElement
  } = useElementUtils();

  const {
    createArrowElement,
    createShapeElement,
    createImageElement,
    validateToolType
  } = useElementCreation();

  const {
    handleElementDoubleClick,
    handleTextSubmit,
    handleKeyPress
  } = useTextEditing({
    elements,
    setElements,
    editingText,
    setEditingText,
    tempText,
    setTempText
  });

  const {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  } = useMouseHandlers({
    canvasRef,
    selectedTool,
    elements,
    setElements,
    setSelectedElement,
    isDrawing,
    setIsDrawing,
    startPos,
    setStartPos,
    currentPos,
    setCurrentPos,
    setNearElement,
    findNearElement,
    findClickedElement,
    createArrowElement,
    createShapeElement,
    validateToolType,
    getDefaultText
  });

  const addImageElement = (imageUrl: string, x: number, y: number) => {
    const newElement = createImageElement(imageUrl, x, y);
    setElements(prev => [...prev, newElement]);
    setSelectedTool('select');
  };

  return {
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
    findNearElement: (x: number, y: number) => findNearElement(x, y, elements),
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
  };
};

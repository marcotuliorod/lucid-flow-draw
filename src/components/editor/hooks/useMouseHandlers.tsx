import { RefObject } from "react";
import { CanvasElement } from "../types";

interface UseMouseHandlersProps {
  canvasRef: RefObject<HTMLDivElement>;
  selectedTool: string;
  elements: CanvasElement[];
  setElements: (updater: (prev: CanvasElement[]) => CanvasElement[]) => void;
  setSelectedElement: (id: string | null) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  startPos: { x: number; y: number };
  setStartPos: (pos: { x: number; y: number }) => void;
  currentPos: { x: number; y: number };
  setCurrentPos: (pos: { x: number; y: number }) => void;
  setNearElement: (id: string | null) => void;
  findNearElement: (x: number, y: number, elements: CanvasElement[]) => CanvasElement | undefined;
  findClickedElement: (x: number, y: number, elements: CanvasElement[]) => CanvasElement | undefined;
  createArrowElement: (start: CanvasElement, end: CanvasElement) => CanvasElement;
  createShapeElement: (
    toolType: CanvasElement['type'],
    x: number,
    y: number,
    width: number,
    height: number,
    getDefaultText: (type: CanvasElement['type']) => string
  ) => CanvasElement;
  validateToolType: (tool: string) => CanvasElement['type'];
  getDefaultText: (type: CanvasElement['type']) => string;
}

export const useMouseHandlers = ({
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
}: UseMouseHandlersProps) => {
  const getCanvasPosition = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    console.log('MouseDown called with tool:', selectedTool);
    const pos = getCanvasPosition(e);
    if (!pos) return;

    if (selectedTool === 'select') {
      const clickedElement = findClickedElement(pos.x, pos.y, elements);
      setSelectedElement(clickedElement ? clickedElement.id : null);
      return;
    }
    
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDrawing(true);

    if (selectedTool === 'arrow') {
      const nearEl = findNearElement(pos.x, pos.y, elements);
      setNearElement(nearEl?.id || null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPosition(e);
    if (!pos) return;

    if (isDrawing && selectedTool !== 'select') {
      setCurrentPos(pos);

      if (selectedTool === 'arrow') {
        const nearEl = findNearElement(pos.x, pos.y, elements);
        setNearElement(nearEl?.id || null);
      }
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    console.log('MouseUp called, isDrawing:', isDrawing, 'tool:', selectedTool);
    if (!isDrawing || selectedTool === 'select') return;

    const pos = getCanvasPosition(e);
    if (!pos) return;

    if (selectedTool === 'arrow') {
      const startElement = findNearElement(startPos.x, startPos.y, elements);
      const endElement = findNearElement(pos.x, pos.y, elements);

      if (startElement && endElement && startElement.id !== endElement.id) {
        const newArrow = createArrowElement(startElement, endElement);
        setElements(prev => [...prev, newArrow]);
      }
    } else {
      const width = Math.abs(pos.x - startPos.x);
      const height = Math.abs(pos.y - startPos.y);

      if (width > 10 || height > 10) {
        console.log('Creating element with width:', width, 'height:', height);
        const toolType = validateToolType(selectedTool);
        console.log('Validated tool type:', toolType);
        const newElement = createShapeElement(
          toolType,
          Math.min(startPos.x, pos.x),
          Math.min(startPos.y, pos.y),
          width,
          height,
          getDefaultText
        );
        console.log('Created element:', newElement);
        setElements(prev => [...prev, newElement]);
        console.log('Element added to state');
      }
    }

    setIsDrawing(false);
    setNearElement(null);
  };

  return {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  };
};
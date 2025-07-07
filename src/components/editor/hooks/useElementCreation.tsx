import { CanvasElement } from "../types";

export const useElementCreation = () => {
  const createArrowElement = (
    startElement: CanvasElement,
    endElement: CanvasElement
  ): CanvasElement => {
    return {
      id: crypto.randomUUID(),
      type: 'arrow',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: '#3B82F6',
      startElementId: startElement.id,
      endElementId: endElement.id
    };
  };

  const createShapeElement = (
    toolType: CanvasElement['type'],
    x: number,
    y: number,
    width: number,
    height: number,
    getDefaultText: (type: CanvasElement['type']) => string
  ): CanvasElement => {
    return {
      id: crypto.randomUUID(),
      type: toolType,
      x,
      y,
      width: width || 100,
      height: height || 60,
      text: toolType === 'text' ? 'Texto' : getDefaultText(toolType),
      color: '#3B82F6'
    };
  };

  const createImageElement = (imageUrl: string, x: number, y: number): CanvasElement => {
    return {
      id: crypto.randomUUID(),
      type: 'image',
      x,
      y,
      width: 150,
      height: 100,
      text: '',
      color: '#3B82F6',
      imageUrl
    };
  };

  const validateToolType = (selectedTool: string): CanvasElement['type'] => {
    const validTypes: CanvasElement['type'][] = [
      'rectangle', 'circle', 'diamond', 'text', 'start', 'end', 
      'task', 'decision', 'subprocess', 'document', 'annotation'
    ];
    
    return validTypes.includes(selectedTool as CanvasElement['type']) 
      ? selectedTool as CanvasElement['type'] 
      : 'rectangle';
  };

  return {
    createArrowElement,
    createShapeElement,
    createImageElement,
    validateToolType
  };
};
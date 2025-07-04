import { useState, useRef } from "react";
import { CanvasElement } from "../types";

export const useCanvas = (initialElements: CanvasElement[] = []) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [editingText, setEditingText] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [nearElement, setNearElement] = useState<string | null>(null);

  // Função para encontrar elemento próximo do cursor
  const findNearElement = (x: number, y: number) => {
    const threshold = 30;
    return elements.find(element => {
      if (element.type === 'arrow') return false;
      
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      return distance < threshold;
    });
  };

  // Função para obter ponto de conexão de um elemento
  const getConnectionPoint = (element: CanvasElement) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  });

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'select') {
      const clickedElement = elements.find(element => 
        x >= element.x && x <= element.x + element.width &&
        y >= element.y && y <= element.y + element.height
      );
      
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
      } else {
        setSelectedElement(null);
      }
      return;
    }
    
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);

    if (selectedTool === 'arrow') {
      const nearEl = findNearElement(x, y);
      setNearElement(nearEl?.id || null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing && selectedTool !== 'select') {
      setCurrentPos({ x, y });

      if (selectedTool === 'arrow') {
        const nearEl = findNearElement(x, y);
        setNearElement(nearEl?.id || null);
      }
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || selectedTool === 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (selectedTool === 'arrow') {
      const startElement = findNearElement(startPos.x, startPos.y);
      const endElement = findNearElement(endX, endY);

      if (startElement && endElement && startElement.id !== endElement.id) {
        const newArrow: CanvasElement = {
          id: Date.now().toString(),
          type: 'arrow',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          color: '#3B82F6',
          startElementId: startElement.id,
          endElementId: endElement.id
        };

        setElements(prev => [...prev, newArrow]);
      }
    } else {
      const width = Math.abs(endX - startPos.x);
      const height = Math.abs(endY - startPos.y);

      if (width > 10 || height > 10) {
        const newElement: CanvasElement = {
          id: Date.now().toString(),
          type: selectedTool as any,
          x: Math.min(startPos.x, endX),
          y: Math.min(startPos.y, endY),
          width: width || 100,
          height: height || 60,
          text: selectedTool === 'text' ? 'Texto' : `${selectedTool}`,
          color: '#3B82F6'
        };

        setElements(prev => [...prev, newElement]);
      }
    }

    setIsDrawing(false);
    setNearElement(null);
    setSelectedTool('select');
  };

  const handleElementDoubleClick = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element && element.type !== 'arrow') {
      setEditingText(elementId);
      setTempText(element.text || '');
    }
  };

  const handleTextSubmit = () => {
    if (editingText) {
      setElements(elements.map(el => 
        el.id === editingText ? { ...el, text: tempText } : el
      ));
      setEditingText(null);
      setTempText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setEditingText(null);
      setTempText('');
    }
  };

  // New function to load elements
  const loadElements = (newElements: CanvasElement[]) => {
    setElements(newElements);
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
  };
};

import { useState, useRef } from "react";
import { CanvasElement } from "../types";

export const useCanvasState = (initialElements: CanvasElement[] = []) => {
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

  const loadElements = (newElements: CanvasElement[]) => {
    setElements(newElements);
  };

  return {
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
  };
};
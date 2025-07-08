import { useState, useRef, useCallback } from 'react';
import { CanvasElement } from '../types';

interface UseElementDraggingProps {
  elements: CanvasElement[];
  setElements: (updater: (prev: CanvasElement[]) => CanvasElement[]) => void;
  selectedElement: string | null;
}

export const useElementDragging = ({
  elements,
  setElements,
  selectedElement
}: UseElementDraggingProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((elementId: string, clientX: number, clientY: number) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setIsDragging(true);
    dragStartPos.current = { x: clientX, y: clientY };
    elementStartPos.current = { x: element.x, y: element.y };
    setDragOffset({ x: clientX - element.x, y: clientY - element.y });
  }, [elements]);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !selectedElement) return;

    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;

    setElements(prev => 
      prev.map(element => {
        if (element.id === selectedElement) {
          return {
            ...element,
            x: Math.max(0, elementStartPos.current.x + deltaX),
            y: Math.max(0, elementStartPos.current.y + deltaY)
          };
        }
        return element;
      })
    );
  }, [isDragging, selectedElement, setElements]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    isDragging,
    startDrag,
    updateDrag,
    endDrag,
    dragOffset
  };
};
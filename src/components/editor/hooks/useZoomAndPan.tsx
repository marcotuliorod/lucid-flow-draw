import { useState, useCallback, useRef, WheelEvent } from 'react';

interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export const useZoomAndPan = (initialScale = 1) => {
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    scale: initialScale
  });
  
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const viewportStart = useRef({ x: 0, y: 0 });

  const minScale = 0.1;
  const maxScale = 3;
  const scaleStep = 0.1;

  // Função de zoom
  const zoomIn = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(prev.scale + scaleStep, maxScale)
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(prev.scale - scaleStep, minScale)
    }));
  }, []);

  const zoomToFit = useCallback((elements: any[], canvasSize: { width: number; height: number }) => {
    if (elements.length === 0) {
      setViewport({ x: 0, y: 0, scale: 1 });
      return;
    }

    // Calcula a bounding box de todos os elementos
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    elements.forEach(element => {
      if (element.type !== 'arrow') {
        minX = Math.min(minX, element.x);
        minY = Math.min(minY, element.y);
        maxX = Math.max(maxX, element.x + element.width);
        maxY = Math.max(maxY, element.y + element.height);
      }
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const padding = 50;

    // Calcula a escala para caber na tela
    const scaleX = (canvasSize.width - padding * 2) / contentWidth;
    const scaleY = (canvasSize.height - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Não aumenta além de 100%

    // Calcula a posição para centralizar
    const centerX = (canvasSize.width - contentWidth * scale) / 2;
    const centerY = (canvasSize.height - contentHeight * scale) / 2;

    setViewport({
      x: centerX - minX * scale,
      y: centerY - minY * scale,
      scale: Math.max(scale, minScale)
    });
  }, []);

  const resetZoom = useCallback(() => {
    setViewport({ x: 0, y: 0, scale: 1 });
  }, []);

  // Zoom com scroll do mouse
  const handleWheel = useCallback((e: WheelEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -scaleStep : scaleStep;
    const newScale = Math.max(minScale, Math.min(maxScale, viewport.scale + delta));
    
    if (newScale === viewport.scale) return;

    // Calcula o ponto do mouse relativo ao canvas
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    
    // Calcula a nova posição para manter o mouse no mesmo ponto
    const scaleRatio = newScale / viewport.scale;
    const newX = mouseX - (mouseX - viewport.x) * scaleRatio;
    const newY = mouseY - (mouseY - viewport.y) * scaleRatio;

    setViewport({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [viewport]);

  // Pan com mouse
  const startPan = useCallback((clientX: number, clientY: number) => {
    setIsPanning(true);
    panStart.current = { x: clientX, y: clientY };
    viewportStart.current = { x: viewport.x, y: viewport.y };
  }, [viewport]);

  const updatePan = useCallback((clientX: number, clientY: number) => {
    if (!isPanning) return;

    const deltaX = clientX - panStart.current.x;
    const deltaY = clientY - panStart.current.y;

    setViewport(prev => ({
      ...prev,
      x: viewportStart.current.x + deltaX,
      y: viewportStart.current.y + deltaY
    }));
  }, [isPanning]);

  const endPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Transforma coordenadas da tela para coordenadas do canvas
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.x) / viewport.scale,
      y: (screenY - viewport.y) / viewport.scale
    };
  }, [viewport]);

  // Transforma coordenadas do canvas para coordenadas da tela
  const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
    return {
      x: canvasX * viewport.scale + viewport.x,
      y: canvasY * viewport.scale + viewport.y
    };
  }, [viewport]);

  return {
    viewport,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    isPanning,
    screenToCanvas,
    canvasToScreen,
    scale: viewport.scale,
    position: { x: viewport.x, y: viewport.y }
  };
};
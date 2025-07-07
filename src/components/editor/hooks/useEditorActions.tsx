import { useState } from "react";
import { toast } from "sonner";

export const useEditorActions = () => {
  const [zoom, setZoom] = useState(100);
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleUndo = (loadElements: (elements: any[]) => void) => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      loadElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = (loadElements: (elements: any[]) => void) => {
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
    toast.info("Funcionalidade de alinhamento em desenvolvimento");
  };

  const handleAlignCenter = () => {
    toast.info("Funcionalidade de alinhamento em desenvolvimento");
  };

  const handleAlignRight = () => {
    toast.info("Funcionalidade de alinhamento em desenvolvimento");
  };

  const handleGroup = () => {
    toast.info("Funcionalidade de agrupamento em desenvolvimento");
  };

  const handleUngroup = () => {
    toast.info("Funcionalidade de desagrupamento em desenvolvimento");
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return {
    zoom,
    viewportPosition,
    setViewportPosition,
    showGrid,
    history,
    historyIndex,
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
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};
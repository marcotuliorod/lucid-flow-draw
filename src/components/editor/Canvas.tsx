
import { useRef, useEffect } from "react";
import { CanvasElement } from "./types";
import CanvasElementComponent from "./CanvasElement";
import ArrowElement from "./ArrowElement";
import SmartArrowElement from "./SmartArrowElement";
import EmptyCanvas from "./EmptyCanvas";
import { useElementDragging } from "./hooks/useElementDragging";
import { useZoomAndPan } from "./hooks/useZoomAndPan";
import { useSmartConnections } from "./hooks/useSmartConnections";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  elements: CanvasElement[];
  selectedElement: string | null;
  selectedTool: string;
  editingText: string | null;
  tempText: string;
  isDrawing: boolean;
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
  nearElement: string | null;
  findNearElement: (x: number, y: number) => CanvasElement | undefined;
  getConnectionPoint: (element: CanvasElement) => { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onElementClick: (id: string) => void;
  onElementDoubleClick: (id: string) => void;
  onTextChange: (text: string) => void;
  onTextSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onToolSelect: (toolId: string) => void;
  showGrid?: boolean;
  zoom?: number;
  setElements?: (updater: (prev: CanvasElement[]) => CanvasElement[]) => void;
}

const Canvas = ({
  canvasRef,
  elements,
  selectedElement,
  selectedTool,
  editingText,
  tempText,
  isDrawing,
  startPos,
  currentPos,
  nearElement,
  findNearElement,
  getConnectionPoint,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onElementClick,
  onElementDoubleClick,
  onTextChange,
  onTextSubmit,
  onKeyPress,
  onToolSelect,
  showGrid = true,
  zoom = 100,
  setElements
}: CanvasProps) => {
  console.log('Canvas: Rendering with elements:', elements, 'Elements count:', elements.length);
  
  // Hook para arrastar elementos
  const { isDragging: isDraggingElement, startDrag, updateDrag, endDrag } = useElementDragging({
    elements,
    setElements: setElements || (() => {}),
    selectedElement
  });

  // Hook para conexões inteligentes
  const { findNearbyElements, validateConnection } = useSmartConnections({ elements });

  // Hook para zoom e pan
  const {
    viewport,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    isPanning,
    screenToCanvas
  } = useZoomAndPan();

  // Gerencia eventos de mouse para arrastar elementos
  const handleElementMouseDown = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTool === 'select' && selectedElement === elementId) {
      startDrag(elementId, e.clientX, e.clientY);
    }
    onElementClick(elementId);
  };

  // Eventos globais de mouse para arrastar
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingElement) {
        updateDrag(e.clientX, e.clientY);
      } else if (isPanning) {
        updatePan(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingElement) {
        endDrag();
      }
      if (isPanning) {
        endPan();
      }
    };

    if (isDraggingElement || isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingElement, isPanning, updateDrag, endDrag, updatePan, endPan]);

  // Manipula scroll para zoom
  const handleCanvasWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        handleWheel(e, canvasRect);
      }
    }
  };

  // Manipula início do pan com botão do meio ou espaço + clique
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Botão do meio ou Ctrl + clique esquerdo para pan
      e.preventDefault();
      startPan(e.clientX, e.clientY);
      return;
    }
    
    // Chama o handler original
    onMouseDown(e);
  };
  // Renderizar linha da seta durante o desenho
  const renderArrowPreview = () => {
    if (!isDrawing || selectedTool !== 'arrow') return null;

    const startElement = findNearElement(startPos.x, startPos.y);
    const endElement = findNearElement(currentPos.x, currentPos.y);

    const startPoint = startElement ? getConnectionPoint(startElement) : startPos;
    const endPoint = endElement ? getConnectionPoint(endElement) : currentPos;

    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const length = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
    const adjustedLength = Math.max(0, length - 12);

    return (
      <div className="absolute pointer-events-none">
        {/* Linha da seta */}
        <div
          className="absolute bg-blue-500 dark:bg-blue-400"
          style={{
            left: startPoint.x,
            top: startPoint.y - 1.5,
            width: adjustedLength,
            height: 3,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}rad)`
          }}
        />
        {/* Ponta da seta */}
        <div
          className="absolute border-l-blue-500 dark:border-l-blue-400"
          style={{
            left: endPoint.x - 12,
            top: endPoint.y - 6,
            width: 0,
            height: 0,
            borderLeft: '12px solid',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
          }}
        />
        {/* Indicadores de conexão */}
        {startElement && (
          <div
            className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            style={{
              left: startPoint.x - 6,
              top: startPoint.y - 6
            }}
          />
        )}
        {endElement && (
          <div
            className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            style={{
              left: endPoint.x - 6,
              top: endPoint.y - 6
            }}
          />
        )}
      </div>
    );
  };

  // Renderizar elemento de preview durante o desenho (exceto seta)
  const renderPreviewElement = () => {
    if (!isDrawing || selectedTool === 'select' || selectedTool === 'arrow' || selectedTool === 'image') return null;

    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width < 10 && height < 10) return null;

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);

    return (
      <div
        className="absolute border-2 border-dashed border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-center text-sm font-light text-blue-900 dark:text-blue-100 pointer-events-none"
        style={{
          left: x,
          top: y,
          width: width || 100,
          height: height || 60,
          borderRadius: selectedTool === 'circle' ? '50%' : selectedTool === 'diamond' ? '0' : '12px',
          transform: selectedTool === 'diamond' ? 'rotate(45deg)' : 'none'
        }}
      >
        <span className={selectedTool === 'diamond' ? 'transform -rotate-45' : ''}>
          {selectedTool === 'text' ? 'Texto' : selectedTool}
        </span>
      </div>
    );
  };

  return (
    <main className="flex-1 relative min-h-0">
      <div className="w-full h-full overflow-auto">
        <div 
          ref={canvasRef}
          className={`bg-gray-100 dark:bg-gray-900 relative ${
            isPanning ? 'cursor-grabbing' : 
            selectedTool === 'select' ? 'cursor-default' : 
            selectedTool === 'arrow' ? 'cursor-crosshair' : 'cursor-copy'
          }`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={handleCanvasWheel}
          style={{
            backgroundImage: showGrid ? `radial-gradient(circle, #94a3b8 1px, transparent 1px)` : 'none',
            backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
            backgroundPosition: `${viewport.x}px ${viewport.y}px`,
            minWidth: 'max(100vw, 2000px)',
            minHeight: 'max(100vh, 1500px)',
            width: '2000px',
            height: '1500px',
            transform: `scale(${zoom / 100}) translate(${viewport.x}px, ${viewport.y}px)`,
            transformOrigin: '0 0'
          }}
        >
        
        {/* Elementos existentes com melhor renderização */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Renderiza apenas as setas como SVG para melhor qualidade */}
          {elements.filter(el => el.type === 'arrow').map((element) => {
            const startElement = elements.find(el => el.id === element.startElementId);
            const endElement = elements.find(el => el.id === element.endElementId);
            
            return (
              <SmartArrowElement
                key={element.id}
                element={element}
                startElement={startElement}
                endElement={endElement}
                isSelected={selectedElement === element.id}
                scale={zoom / 100}
              />
            );
          })}
        </svg>

        {/* Elementos não-seta */}
        {elements.filter(el => el.type !== 'arrow').map((element) => (
          <CanvasElementComponent
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            isEditing={editingText === element.id}
            editText={tempText}
            onElementClick={(id) => handleElementMouseDown(id, {} as React.MouseEvent)}
            onElementDoubleClick={onElementDoubleClick}
            onTextChange={onTextChange}
            onTextSubmit={onTextSubmit}
            onKeyPress={onKeyPress}
          />
        ))}

        {/* Preview da seta durante o desenho */}
        {renderArrowPreview()}

        {/* Elemento de preview durante o desenho (exceto seta) */}
        {renderPreviewElement()}

        {/* Instructions */}
        {elements.length === 0 && (
          <EmptyCanvas onToolSelect={onToolSelect} />
        )}
        </div>
      </div>
    </main>
  );
};

export default Canvas;

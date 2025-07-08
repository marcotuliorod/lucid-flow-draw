
import { useRef } from "react";
import { CanvasElement } from "./types";
import CanvasElementComponent from "./CanvasElement";
import ArrowElement from "./ArrowElement";
import EmptyCanvas from "./EmptyCanvas";

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
  zoom = 100
}: CanvasProps) => {
  console.log('Canvas: Rendering with elements:', elements, 'Elements count:', elements.length);
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
    <main className="flex-1 relative">
      <div className="w-full h-full overflow-auto">
        <div 
          ref={canvasRef}
          className={`w-full h-full bg-gray-100 dark:bg-gray-900 relative ${
            selectedTool === 'select' ? 'cursor-default' : 
            selectedTool === 'arrow' ? 'cursor-crosshair' : 'cursor-copy'
          }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{
            backgroundImage: showGrid ? `radial-gradient(circle, #94a3b8 1px, transparent 1px)` : 'none',
            backgroundSize: '24px 24px',
            minWidth: '2000px',
            minHeight: '1500px'
          }}
        >
        
        {/* Elementos existentes */}
        {elements.map((element) => {
          if (element.type === 'arrow') {
            const startElement = elements.find(el => el.id === element.startElementId);
            const endElement = elements.find(el => el.id === element.endElementId);
            
            return (
              <ArrowElement
                key={element.id}
                element={element}
                startElement={startElement}
                endElement={endElement}
                isSelected={selectedElement === element.id}
              />
            );
          }

          return (
            <CanvasElementComponent
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              isEditing={editingText === element.id}
              editText={tempText}
              onElementClick={onElementClick}
              onElementDoubleClick={onElementDoubleClick}
              onTextChange={onTextChange}
              onTextSubmit={onTextSubmit}
              onKeyPress={onKeyPress}
            />
          );
        })}

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


import { CanvasElement } from "./types";

interface ArrowElementProps {
  element: CanvasElement;
  startElement: CanvasElement | undefined;
  endElement: CanvasElement | undefined;
  isSelected: boolean;
}

const ArrowElement = ({ element, startElement, endElement, isSelected }: ArrowElementProps) => {
  if (!startElement || !endElement) return null;

  const getConnectionPoint = (element: CanvasElement) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  });

  const startPoint = getConnectionPoint(startElement);
  const endPoint = getConnectionPoint(endElement);
  
  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  const length = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));

  // Reduzir o comprimento da linha para não sobrepor a ponta da seta
  const adjustedLength = Math.max(0, length - 12);
  const adjustedEndX = startPoint.x + Math.cos(angle) * adjustedLength;
  const adjustedEndY = startPoint.y + Math.sin(angle) * adjustedLength;

  return (
    <div className="absolute pointer-events-none">
      {/* Linha da seta */}
      <div
        className={`absolute ${isSelected ? 'bg-orange-500' : 'bg-blue-500 dark:bg-blue-400'}`}
        style={{
          left: startPoint.x,
          top: startPoint.y - 1.5,
          width: adjustedLength,
          height: 3,
          transformOrigin: '0 50%',
          transform: `rotate(${angle}rad)`
        }}
      />
      {/* Ponta da seta mais definida */}
      <div
        className={`absolute ${isSelected ? 'border-l-orange-500' : 'border-l-blue-500 dark:border-l-blue-400'}`}
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
      {/* Pontos de conexão para indicar onde a seta está conectada */}
      <div
        className="absolute w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
        style={{
          left: startPoint.x - 4,
          top: startPoint.y - 4
        }}
      />
      <div
        className="absolute w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
        style={{
          left: endPoint.x - 4,
          top: endPoint.y - 4
        }}
      />
    </div>
  );
};

export default ArrowElement;

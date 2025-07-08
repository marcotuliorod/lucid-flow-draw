import { CanvasElement } from "./types";
import { useSmartConnections } from "./hooks/useSmartConnections";

interface SmartArrowElementProps {
  element: CanvasElement;
  startElement: CanvasElement | undefined;
  endElement: CanvasElement | undefined;
  isSelected: boolean;
  scale?: number;
}

const SmartArrowElement = ({ 
  element, 
  startElement, 
  endElement, 
  isSelected,
  scale = 1 
}: SmartArrowElementProps) => {
  const { getOptimalConnectionPoints, getSmartArrowPath } = useSmartConnections({ elements: [] });

  if (!startElement || !endElement) return null;

  const { startPoint, endPoint } = getOptimalConnectionPoints(startElement, endElement);
  const { path } = getSmartArrowPath(startPoint, endPoint);

  // Calcula o ângulo para a ponta da seta
  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  const arrowLength = 12;
  const arrowWidth = 6;

  // Ajusta a linha para não sobrepor a ponta da seta
  const adjustedEndX = endPoint.x - Math.cos(angle) * arrowLength;
  const adjustedEndY = endPoint.y - Math.sin(angle) * arrowLength;

  return (
    <g className="smart-arrow">
      {/* Linha principal */}
      <path
        d={`M ${startPoint.x} ${startPoint.y} L ${adjustedEndX} ${adjustedEndY}`}
        stroke={isSelected ? '#f97316' : '#3b82f6'}
        strokeWidth={3 / scale}
        fill="none"
        className="transition-colors duration-200"
      />
      
      {/* Ponta da seta */}
      <polygon
        points={`
          ${endPoint.x},${endPoint.y}
          ${endPoint.x - Math.cos(angle - Math.PI / 6) * arrowLength},${endPoint.y - Math.sin(angle - Math.PI / 6) * arrowLength}
          ${endPoint.x - Math.cos(angle + Math.PI / 6) * arrowLength},${endPoint.y - Math.sin(angle + Math.PI / 6) * arrowLength}
        `}
        fill={isSelected ? '#f97316' : '#3b82f6'}
        className="transition-colors duration-200"
      />
      
      {/* Pontos de conexão visuais */}
      <circle
        cx={startPoint.x}
        cy={startPoint.y}
        r={3 / scale}
        fill="#10b981"
        className="opacity-75"
      />
      <circle
        cx={endPoint.x}
        cy={endPoint.y}
        r={3 / scale}
        fill="#10b981"
        className="opacity-75"
      />
      
      {/* Área clicável invisível para seleção */}
      <path
        d={`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`}
        stroke="transparent"
        strokeWidth={20 / scale}
        fill="none"
        className="cursor-pointer"
      />
    </g>
  );
};

export default SmartArrowElement;
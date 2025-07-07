
import { Input } from "@/components/ui/input";
import { CanvasElement } from "./types";

interface CanvasElementProps {
  element: CanvasElement;
  isSelected: boolean;
  isEditing: boolean;
  editText: string;
  onElementClick: (id: string) => void;
  onElementDoubleClick: (id: string) => void;
  onTextChange: (text: string) => void;
  onTextSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const CanvasElementComponent = ({ 
  element, 
  isSelected, 
  isEditing, 
  editText, 
  onElementClick, 
  onElementDoubleClick, 
  onTextChange, 
  onTextSubmit, 
  onKeyPress 
}: CanvasElementProps) => {
  console.log('CanvasElement: Rendering element:', element.type, element.id, 'at position:', element.x, element.y);
  
  const getElementStyle = () => {
    const baseStyle = {
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
    };

    switch (element.type) {
      case 'start':
        return {
          ...baseStyle,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
        };
      case 'end':
        return {
          ...baseStyle,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        };
      case 'task':
        return {
          ...baseStyle,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        };
      case 'decision':
        return {
          ...baseStyle,
          borderRadius: '0',
          transform: 'rotate(45deg)',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        };
      case 'subprocess':
        return {
          ...baseStyle,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          border: '3px double currentColor',
        };
      case 'document':
        return {
          ...baseStyle,
          borderRadius: '12px 12px 0 12px',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        };
      case 'annotation':
        return {
          ...baseStyle,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ec4899, #db2777)',
        };
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        };
      case 'rectangle':
        return {
          ...baseStyle,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)', // Azul em vez de vermelho
          border: '2px solid #1d4ed8',
          zIndex: 1
        };
      default:
        return {
          ...baseStyle,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
        };
    }
  };

  const elementStyle = getElementStyle();
  console.log('CanvasElement: Element style for', element.id, ':', elementStyle);

  return (
    <div
      className={`absolute border cursor-move hover:shadow-lg transition-all duration-200 flex items-center justify-center text-sm font-medium text-white z-30 ${
        isSelected 
          ? 'border-orange-500 ring-2 ring-orange-500/50 shadow-lg'
          : 'border-white/20 shadow-md'
      }`}
      style={{
        ...elementStyle,
        // FORÇAR VISIBILIDADE PARA DEBUG
        backgroundColor: '#FF0000 !important',
        border: '4px solid #FFFF00',
        zIndex: 30
      }}
      onClick={() => onElementClick(element.id)}
      onDoubleClick={() => onElementDoubleClick(element.id)}
    >
      {isEditing ? (
        <Input
          value={editText}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onTextSubmit}
          onKeyDown={onKeyPress}
          className="w-full h-full text-center border-none bg-transparent text-sm p-0 focus-visible:ring-0"
          autoFocus
        />
      ) : element.type === 'image' && element.imageUrl ? (
        (() => {
          // Validate image URL before rendering
          try {
            const url = new URL(element.imageUrl);
            const isValid = url.protocol === 'https:' || element.imageUrl.startsWith('data:image/');
            if (!isValid) return <span>Imagem inválida</span>;
          } catch {
            return <span>URL inválida</span>;
          }
          
          return (
            <img 
              src={element.imageUrl} 
              alt="Canvas element" 
              className="w-full h-full object-cover rounded-lg"
              draggable={false}
              onError={(e) => {
                // Replace with placeholder on error
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          );
        })()
      ) : (
        <span className={element.type === 'diamond' || element.type === 'decision' ? 'transform -rotate-45' : ''}>
          {element.text || element.type}
        </span>
      )}
    </div>
  );
};

export default CanvasElementComponent;

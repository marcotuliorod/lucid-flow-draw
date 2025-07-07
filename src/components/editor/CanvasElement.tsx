
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
  return (
    <div
      className={`absolute border cursor-move hover:bg-blue-100/80 dark:hover:bg-blue-800/30 transition-all duration-200 flex items-center justify-center text-sm font-light ${
        isSelected 
          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100'
          : 'border-blue-500 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        borderRadius: element.type === 'circle' ? '50%' : element.type === 'diamond' ? '0' : '12px',
        transform: element.type === 'diamond' ? 'rotate(45deg)' : 'none'
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
        <span className={element.type === 'diamond' ? 'transform -rotate-45' : ''}>
          {element.text || element.type}
        </span>
      )}
    </div>
  );
};

export default CanvasElementComponent;

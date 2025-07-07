import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { CanvasElement } from "./types";

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedElement: string | null;
  onElementSelect: (id: string) => void;
  onElementDelete: (id: string) => void;
  onElementToggleVisibility?: (id: string) => void;
  onElementToggleLock?: (id: string) => void;
  className?: string;
}

const LayersPanel = ({
  elements,
  selectedElement,
  onElementSelect,
  onElementDelete,
  onElementToggleVisibility,
  onElementToggleLock,
  className = ""
}: LayersPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getElementName = (element: CanvasElement) => {
    if (element.text && element.text.trim()) {
      return element.text.substring(0, 20) + (element.text.length > 20 ? '...' : '');
    }
    return `${element.type.charAt(0).toUpperCase() + element.type.slice(1)}`;
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'start': return '▶️';
      case 'end': return '⏹️';
      case 'task': return '📋';
      case 'decision': return '💎';
      case 'subprocess': return '📁';
      case 'document': return '📄';
      case 'annotation': return '💬';
      case 'rectangle': return '▭';
      case 'circle': return '⭕';
      case 'text': return '🔤';
      case 'image': return '🖼️';
      case 'arrow': return '➡️';
      default: return '📦';
    }
  };

  if (isCollapsed) {
    return (
      <Card className={`absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="h-8 w-8 p-0"
          title="Expandir painel de camadas"
          aria-label="Expandir painel de camadas"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`absolute top-4 right-4 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg ${className}`}>
      <div className="p-3 border-b border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span className="font-medium text-sm">Camadas</span>
            <Badge variant="secondary" className="text-xs">
              {elements.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="h-6 w-6 p-0"
            title="Colapsar painel de camadas"
            aria-label="Colapsar painel de camadas"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {elements.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Nenhum elemento no canvas
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {[...elements].reverse().map((element, index) => (
              <div
                key={element.id}
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                  selectedElement === element.id
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => onElementSelect(element.id)}
              >
                <span className="text-sm">{getElementIcon(element.type)}</span>
                <span className="flex-1 text-sm truncate">
                  {getElementName(element)}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementToggleVisibility?.(element.id);
                    }}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    title="Alternar visibilidade"
                    aria-label="Alternar visibilidade do elemento"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementToggleLock?.(element.id);
                    }}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    title="Alternar bloqueio"
                    aria-label="Alternar bloqueio do elemento"
                  >
                    <Unlock className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                    }}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100 text-red-500 hover:text-red-600"
                    title="Excluir elemento"
                    aria-label="Excluir elemento"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default LayersPanel;
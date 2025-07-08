import { useRef, useEffect } from "react";
import { CanvasElement } from "./types";
import { Card } from "@/components/ui/card";

interface MiniMapProps {
  elements: CanvasElement[];
  canvasSize: { width: number; height: number };
  viewportPosition: { x: number; y: number };
  zoom: number;
  onViewportChange?: (position: { x: number; y: number }) => void;
}

const MiniMap = ({ 
  elements, 
  canvasSize, 
  viewportPosition, 
  zoom,
  onViewportChange 
}: MiniMapProps) => {
  const canvasRef = canvasRef.current?.getBoundingClientRect(); //useRef<HTMLCanvasElement>(null);
  const miniMapSize = { width: 200, height: 150 };
  
  const scale = Math.min(
    miniMapSize.width / canvasSize.width,
    miniMapSize.height / canvasSize.height
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, miniMapSize.width, miniMapSize.height);

    // Draw elements
    elements.forEach(element => {
      if (element.type === 'arrow') return; // Skip arrows for simplicity

      const x = element.x * scale;
      const y = element.y * scale;
      const width = element.width * scale;
      const height = element.height * scale;

      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(x, y, width, height);
    });

    // Draw viewport indicator
    const viewportWidth = (window.innerWidth / zoom) * scale;
    const viewportHeight = (window.innerHeight / zoom) * scale;
    const viewportX = (viewportPosition.x / zoom) * scale;
    const viewportY = (viewportPosition.y / zoom) * scale;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight);
  }, [elements, canvasSize, viewportPosition, zoom, scale]);

  const handleClick = (e: React.MouseEvent) => {
    if (!onViewportChange) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    onViewportChange({ x: x * zoom, y: y * zoom });
  };

  return (
    <Card className="absolute bottom-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg">
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Mini-mapa
        </div>
        <canvas
          ref={canvasRef}
          width={miniMapSize.width}
          height={miniMapSize.height}
          className="border border-slate-200 dark:border-slate-600 rounded cursor-pointer"
          onClick={handleClick}
        />
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>
    </Card>
  );
};

export default MiniMap;
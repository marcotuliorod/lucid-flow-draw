import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Square, 
  Circle, 
  ArrowRight, 
  Type, 
  Undo, 
  Redo, 
  Download,
  Save,
  ArrowLeft,
  Diamond,
  MousePointer
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond' | 'arrow' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color: string;
}

const ProcessEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [projectName, setProjectName] = useState("Novo Processo");
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'diamond', icon: Diamond, label: 'Losango' },
    { id: 'arrow', icon: ArrowRight, label: 'Seta' },
    { id: 'text', icon: Type, label: 'Texto' }
  ];

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'select') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || selectedTool === 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = Math.abs(endX - startPos.x);
    const height = Math.abs(endY - startPos.y);

    if (width > 10 || height > 10) {
      const newElement: CanvasElement = {
        id: Date.now().toString(),
        type: selectedTool as any,
        x: Math.min(startPos.x, endX),
        y: Math.min(startPos.y, endY),
        width: width || 100,
        height: height || 60,
        text: selectedTool === 'text' ? 'Texto' : '',
        color: '#3B82F6'
      };

      setElements([...elements, newElement]);
    }

    setIsDrawing(false);
    setSelectedTool('select');
  };

  const handleExportPDF = () => {
    console.log('Exportando PDF...');
    // Simulação de exportação
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${projectName}.pdf`;
    link.click();
  };

  const handleSave = () => {
    console.log('Salvando projeto...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 text-gray-900 dark:text-white"
              />
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {elements.length} elementos
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Toolbar */}
        <aside className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`w-12 h-12 p-0 ${
                  selectedTool === tool.id 
                    ? 'bg-blue-600 text-white dark:bg-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedTool(tool.id)}
                title={tool.label}
              >
                <Icon className="h-5 w-5" />
              </Button>
            );
          })}
        </aside>

        {/* Canvas */}
        <main className="flex-1 relative overflow-hidden">
          <div 
            ref={canvasRef}
            className="w-full h-full bg-white dark:bg-gray-800 relative cursor-crosshair"
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            style={{
              backgroundImage: `
                radial-gradient(circle, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className="absolute border-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-sm font-medium text-blue-900 dark:text-blue-100 rounded cursor-move hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  borderRadius: element.type === 'circle' ? '50%' : element.type === 'diamond' ? '0' : '8px',
                  transform: element.type === 'diamond' ? 'rotate(45deg)' : 'none'
                }}
              >
                {element.text || element.type}
              </div>
            ))}

            {/* Instructions */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-dashed border-2 border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <PenTool className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Comece a desenhar seu processo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Selecione uma ferramenta na barra lateral e clique e arraste para criar elementos
                    </p>
                    <div className="flex justify-center space-x-2">
                      {tools.slice(1, 4).map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Button
                            key={tool.id}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTool(tool.id)}
                            className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                          >
                            <Icon className="h-4 w-4 mr-1" />
                            {tool.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcessEditor;

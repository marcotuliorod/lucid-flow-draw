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
  MousePointer,
  LogOut
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
  startElementId?: string;
  endElementId?: string;
}

const ProcessEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [projectName, setProjectName] = useState("Novo Processo");
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [nearElement, setNearElement] = useState<string | null>(null);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'diamond', icon: Diamond, label: 'Losango' },
    { id: 'arrow', icon: ArrowRight, label: 'Seta' },
    { id: 'text', icon: Type, label: 'Texto' }
  ];

  // Função para encontrar elemento próximo do cursor
  const findNearElement = (x: number, y: number) => {
    const threshold = 30;
    return elements.find(element => {
      if (element.type === 'arrow') return false;
      
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      return distance < threshold;
    });
  };

  // Função para obter ponto de conexão de um elemento
  const getConnectionPoint = (element: CanvasElement) => {
    return {
      x: element.x + element.width / 2,
      y: element.y + element.height / 2
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'select') {
      // Verificar se clicou em um elemento
      const clickedElement = elements.find(element => 
        x >= element.x && x <= element.x + element.width &&
        y >= element.y && y <= element.y + element.height
      );
      
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
      } else {
        setSelectedElement(null);
      }
      return;
    }
    
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);

    if (selectedTool === 'arrow') {
      const nearEl = findNearElement(x, y);
      setNearElement(nearEl?.id || null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing && selectedTool !== 'select') {
      setCurrentPos({ x, y });

      if (selectedTool === 'arrow') {
        const nearEl = findNearElement(x, y);
        setNearElement(nearEl?.id || null);
      }
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || selectedTool === 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (selectedTool === 'arrow') {
      const startElement = findNearElement(startPos.x, startPos.y);
      const endElement = findNearElement(endX, endY);

      if (startElement && endElement && startElement.id !== endElement.id) {
        const startPoint = getConnectionPoint(startElement);
        const endPoint = getConnectionPoint(endElement);

        const newArrow: CanvasElement = {
          id: Date.now().toString(),
          type: 'arrow',
          x: startPoint.x,
          y: startPoint.y,
          width: Math.abs(endPoint.x - startPoint.x),
          height: Math.abs(endPoint.y - startPoint.y),
          color: '#3B82F6',
          startElementId: startElement.id,
          endElementId: endElement.id
        };

        setElements([...elements, newArrow]);
      }
    } else {
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
          text: selectedTool === 'text' ? 'Texto' : `${selectedTool}`,
          color: '#3B82F6'
        };

        setElements([...elements, newElement]);
      }
    }

    setIsDrawing(false);
    setNearElement(null);
    setSelectedTool('select');
  };

  const handleElementDoubleClick = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element && element.type !== 'arrow') {
      setEditingText(elementId);
      setTempText(element.text || '');
    }
  };

  const handleTextSubmit = () => {
    if (editingText) {
      setElements(elements.map(el => 
        el.id === editingText ? { ...el, text: tempText } : el
      ));
      setEditingText(null);
      setTempText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setEditingText(null);
      setTempText('');
    }
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

  const handleLogout = () => {
    console.log('Fazendo logout...');
    navigate('/');
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

    return (
      <div className="absolute pointer-events-none">
        {/* Linha da seta */}
        <div
          className="absolute bg-blue-500 dark:bg-blue-400"
          style={{
            left: startPoint.x,
            top: startPoint.y - 1,
            width: length,
            height: 2,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}rad)`
          }}
        />
        {/* Ponta da seta */}
        <div
          className="absolute w-0 h-0 border-l-8 border-l-blue-500 dark:border-l-blue-400 border-t-4 border-b-4 border-t-transparent border-b-transparent"
          style={{
            left: endPoint.x - 8,
            top: endPoint.y - 4
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
    if (!isDrawing || selectedTool === 'select' || selectedTool === 'arrow') return null;

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
        {selectedTool === 'text' ? 'Texto' : selectedTool}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-light"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-xl font-light border-none p-0 h-auto bg-transparent focus-visible:ring-0 text-slate-900 dark:text-white min-w-48"
              />
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 font-light">
              {elements.length} elementos
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleSave} className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg">
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Toolbar */}
        <aside className="w-20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col items-center py-6 space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`w-14 h-14 p-0 rounded-xl ${
                  selectedTool === tool.id 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700'
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
            className="w-full h-full bg-white dark:bg-slate-800 relative cursor-crosshair"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{
              backgroundImage: `
                radial-gradient(circle, #e2e8f0 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          >
            {/* Elementos existentes */}
            {elements.map((element) => {
              if (element.type === 'arrow') {
                const startElement = elements.find(el => el.id === element.startElementId);
                const endElement = elements.find(el => el.id === element.endElementId);
                
                if (!startElement || !endElement) return null;

                const startPoint = getConnectionPoint(startElement);
                const endPoint = getConnectionPoint(endElement);
                
                const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
                const length = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));

                return (
                  <div key={element.id} className="absolute pointer-events-none">
                    {/* Linha da seta */}
                    <div
                      className={`absolute ${selectedElement === element.id ? 'bg-orange-500' : 'bg-blue-500 dark:bg-blue-400'}`}
                      style={{
                        left: startPoint.x,
                        top: startPoint.y - 1,
                        width: length,
                        height: 2,
                        transformOrigin: '0 50%',
                        transform: `rotate(${angle}rad)`
                      }}
                    />
                    {/* Ponta da seta */}
                    <div
                      className={`absolute w-0 h-0 ${selectedElement === element.id ? 'border-l-orange-500 border-l-8' : 'border-l-blue-500 dark:border-l-blue-400 border-l-8'} border-t-4 border-b-4 border-t-transparent border-b-transparent`}
                      style={{
                        left: endPoint.x - 8,
                        top: endPoint.y - 4
                      }}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={element.id}
                  className={`absolute border cursor-move hover:bg-blue-100/80 dark:hover:bg-blue-800/30 transition-all duration-200 flex items-center justify-center text-sm font-light ${
                    selectedElement === element.id 
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
                  onClick={() => setSelectedElement(element.id)}
                  onDoubleClick={() => handleElementDoubleClick(element.id)}
                >
                  {editingText === element.id ? (
                    <Input
                      value={tempText}
                      onChange={(e) => setTempText(e.target.value)}
                      onBlur={handleTextSubmit}
                      onKeyDown={handleKeyPress}
                      className="w-full h-full text-center border-none bg-transparent text-sm p-0 focus-visible:ring-0"
                      autoFocus
                    />
                  ) : (
                    element.text || element.type
                  )}
                </div>
              );
            })}

            {/* Preview da seta durante o desenho */}
            {renderArrowPreview()}

            {/* Elemento de preview durante o desenho (exceto seta) */}
            {renderPreviewElement()}

            {/* Instructions */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="p-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-dashed border-2 border-slate-300 dark:border-slate-600 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <PenTool className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-light text-slate-900 dark:text-white mb-3">
                      Comece a desenhar seu processo
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 font-light max-w-md leading-relaxed">
                      Selecione uma ferramenta na barra lateral e clique e arraste para criar elementos. 
                      Dê duplo clique nos elementos para editar o texto.
                    </p>
                    <div className="flex justify-center space-x-3">
                      {tools.slice(1, 4).map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Button
                            key={tool.id}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTool(tool.id)}
                            className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 font-light rounded-lg"
                          >
                            <Icon className="h-4 w-4 mr-2" />
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


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Square, Circle, Diamond } from "lucide-react";

interface EmptyCanvasProps {
  onToolSelect: (toolId: string) => void;
}

const EmptyCanvas = ({ onToolSelect }: EmptyCanvasProps) => {
  const quickTools = [
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'diamond', icon: Diamond, label: 'Losango' }
  ];

  return (
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
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onToolSelect(tool.id)}
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
  );
};

export default EmptyCanvas;

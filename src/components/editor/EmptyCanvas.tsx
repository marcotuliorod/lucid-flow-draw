
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow, Square, Circle, Diamond } from "lucide-react";

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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Workflow className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-light text-slate-900 dark:text-white mb-3">
            Inicie seu fluxo criativo
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-8 font-light max-w-md leading-relaxed">
            Selecione uma ferramenta na barra lateral e deixe suas ideias fluírem. 
            Dê duplo clique nos elementos para editar o texto e personalize seu processo.
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
                  className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 font-light rounded-lg hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
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

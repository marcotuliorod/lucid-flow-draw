
import { Button } from "@/components/ui/button";
import { 
  Square, 
  Circle, 
  ArrowRight, 
  Type, 
  MousePointer,
  Diamond
} from "lucide-react";

interface Tool {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface EditorToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const EditorToolbar = ({ selectedTool, onToolSelect }: EditorToolbarProps) => {
  const tools: Tool[] = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'diamond', icon: Diamond, label: 'Losango' },
    { id: 'arrow', icon: ArrowRight, label: 'Seta' },
    { id: 'text', icon: Type, label: 'Texto' }
  ];

  return (
    <aside className="w-20 bg-white dark:bg-slate-800 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-6 space-y-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            className={`w-14 h-14 p-0 rounded-xl ${
              selectedTool === tool.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700'
            }`}
            onClick={() => onToolSelect(tool.id)}
            title={tool.label}
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
    </aside>
  );
};

export default EditorToolbar;

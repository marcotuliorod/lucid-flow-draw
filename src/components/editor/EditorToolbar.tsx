
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { 
  Square, 
  Circle, 
  ArrowRight, 
  Type, 
  MousePointer,
  Diamond,
  Image,
  Play,
  Square as Stop,
  CheckSquare,
  GitBranch,
  Folder,
  FileText,
  MessageSquare,
  Layers
} from "lucide-react";

interface Tool {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface EditorToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onImageUpload?: (file: File) => void;
}

const EditorToolbar = ({ selectedTool, onToolSelect, onImageUpload }: EditorToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const basicTools: Tool[] = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' }
  ];

  const processTools: Tool[] = [
    { id: 'start', icon: Play, label: 'Início' },
    { id: 'end', icon: Stop, label: 'Fim' },
    { id: 'task', icon: CheckSquare, label: 'Tarefa' },
    { id: 'decision', icon: Diamond, label: 'Decisão' },
    { id: 'subprocess', icon: Folder, label: 'Subprocesso' },
    { id: 'document', icon: FileText, label: 'Documento' },
    { id: 'annotation', icon: MessageSquare, label: 'Anotação' }
  ];

  const shapeTools: Tool[] = [
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'text', icon: Type, label: 'Texto' },
    { id: 'image', icon: Image, label: 'Imagem' }
  ];

  const connectionTools: Tool[] = [
    { id: 'arrow', icon: ArrowRight, label: 'Conectar' }
  ];

  const allTools = [...basicTools, ...processTools, ...shapeTools, ...connectionTools];

  const handleImageClick = () => {
    if (selectedTool === 'image') {
      fileInputRef.current?.click();
    } else {
      onToolSelect('image');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  const renderToolSection = (tools: Tool[], title: string) => (
    <div className="space-y-2">
      <div className="px-2">
        <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isImageTool = tool.id === 'image';
          
          return (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className={`w-16 h-12 p-0 rounded-lg mx-2 ${
                selectedTool === tool.id 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700'
              }`}
              onClick={isImageTool ? handleImageClick : () => onToolSelect(tool.id)}
              title={tool.label}
              aria-label={tool.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-20 bg-white dark:bg-slate-800 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 flex flex-col py-4 space-y-4 overflow-y-auto">
      {renderToolSection(basicTools, "Básico")}
      <div className="h-px bg-slate-200 dark:bg-slate-600 mx-2" />
      {renderToolSection(processTools, "Processo")}
      <div className="h-px bg-slate-200 dark:bg-slate-600 mx-2" />
      {renderToolSection(shapeTools, "Formas")}
      <div className="h-px bg-slate-200 dark:bg-slate-600 mx-2" />
      {renderToolSection(connectionTools, "Conexão")}
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </aside>
  );
};

export default EditorToolbar;

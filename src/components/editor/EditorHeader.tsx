
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow, 
  ArrowLeft,
  Save,
  Undo,
  Redo,
  Download,
  LogOut,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

interface EditorHeaderProps {
  projectName: string;
  setProjectName: (name: string) => void;
  elementsCount: number;
  onSave: () => void;
  onExportPDF: () => void;
  onLogout: () => void;
  saving?: boolean;
}

const EditorHeader = ({ 
  projectName, 
  setProjectName, 
  elementsCount, 
  onSave, 
  onExportPDF, 
  onLogout,
  saving = false
}: EditorHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-slate-800 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-4">
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
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Workflow className="h-4 w-4 text-white" />
            </div>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-xl font-light border-none p-0 h-auto bg-transparent focus-visible:ring-0 text-slate-900 dark:text-white min-w-48"
            />
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-0 font-light">
            {elementsCount} elementos
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSave} 
            disabled={saving}
            className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg">
            <Redo className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button 
            onClick={onExportPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLogout}
            className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-light rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;

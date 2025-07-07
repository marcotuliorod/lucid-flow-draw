
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Workflow, 
  ArrowLeft,
  Save,
  Undo,
  Redo,
  Download,
  LogOut,
  Loader2,
  ZoomIn, 
  ZoomOut, 
  Share, 
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Group,
  Ungroup,
  Grid3x3,
  Layers
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { useState } from "react";

interface EditorHeaderProps {
  projectName: string;
  setProjectName: (name: string) => void;
  elementsCount: number;
  onSave: () => void;
  onExportPDF: () => void;
  onLogout: () => void;
  saving?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onToggleGrid?: () => void;
  showGrid?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  zoom?: number;
}

const EditorHeader = ({ 
  projectName, 
  setProjectName, 
  elementsCount, 
  onSave, 
  onExportPDF, 
  onLogout,
  saving = false,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onGroup,
  onUngroup,
  onToggleGrid,
  showGrid = false,
  canUndo = false,
  canRedo = false,
  zoom = 100
}: EditorHeaderProps) => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameSubmit = () => {
    setIsEditingName(false);
  };

  const handleExport = (format: string) => {
    if (format === 'pdf') {
      onExportPDF();
    } else {
      console.log(`Exportando como ${format}...`);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                className="text-lg font-medium w-64"
                autoFocus
              />
            ) : (
              <h1
                className="text-lg font-medium text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded"
                onClick={() => setIsEditingName(true)}
              >
                {projectName}
              </h1>
            )}
            <Badge variant="secondary" className="text-xs">
              {elementsCount} elementos
            </Badge>
          </div>
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 p-0"
              title="Desfazer (Ctrl+Z)"
              aria-label="Desfazer"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8 p-0"
              title="Refazer (Ctrl+Y)"
              aria-label="Refazer"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="h-8 w-8 p-0"
              title="Diminuir zoom"
              aria-label="Diminuir zoom"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-300 min-w-12 text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="h-8 w-8 p-0"
              title="Aumentar zoom"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAlignLeft}
              className="h-8 w-8 p-0"
              title="Alinhar à esquerda"
              aria-label="Alinhar à esquerda"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAlignCenter}
              className="h-8 w-8 p-0"
              title="Alinhar ao centro"
              aria-label="Alinhar ao centro"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAlignRight}
              className="h-8 w-8 p-0"
              title="Alinhar à direita"
              aria-label="Alinhar à direita"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGroup}
              className="h-8 w-8 p-0"
              title="Agrupar elementos"
              aria-label="Agrupar elementos"
            >
              <Group className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUngroup}
              className="h-8 w-8 p-0"
              title="Desagrupar elementos"
              aria-label="Desagrupar elementos"
            >
              <Ungroup className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleGrid}
            className={`h-8 w-8 p-0 ${showGrid ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}`}
            title="Alternar grade"
            aria-label="Alternar grade"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 dark:text-slate-300"
            title="Modo de visualização"
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Exportar projeto">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('png')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('svg')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>

          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;

import { CanvasElement } from "../types";

interface UseTextEditingProps {
  elements: CanvasElement[];
  setElements: (updater: (prev: CanvasElement[]) => CanvasElement[]) => void;
  editingText: string | null;
  setEditingText: (id: string | null) => void;
  tempText: string;
  setTempText: (text: string) => void;
}

export const useTextEditing = ({
  elements,
  setElements,
  editingText,
  setEditingText,
  tempText,
  setTempText
}: UseTextEditingProps) => {
  const handleElementDoubleClick = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element && element.type !== 'arrow') {
      setEditingText(elementId);
      setTempText(element.text || '');
    }
  };

  const handleTextSubmit = () => {
    if (editingText) {
      setElements(prev => prev.map(el => 
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

  return {
    handleElementDoubleClick,
    handleTextSubmit,
    handleKeyPress
  };
};
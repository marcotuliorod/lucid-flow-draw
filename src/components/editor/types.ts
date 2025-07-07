
export interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond' | 'arrow' | 'text' | 'image' | 'start' | 'end' | 'task' | 'decision' | 'subprocess' | 'document' | 'annotation';
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color: string;
  startElementId?: string;
  endElementId?: string;
  imageUrl?: string;
  grouped?: boolean;
  groupId?: string;
}

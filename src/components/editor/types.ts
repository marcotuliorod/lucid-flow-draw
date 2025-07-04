
export interface CanvasElement {
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

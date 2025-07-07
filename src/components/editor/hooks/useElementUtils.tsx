import { CanvasElement } from "../types";

export const useElementUtils = () => {
  // Função para obter texto padrão baseado no tipo
  const getDefaultText = (type: CanvasElement['type']) => {
    const textMap = {
      start: 'Início',
      end: 'Fim', 
      task: 'Tarefa',
      decision: 'Decisão',
      subprocess: 'Subprocesso',
      document: 'Documento',
      annotation: 'Anotação',
      rectangle: 'Retângulo',
      circle: 'Círculo',
      diamond: 'Losango',
      text: 'Texto',
      arrow: '',
      image: ''
    };
    return textMap[type] || type;
  };

  // Função para encontrar elemento próximo do cursor
  const findNearElement = (x: number, y: number, elements: CanvasElement[]) => {
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
  const getConnectionPoint = (element: CanvasElement) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  });

  // Função para encontrar elemento clicado
  const findClickedElement = (x: number, y: number, elements: CanvasElement[]) => {
    return elements.find(element => 
      x >= element.x && x <= element.x + element.width &&
      y >= element.y && y <= element.y + element.height
    );
  };

  return {
    getDefaultText,
    findNearElement,
    getConnectionPoint,
    findClickedElement
  };
};
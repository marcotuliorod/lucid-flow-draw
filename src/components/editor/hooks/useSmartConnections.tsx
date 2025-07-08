import { useMemo } from 'react';
import { CanvasElement } from '../types';

interface UseSmartConnectionsProps {
  elements: CanvasElement[];
}

export const useSmartConnections = ({ elements }: UseSmartConnectionsProps) => {
  
  // Calcula o melhor ponto de conexão baseado na posição relativa dos elementos
  const getOptimalConnectionPoints = (startElement: CanvasElement, endElement: CanvasElement) => {
    const startCenter = {
      x: startElement.x + startElement.width / 2,
      y: startElement.y + startElement.height / 2
    };
    
    const endCenter = {
      x: endElement.x + endElement.width / 2,
      y: endElement.y + endElement.height / 2
    };

    // Calcula a diferença de posição
    const dx = endCenter.x - startCenter.x;
    const dy = endCenter.y - startCenter.y;

    let startPoint = { x: startCenter.x, y: startCenter.y };
    let endPoint = { x: endCenter.x, y: endCenter.y };

    // Determina os pontos de conexão baseado na direção
    if (Math.abs(dx) > Math.abs(dy)) {
      // Conexão horizontal
      if (dx > 0) {
        // Esquerda para direita
        startPoint = { 
          x: startElement.x + startElement.width, 
          y: startCenter.y 
        };
        endPoint = { 
          x: endElement.x, 
          y: endCenter.y 
        };
      } else {
        // Direita para esquerda
        startPoint = { 
          x: startElement.x, 
          y: startCenter.y 
        };
        endPoint = { 
          x: endElement.x + endElement.width, 
          y: endCenter.y 
        };
      }
    } else {
      // Conexão vertical
      if (dy > 0) {
        // Cima para baixo
        startPoint = { 
          x: startCenter.x, 
          y: startElement.y + startElement.height 
        };
        endPoint = { 
          x: endCenter.x, 
          y: endElement.y 
        };
      } else {
        // Baixo para cima
        startPoint = { 
          x: startCenter.x, 
          y: startElement.y 
        };
        endPoint = { 
          x: endCenter.x, 
          y: endElement.y + endElement.height 
        };
      }
    }

    return { startPoint, endPoint };
  };

  // Calcula o caminho da seta com curvas suaves
  const getSmartArrowPath = (startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    // Se a conexão é direta (sem obstáculos), usa linha reta
    if (Math.abs(dx) < 20 || Math.abs(dy) < 20) {
      return {
        path: `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`,
        length: Math.sqrt(dx * dx + dy * dy)
      };
    }

    // Calcula pontos de controle para curva suave
    const controlOffset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.5;
    
    let controlPoint1, controlPoint2;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Curva horizontal
      controlPoint1 = { 
        x: startPoint.x + (dx > 0 ? controlOffset : -controlOffset), 
        y: startPoint.y 
      };
      controlPoint2 = { 
        x: endPoint.x - (dx > 0 ? controlOffset : -controlOffset), 
        y: endPoint.y 
      };
    } else {
      // Curva vertical
      controlPoint1 = { 
        x: startPoint.x, 
        y: startPoint.y + (dy > 0 ? controlOffset : -controlOffset) 
      };
      controlPoint2 = { 
        x: endPoint.x, 
        y: endPoint.y - (dy > 0 ? controlOffset : -controlOffset) 
      };
    }

    const path = `M ${startPoint.x} ${startPoint.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${endPoint.x} ${endPoint.y}`;
    
    return {
      path,
      length: Math.sqrt(dx * dx + dy * dy)
    };
  };

  // Detecta elementos próximos para sugestão de conexão
  const findNearbyElements = (x: number, y: number, threshold = 50) => {
    return elements.filter(element => {
      if (element.type === 'arrow') return false;
      
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      return distance <= threshold;
    }).sort((a, b) => {
      const distanceA = Math.sqrt(Math.pow(x - (a.x + a.width / 2), 2) + Math.pow(y - (a.y + a.height / 2), 2));
      const distanceB = Math.sqrt(Math.pow(x - (b.x + b.width / 2), 2) + Math.pow(y - (b.y + b.height / 2), 2));
      return distanceA - distanceB;
    });
  };

  // Valida se uma conexão é permitida (evita loops e conexões duplicadas)
  const validateConnection = (startElementId: string, endElementId: string) => {
    if (startElementId === endElementId) return false;
    
    // Verifica se já existe uma conexão entre esses elementos
    const existingConnection = elements.find(el => 
      el.type === 'arrow' && 
      el.startElementId === startElementId && 
      el.endElementId === endElementId
    );
    
    if (existingConnection) return false;

    // Verifica se não criaria um loop direto
    const reverseConnection = elements.find(el => 
      el.type === 'arrow' && 
      el.startElementId === endElementId && 
      el.endElementId === startElementId
    );
    
    return !reverseConnection;
  };

  return {
    getOptimalConnectionPoints,
    getSmartArrowPath,
    findNearbyElements,
    validateConnection
  };
};
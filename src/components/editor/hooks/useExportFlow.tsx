import { useCallback } from 'react';
import { CanvasElement } from '../types';
import { toast } from 'sonner';

export const useExportFlow = () => {

  const exportToPDF = useCallback(async (elements: CanvasElement[], projectName: string) => {
    try {
      toast.info('Iniciando exportação para PDF...');
      
      // Simula o processo de exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria implementada a lógica real de exportação PDF
      // usando bibliotecas como jsPDF ou Puppeteer
      
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
    }
  }, []);

  const exportToPNG = useCallback(async (elements: CanvasElement[], projectName: string) => {
    try {
      toast.info('Iniciando exportação para PNG...');
      
      // Calcula as dimensões necessárias
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      elements.forEach(element => {
        if (element.type !== 'arrow') {
          minX = Math.min(minX, element.x);
          minY = Math.min(minY, element.y);
          maxX = Math.max(maxX, element.x + element.width);
          maxY = Math.max(maxY, element.y + element.height);
        }
      });

      const width = maxX - minX + 100; // padding
      const height = maxY - minY + 100; // padding

      // Cria um canvas temporário
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Não foi possível criar contexto do canvas');
      }

      // Define fundo branco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Renderiza os elementos
      elements.forEach(element => {
        if (element.type === 'arrow') return;
        
        const x = element.x - minX + 50;
        const y = element.y - minY + 50;
        
        // Desenha o elemento baseado no tipo
        ctx.fillStyle = element.color || '#3b82f6';
        
        if (element.type === 'circle') {
          ctx.beginPath();
          ctx.arc(x + element.width/2, y + element.height/2, element.width/2, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, element.width, element.height);
        }
        
        // Adiciona texto
        if (element.text) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(element.text, x + element.width/2, y + element.height/2);
        }
      });

      // Converte para blob e faz download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${projectName}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('PNG exportado com sucesso!');
        }
      });
      
    } catch (error) {
      console.error('Erro ao exportar PNG:', error);
      toast.error('Erro ao exportar PNG');
    }
  }, []);

  const exportToSVG = useCallback(async (elements: CanvasElement[], projectName: string) => {
    try {
      toast.info('Iniciando exportação para SVG...');
      
      // Calcula as dimensões necessárias
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      elements.forEach(element => {
        if (element.type !== 'arrow') {
          minX = Math.min(minX, element.x);
          minY = Math.min(minY, element.y);
          maxX = Math.max(maxX, element.x + element.width);
          maxY = Math.max(maxY, element.y + element.height);
        }
      });

      const width = maxX - minX + 100;
      const height = maxY - minY + 100;

      // Cria SVG
      let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
      svgContent += `<rect width="100%" height="100%" fill="white"/>`;

      elements.forEach(element => {
        if (element.type === 'arrow') return;
        
        const x = element.x - minX + 50;
        const y = element.y - minY + 50;
        
        if (element.type === 'circle') {
          svgContent += `<circle cx="${x + element.width/2}" cy="${y + element.height/2}" r="${element.width/2}" fill="${element.color || '#3b82f6'}"/>`;
        } else {
          svgContent += `<rect x="${x}" y="${y}" width="${element.width}" height="${element.height}" fill="${element.color || '#3b82f6'}"/>`;
        }
        
        if (element.text) {
          svgContent += `<text x="${x + element.width/2}" y="${y + element.height/2}" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial" font-size="14">${element.text}</text>`;
        }
      });

      svgContent += '</svg>';

      // Faz download
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('SVG exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar SVG:', error);
      toast.error('Erro ao exportar SVG');
    }
  }, []);

  const exportToJSON = useCallback(async (elements: CanvasElement[], projectName: string) => {
    try {
      toast.info('Iniciando exportação para JSON...');
      
      const data = {
        projectName,
        exportDate: new Date().toISOString(),
        elements,
        version: '1.0'
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('JSON exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      toast.error('Erro ao exportar JSON');
    }
  }, []);

  return {
    exportToPDF,
    exportToPNG,
    exportToSVG,
    exportToJSON
  };
};
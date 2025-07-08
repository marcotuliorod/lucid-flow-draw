import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useNewProject = () => {
  const navigate = useNavigate();

  const createNewProject = useCallback(() => {
    try {
      // Limpa qualquer estado anterior no localStorage
      localStorage.removeItem('current-project-elements');
      localStorage.removeItem('current-project-id');
      localStorage.removeItem('current-project-name');
      
      // Navega para o editor com um novo projeto
      navigate('/editor/new');
      
      toast.success('Novo projeto criado!');
    } catch (error) {
      console.error('Erro ao criar novo projeto:', error);
      toast.error('Erro ao criar novo projeto');
    }
  }, [navigate]);

  const createProjectFromTemplate = useCallback((templateType: string) => {
    const templates = {
      simple: [
        {
          id: 'start-1',
          type: 'start' as const,
          x: 100,
          y: 100,
          width: 100,
          height: 60,
          text: 'Início',
          color: '#10b981'
        },
        {
          id: 'task-1',
          type: 'task' as const,
          x: 300,
          y: 100,
          width: 120,
          height: 60,
          text: 'Processo',
          color: '#3b82f6'
        },
        {
          id: 'end-1',
          type: 'end' as const,
          x: 500,
          y: 100,
          width: 100,
          height: 60,
          text: 'Fim',
          color: '#ef4444'
        }
      ],
      decision: [
        {
          id: 'start-1',
          type: 'start' as const,
          x: 100,
          y: 50,
          width: 100,
          height: 60,
          text: 'Início',
          color: '#10b981'
        },
        {
          id: 'decision-1',
          type: 'decision' as const,
          x: 300,
          y: 50,
          width: 100,
          height: 100,
          text: 'Decisão?',
          color: '#f59e0b'
        },
        {
          id: 'task-1',
          type: 'task' as const,
          x: 500,
          y: 20,
          width: 120,
          height: 60,
          text: 'Opção A',
          color: '#3b82f6'
        },
        {
          id: 'task-2',
          type: 'task' as const,
          x: 500,
          y: 120,
          width: 120,
          height: 60,
          text: 'Opção B',
          color: '#3b82f6'
        },
        {
          id: 'end-1',
          type: 'end' as const,
          x: 700,
          y: 70,
          width: 100,
          height: 60,
          text: 'Fim',
          color: '#ef4444'
        }
      ]
    };

    const template = templates[templateType as keyof typeof templates];
    if (template) {
      localStorage.setItem('template-elements', JSON.stringify(template));
      navigate('/editor/new');
      toast.success(`Projeto criado com template ${templateType}!`);
    }
  }, [navigate]);

  const duplicateProject = useCallback((projectData: any) => {
    try {
      const duplicatedElements = projectData.elements.map((element: any) => ({
        ...element,
        id: crypto.randomUUID(), // Novo ID para evitar conflitos
        x: element.x + 50, // Offset para mostrar que é uma cópia
        y: element.y + 50
      }));

      localStorage.setItem('template-elements', JSON.stringify(duplicatedElements));
      localStorage.setItem('template-name', `${projectData.name} - Cópia`);
      navigate('/editor/new');
      
      toast.success('Projeto duplicado!');
    } catch (error) {
      console.error('Erro ao duplicar projeto:', error);
      toast.error('Erro ao duplicar projeto');
    }
  }, [navigate]);

  return {
    createNewProject,
    createProjectFromTemplate,
    duplicateProject
  };
};
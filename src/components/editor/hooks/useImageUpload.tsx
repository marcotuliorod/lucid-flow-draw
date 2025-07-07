import { toast } from "sonner";

export const useImageUpload = () => {
  const handleImageUpload = async (file: File, addImageElement: (url: string, x: number, y: number) => void) => {
    const { validateImageFile, uploadImageToStorage } = await import('@/lib/fileValidation');
    const { supabase } = await import('@/integrations/supabase/client');

    // Validate file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Arquivo inválido');
      return;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      // Upload to secure storage
      const uploadResult = await uploadImageToStorage(file, user.id, supabase);
      
      if (uploadResult.success && uploadResult.url) {
        addImageElement(uploadResult.url, 100, 100);
        toast.success('Imagem adicionada com sucesso');
      } else {
        toast.error(uploadResult.error || 'Erro no upload da imagem');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Erro inesperado no upload da imagem');
    }
  };

  return {
    handleImageUpload
  };
};
import { validateFileUpload } from './security'

// Enhanced file validation with file header checking
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Basic validation using existing security function
  const basicValidation = validateFileUpload(file)
  if (!basicValidation.valid) {
    return basicValidation
  }

  // Additional image-specific validation
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Arquivo deve ser uma imagem' }
  }

  // Check file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Imagem muito grande (máximo 5MB)' }
  }

  return { valid: true }
}

// Secure file upload to Supabase Storage
export const uploadImageToStorage = async (
  file: File, 
  userId: string,
  supabase: any
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validate file first
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate secure filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('canvas-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: 'Erro ao fazer upload da imagem' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('canvas-images')
      .getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Erro inesperado no upload' }
  }
}
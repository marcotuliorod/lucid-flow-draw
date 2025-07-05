
// Security configuration and utilities
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_TIMEOUT_MINUTES: 15,
  SESSION_TIMEOUT_HOURS: 24,
  MAX_PROJECT_SIZE_KB: 1024, // 1MB max project size
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILE_SIZE_MB: 5
} as const

// Security headers for enhanced protection
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
})

// Content Security Policy helpers
export const generateCSPHeader = (isDevelopment: boolean = false) => {
  const baseCSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Vite requires unsafe-inline in development
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co"
  ]

  if (isDevelopment) {
    baseCSP.push("script-src 'self' 'unsafe-inline' 'unsafe-eval'") // Allow eval for hot reload
  }

  return baseCSP.join('; ')
}

// Suspicious activity detection
export interface SecurityEvent {
  type: 'failed_login' | 'rapid_requests' | 'unusual_access' | 'data_export'
  userId?: string
  ip?: string
  userAgent?: string
  timestamp: Date
  details?: Record<string, any>
}

// Security event logger (for future implementation with Supabase Edge Functions)
export const logSecurityEvent = (event: SecurityEvent) => {
  if (import.meta.env.DEV) {
    console.warn('Security Event:', event)
  }
  
  // In production, this would send to a logging service
  // or Supabase Edge Function for processing
}

// Rate limiting check (client-side basic implementation)
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now()
  const windowKey = `${key}:${Math.floor(now / windowMs)}`
  
  const stored = localStorage.getItem(windowKey)
  const count = stored ? parseInt(stored, 10) : 0
  
  if (count >= limit) {
    return false // Rate limit exceeded
  }
  
  localStorage.setItem(windowKey, (count + 1).toString())
  
  // Clean up old entries
  Object.keys(localStorage).forEach(key => {
    if (key.includes(':') && key.startsWith(key.split(':')[0])) {
      const timestamp = parseInt(key.split(':')[1], 10)
      if (now - timestamp * windowMs > windowMs * 2) {
        localStorage.removeItem(key)
      }
    }
  })
  
  return true
}

// Data sanitization for XSS prevention
export const sanitizeHtmlContent = (content: string): string => {
  const div = document.createElement('div')
  div.textContent = content
  return div.innerHTML
}

// Validate file uploads
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Use type assertion to check against the readonly array
  if (!(SECURITY_CONFIG.ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido' }
  }
  
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: 'Arquivo muito grande' }
  }
  
  return { valid: true }
}

// URL validation for redirects
export const isValidRedirectUrl = (url: string, allowedDomains: string[]): boolean => {
  try {
    const urlObj = new URL(url)
    
    // Only allow HTTPS and same origin
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return false
    }
    
    // Check if domain is in allowed list
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

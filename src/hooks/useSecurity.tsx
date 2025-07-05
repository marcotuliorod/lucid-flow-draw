
import { useEffect } from 'react'
import { getSecurityHeaders, generateCSPHeader, checkRateLimit, logSecurityEvent } from '@/lib/security'

export const useSecurity = () => {
  useEffect(() => {
    // Apply security headers
    const headers = getSecurityHeaders()
    const csp = generateCSPHeader(import.meta.env.DEV)
    
    // Set meta tags for security headers (since we can't set HTTP headers in SPA)
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Apply Content Security Policy
    setMetaTag('Content-Security-Policy', csp)
    
    // Apply other security headers as meta tags
    Object.entries(headers).forEach(([key, value]) => {
      setMetaTag(key, value)
    })

    // Clean up rate limiting storage periodically
    const cleanupRateLimit = () => {
      const now = Date.now()
      Object.keys(localStorage).forEach(key => {
        if (key.includes('rate_limit:')) {
          const parts = key.split(':')
          if (parts.length >= 3) {
            const timestamp = parseInt(parts[2], 10)
            if (now - timestamp > 3600000) { // 1 hour
              localStorage.removeItem(key)
            }
          }
        }
      })
    }

    const interval = setInterval(cleanupRateLimit, 300000) // Clean every 5 minutes

    return () => {
      clearInterval(interval)
    }
  }, [])

  const checkAuthRateLimit = (userId: string, action: 'login' | 'signup'): boolean => {
    const rateLimitKey = `rate_limit:${userId}:${action}`
    const limit = action === 'login' ? 5 : 3 // 5 login attempts, 3 signup attempts per hour
    const windowMs = 3600000 // 1 hour
    
    const allowed = checkRateLimit(rateLimitKey, limit, windowMs)
    
    if (!allowed) {
      logSecurityEvent({
        type: 'rapid_requests',
        userId,
        timestamp: new Date(),
        details: { action, limit_exceeded: true }
      })
    }
    
    return allowed
  }

  return {
    checkAuthRateLimit
  }
}

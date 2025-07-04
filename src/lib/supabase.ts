
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase config:', { 
  url: supabaseUrl ? 'Set' : 'Missing', 
  key: supabaseAnonKey ? 'Set' : 'Missing' 
})

// Create a more complete mock client if env vars are missing
const createMockSupabase = () => {
  const mockError = { message: 'Supabase not configured' }
  
  // Create a chainable query builder that supports all operations
  const createQueryBuilder = () => {
    const queryBuilder = {
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: mockError }),
        select: (columns: string = '*') => ({
          single: () => Promise.resolve({ data: null, error: mockError })
        })
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: mockError }),
      select: (columns: string = '*') => ({
        single: () => Promise.resolve({ data: null, error: mockError })
      })
    }
    return queryBuilder
  }
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: mockError }),
      signInWithPassword: () => Promise.resolve({ data: null, error: mockError }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: mockError })
        }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: mockError })
      }),
      insert: (data: any) => ({
        select: (columns: string = '*') => ({
          single: () => Promise.resolve({ data: null, error: mockError })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns: string = '*') => ({
            single: () => Promise.resolve({ data: null, error: mockError })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      })
    })
  }
}

// Create a mock client if env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase()

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          elements: any
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          elements: any
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          elements?: any
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}

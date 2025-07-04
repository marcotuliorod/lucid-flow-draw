
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase config:', { 
  url: supabaseUrl ? 'Set' : 'Missing', 
  key: supabaseAnonKey ? 'Set' : 'Missing' 
})

// Create a simple mock client if env vars are missing
const createMockSupabase = () => {
  const mockError = { message: 'Supabase not configured' }
  const mockSuccess = { data: [], error: null }
  const mockSingle = { data: null, error: mockError }
  
  // Mock query builder that returns promises and maintains chainability
  const mockQueryBuilder = {
    eq: () => mockQueryBuilder,
    order: () => Promise.resolve(mockSuccess),
    single: () => Promise.resolve(mockSingle),
    select: () => mockQueryBuilder
  }
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: mockError }),
      signInWithPassword: () => Promise.resolve({ data: null, error: mockError }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => mockQueryBuilder,
      insert: () => ({
        select: () => mockQueryBuilder
      }),
      update: () => mockQueryBuilder,
      delete: () => mockQueryBuilder
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

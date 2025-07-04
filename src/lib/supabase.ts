
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
  
  const createMockQuery = () => ({
    eq: () => createMockQuery(),
    order: () => createMockQuery(),
    select: () => createMockQuery(),
    single: () => createMockQuery(),
    insert: () => createMockQuery(),
    update: () => createMockQuery(),
    delete: () => createMockQuery(),
    // Remove the then method and make these actual promises
  })

  // Make the final query methods return actual promises
  const createFinalQuery = (data: any = null, error: any = null) => 
    Promise.resolve({ data, error })

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: mockError }),
      signInWithPassword: () => Promise.resolve({ data: null, error: mockError }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: (columns: string) => {
        const query = {
          eq: () => query,
          order: () => query,
          single: () => createFinalQuery(null, mockError)
        }
        return query
      },
      insert: (data: any) => {
        const query = {
          select: () => ({
            single: () => createFinalQuery(null, mockError)
          })
        }
        return query
      },
      update: (data: any) => {
        const query = {
          eq: () => query,
          select: () => ({
            single: () => createFinalQuery(null, mockError)
          })
        }
        return query
      },
      delete: () => {
        const query = {
          eq: () => createFinalQuery(null, null)
        }
        return query
      }
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

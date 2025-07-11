import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'student' | 'admin' | 'super_admin'
          student_id: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'student' | 'admin' | 'super_admin'
          student_id?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
        Update: {
          name?: string
          email?: string
          role?: 'student' | 'admin' | 'super_admin'
          student_id?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
      }
      components: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          specifications: any
          total_quantity: number
          available_quantity: number
          issued_quantity: number
          damaged_quantity: number
          image_url: string | null
          low_stock_threshold: number
          location: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          name: string
          category: string
          description: string
          specifications?: any
          total_quantity?: number
          available_quantity?: number
          issued_quantity?: number
          damaged_quantity?: number
          image_url?: string | null
          low_stock_threshold?: number
          location?: string | null
          created_by?: string | null
        }
        Update: {
          name?: string
          category?: string
          description?: string
          specifications?: any
          total_quantity?: number
          available_quantity?: number
          issued_quantity?: number
          damaged_quantity?: number
          image_url?: string | null
          low_stock_threshold?: number
          location?: string | null
        }
      }
      component_requests: {
        Row: {
          id: string
          user_id: string
          component_id: string
          quantity: number
          purpose: string
          expected_return_date: string
          status: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned'
          request_date: string
          approved_by: string | null
          approved_date: string | null
          issued_date: string | null
          returned_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          component_id: string
          quantity: number
          purpose: string
          expected_return_date: string
          status?: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned'
          approved_by?: string | null
          notes?: string | null
        }
        Update: {
          quantity?: number
          purpose?: string
          expected_return_date?: string
          status?: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned'
          approved_by?: string | null
          approved_date?: string | null
          issued_date?: string | null
          returned_date?: string | null
          notes?: string | null
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          email: string
          phone: string | null
          image_url: string | null
          bio: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          role: string
          email: string
          phone?: string | null
          image_url?: string | null
          bio?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          name?: string
          role?: string
          email?: string
          phone?: string | null
          image_url?: string | null
          bio?: string | null
          is_active?: boolean
          sort_order?: number
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          user_id?: string | null
          type?: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
        }
        Update: {
          is_read?: boolean
        }
      }
    }
  }
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          enrollment_no: string | null
          role: 'student' | 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          enrollment_no?: string | null
          role?: 'student' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          enrollment_no?: string | null
          role?: 'student' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          role: 'student' | 'admin' | 'super_admin'
          student_id: string | null
          phone: string | null
          avatar_url: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: 'student' | 'admin' | 'super_admin'
          student_id?: string | null
          phone?: string | null
          avatar_url?: string | null
          email?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'student' | 'admin' | 'super_admin'
          student_id?: string | null
          phone?: string | null
          avatar_url?: string | null
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      components: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          specifications: Json
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
          id?: string
          name: string
          category: string
          description: string
          specifications?: Json
          total_quantity?: number
          available_quantity?: number
          issued_quantity?: number
          damaged_quantity?: number
          image_url?: string | null
          low_stock_threshold?: number
          location?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          specifications?: Json
          total_quantity?: number
          available_quantity?: number
          issued_quantity?: number
          damaged_quantity?: number
          image_url?: string | null
          low_stock_threshold?: number
          location?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
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
          id?: string
          user_id: string
          component_id: string
          quantity: number
          purpose: string
          expected_return_date: string
          status?: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned'
          request_date?: string
          approved_by?: string | null
          approved_date?: string | null
          issued_date?: string | null
          returned_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          component_id?: string
          quantity?: number
          purpose?: string
          expected_return_date?: string
          status?: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned'
          request_date?: string
          approved_by?: string | null
          approved_date?: string | null
          issued_date?: string | null
          returned_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      component_returns: {
        Row: {
          id: string
          request_id: string
          user_id: string
          component_id: string
          quantity_returned: number
          condition: 'good' | 'damaged' | 'missing'
          return_date: string
          verified_by: string | null
          verified_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          user_id: string
          component_id: string
          quantity_returned: number
          condition?: 'good' | 'damaged' | 'missing'
          return_date?: string
          verified_by?: string | null
          verified_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          user_id?: string
          component_id?: string
          quantity_returned?: number
          condition?: 'good' | 'damaged' | 'missing'
          return_date?: string
          verified_by?: string | null
          verified_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          category: string
          description: string | null
          file_url: string
          file_size: number | null
          file_type: string | null
          uploaded_by: string
          is_public: boolean
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          description?: string | null
          file_url: string
          file_size?: number | null
          file_type?: string | null
          uploaded_by: string
          is_public?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          description?: string | null
          file_url?: string
          file_size?: number | null
          file_type?: string | null
          uploaded_by?: string
          is_public?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
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
          id?: string
          user_id?: string | null
          type?: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'info' | 'success' | 'warning' | 'error'
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
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
          id?: string
          name: string
          role: string
          email: string
          phone?: string | null
          image_url?: string | null
          bio?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          email?: string
          phone?: string | null
          image_url?: string | null
          bio?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'admin' | 'super_admin'
      request_status: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned'
      component_condition: 'good' | 'damaged' | 'missing'
      notification_type: 'info' | 'success' | 'warning' | 'error'
    }
  }
}
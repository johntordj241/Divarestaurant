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
      reservations: {
        Row: {
          id: string
          show_time_id: string
          customer_id: string
          number_of_guests: number
          selected_menu_ids: string[]
          special_requests: string | null
          total_price: number
          payment_status: 'pending' | 'paid' | 'refunded'
          reservation_status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          show_time_id: string
          customer_id: string
          number_of_guests: number
          selected_menu_ids: string[]
          special_requests?: string | null
          total_price: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          reservation_status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          show_time_id?: string
          customer_id?: string
          number_of_guests?: number
          selected_menu_ids?: string[]
          special_requests?: string | null
          total_price?: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          reservation_status?: 'pending' | 'confirmed' | 'cancelled'
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_vegetarian: boolean
          is_gluten_free: boolean
          allergens: string[] | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_vegetarian?: boolean
          is_gluten_free?: boolean
          allergens?: string[] | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_vegetarian?: boolean
          is_gluten_free?: boolean
          allergens?: string[] | null
          available?: boolean
          updated_at?: string
        }
      }
      // Ajoutez les autres tables selon vos besoins
    }
  }
}
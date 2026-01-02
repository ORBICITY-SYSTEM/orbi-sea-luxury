export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      apartment_prices: {
        Row: {
          apartment_type: string
          created_at: string
          description_en: string | null
          description_ka: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean
          max_guests: number
          name_en: string
          name_ka: string
          price_per_night: number
          size_sqm: number | null
          updated_at: string
        }
        Insert: {
          apartment_type: string
          created_at?: string
          description_en?: string | null
          description_ka?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_guests?: number
          name_en: string
          name_ka: string
          price_per_night: number
          size_sqm?: number | null
          updated_at?: string
        }
        Update: {
          apartment_type?: string
          created_at?: string
          description_en?: string | null
          description_ka?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_guests?: number
          name_en?: string
          name_ka?: string
          price_per_night?: number
          size_sqm?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          id: string
          is_approved: boolean | null
          post_slug: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          is_approved?: boolean | null
          post_slug: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          is_approved?: boolean | null
          post_slug?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          apartment_type: string
          check_in: string
          check_out: string
          created_at: string
          discount_amount: number | null
          guest_address: string | null
          guest_email: string | null
          guest_id_number: string | null
          guest_name: string | null
          guest_phone: string | null
          guests: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          promo_code: string | null
          special_requests: string | null
          status: string
          total_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          apartment_type: string
          check_in: string
          check_out: string
          created_at?: string
          discount_amount?: number | null
          guest_address?: string | null
          guest_email?: string | null
          guest_id_number?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          promo_code?: string | null
          special_requests?: string | null
          status?: string
          total_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          apartment_type?: string
          check_in?: string
          check_out?: string
          created_at?: string
          discount_amount?: number | null
          guest_address?: string | null
          guest_email?: string | null
          guest_id_number?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          promo_code?: string | null
          special_requests?: string | null
          status?: string
          total_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          content_en: string | null
          content_ka: string | null
          created_at: string
          id: string
          page: string
          section_key: string
          section_name: string
          section_type: string
          updated_at: string
        }
        Insert: {
          content_en?: string | null
          content_ka?: string | null
          created_at?: string
          id?: string
          page: string
          section_key: string
          section_name: string
          section_type?: string
          updated_at?: string
        }
        Update: {
          content_en?: string | null
          content_ka?: string | null
          created_at?: string
          id?: string
          page?: string
          section_key?: string
          section_name?: string
          section_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiment_assignments: {
        Row: {
          assigned_at: string | null
          experiment_id: string | null
          id: string
          user_id: string
          variant_name: string
        }
        Insert: {
          assigned_at?: string | null
          experiment_id?: string | null
          id?: string
          user_id: string
          variant_name: string
        }
        Update: {
          assigned_at?: string | null
          experiment_id?: string | null
          id?: string
          user_id?: string
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_events: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          event_data: Json | null
          event_name: string
          experiment_id: string | null
          id: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_name: string
          experiment_id?: string | null
          id?: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_name?: string
          experiment_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "experiment_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_events_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          traffic_allocation: number | null
          updated_at: string | null
          variants: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          traffic_allocation?: number | null
          updated_at?: string | null
          variants?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          traffic_allocation?: number | null
          updated_at?: string | null
          variants?: Json
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          points: number
          tier: string
          total_earned: number
          total_redeemed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          tier?: string
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          tier?: string
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          media_type: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          media_type: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          media_type?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          discount_amount: number | null
          discount_percentage: number | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          id: string
          is_active: boolean
          max_uses: number | null
          min_nights: number | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percentage?: number | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_nights?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percentage?: number | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_nights?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean
          keywords: string | null
          og_image: string | null
          page_name: string
          page_path: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          keywords?: string | null
          og_image?: string | null
          page_name: string
          page_path: string
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          keywords?: string | null
          og_image?: string | null
          page_name?: string
          page_path?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_promo_code: {
        Args: { code_input: string }
        Returns: {
          discount_amount: number
          discount_percentage: number
          discount_type: string
          id: string
          is_valid: boolean
          message: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      discount_type: "percentage" | "fixed_amount"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      discount_type: ["percentage", "fixed_amount"],
    },
  },
} as const

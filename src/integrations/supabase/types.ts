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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
          bio: string | null
          phone: string | null
          location: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          travel_style: string | null
          interests: string[] | null
          accommodation_pref: string | null
          transport_pref: string | null
          travel_pace: string | null
          currency: string | null
          auto_conversion: boolean | null
          daily_budget_limit: number | null
          budget_alerts: boolean | null
          smart_budget: boolean | null
          trip_reminders: boolean | null
          daily_itinerary_alerts: boolean | null
          overrun_alerts: boolean | null
          collab_updates: boolean | null
          notification_channel: string | null
          default_trip_visibility: string | null
          allow_copy: boolean | null
          show_budget_shared: boolean | null
          profile_visibility: string | null
          blocked_users: string[] | null
          default_collab_permission: string | null
          enable_comments: boolean | null
          invite_approval: boolean | null
          app_language: string | null
          date_format: string | null
          time_format: string | null
          distance_units: string | null
          theme: string | null
          font_size: string | null
          high_contrast: boolean | null
          reduce_animations: boolean | null
          screen_reader: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          travel_style?: string | null
          interests?: string[] | null
          accommodation_pref?: string | null
          transport_pref?: string | null
          travel_pace?: string | null
          currency?: string | null
          auto_conversion?: boolean | null
          daily_budget_limit?: number | null
          budget_alerts?: boolean | null
          smart_budget?: boolean | null
          trip_reminders?: boolean | null
          daily_itinerary_alerts?: boolean | null
          overrun_alerts?: boolean | null
          collab_updates?: boolean | null
          notification_channel?: string | null
          default_trip_visibility?: string | null
          allow_copy?: boolean | null
          show_budget_shared?: boolean | null
          profile_visibility?: string | null
          blocked_users?: string[] | null
          default_collab_permission?: string | null
          enable_comments?: boolean | null
          invite_approval?: boolean | null
          app_language?: string | null
          date_format?: string | null
          time_format?: string | null
          distance_units?: string | null
          theme?: string | null
          font_size?: string | null
          high_contrast?: boolean | null
          reduce_animations?: boolean | null
          screen_reader?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          travel_style?: string | null
          interests?: string[] | null
          accommodation_pref?: string | null
          transport_pref?: string | null
          travel_pace?: string | null
          currency?: string | null
          auto_conversion?: boolean | null
          daily_budget_limit?: number | null
          budget_alerts?: boolean | null
          smart_budget?: boolean | null
          trip_reminders?: boolean | null
          daily_itinerary_alerts?: boolean | null
          overrun_alerts?: boolean | null
          collab_updates?: boolean | null
          notification_channel?: string | null
          default_trip_visibility?: string | null
          allow_copy?: boolean | null
          show_budget_shared?: boolean | null
          profile_visibility?: string | null
          blocked_users?: string[] | null
          default_collab_permission?: string | null
          enable_comments?: boolean | null
          invite_approval?: boolean | null
          app_language?: string | null
          date_format?: string | null
          time_format?: string | null
          distance_units?: string | null
          theme?: string | null
          font_size?: string | null
          high_contrast?: boolean | null
          reduce_animations?: boolean | null
          screen_reader?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          channel: string
          title: string
          content: string
          image_url: string | null
          likes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          channel: string
          title: string
          content: string
          image_url?: string | null
          likes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          channel?: string
          title?: string
          content?: string
          image_url?: string | null
          likes?: number
          created_at?: string
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

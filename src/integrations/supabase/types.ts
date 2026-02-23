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
      capture_media: {
        Row: {
          capture_request_id: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          step: string
          submission_id: string | null
          uploaded_at: string
        }
        Insert: {
          capture_request_id: string
          file_path: string
          file_size?: number
          file_type: string
          id?: string
          step: string
          submission_id?: string | null
          uploaded_at?: string
        }
        Update: {
          capture_request_id?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          step?: string
          submission_id?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capture_media_capture_request_id_fkey"
            columns: ["capture_request_id"]
            isOneToOne: false
            referencedRelation: "capture_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capture_media_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "capture_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      capture_notes: {
        Row: {
          capture_request_id: string
          created_at: string
          id: string
          note_text: string
        }
        Insert: {
          capture_request_id: string
          created_at?: string
          id?: string
          note_text: string
        }
        Update: {
          capture_request_id?: string
          created_at?: string
          id?: string
          note_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "capture_notes_capture_request_id_fkey"
            columns: ["capture_request_id"]
            isOneToOne: false
            referencedRelation: "capture_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      capture_requests: {
        Row: {
          created_at: string
          dealer_email: string | null
          dealer_name: string | null
          expires_at: string
          id: string
          internal_notes: string | null
          required_steps: Json
          seller_email: string | null
          seller_name: string
          seller_phone: string | null
          status: Database["public"]["Enums"]["capture_status"]
          token: string
          vehicle_registration: string | null
          vehicle_vin: string | null
        }
        Insert: {
          created_at?: string
          dealer_email?: string | null
          dealer_name?: string | null
          expires_at: string
          id?: string
          internal_notes?: string | null
          required_steps?: Json
          seller_email?: string | null
          seller_name: string
          seller_phone?: string | null
          status?: Database["public"]["Enums"]["capture_status"]
          token?: string
          vehicle_registration?: string | null
          vehicle_vin?: string | null
        }
        Update: {
          created_at?: string
          dealer_email?: string | null
          dealer_name?: string | null
          expires_at?: string
          id?: string
          internal_notes?: string | null
          required_steps?: Json
          seller_email?: string | null
          seller_name?: string
          seller_phone?: string | null
          status?: Database["public"]["Enums"]["capture_status"]
          token?: string
          vehicle_registration?: string | null
          vehicle_vin?: string | null
        }
        Relationships: []
      }
      capture_status_log: {
        Row: {
          capture_request_id: string
          changed_at: string
          id: string
          new_status: Database["public"]["Enums"]["capture_status"]
          old_status: Database["public"]["Enums"]["capture_status"] | null
        }
        Insert: {
          capture_request_id: string
          changed_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["capture_status"]
          old_status?: Database["public"]["Enums"]["capture_status"] | null
        }
        Update: {
          capture_request_id?: string
          changed_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["capture_status"]
          old_status?: Database["public"]["Enums"]["capture_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "capture_status_log_capture_request_id_fkey"
            columns: ["capture_request_id"]
            isOneToOne: false
            referencedRelation: "capture_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      capture_submissions: {
        Row: {
          capture_request_id: string
          declaration_confirmed: boolean
          declaration_name: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          no_damage_confirmed: boolean
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          capture_request_id: string
          declaration_confirmed?: boolean
          declaration_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          no_damage_confirmed?: boolean
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          capture_request_id?: string
          declaration_confirmed?: boolean
          declaration_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          no_damage_confirmed?: boolean
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capture_submissions_capture_request_id_fkey"
            columns: ["capture_request_id"]
            isOneToOne: false
            referencedRelation: "capture_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      capture_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "expired"
        | "archived"
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
      capture_status: [
        "pending",
        "in_progress",
        "completed",
        "expired",
        "archived",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      expense_categories: {
        Row: {
          created_at: string
          home_id: string
          id: string
          name: string
          parent: string | null
        }
        Insert: {
          created_at?: string
          home_id: string
          id?: string
          name: string
          parent?: string | null
        }
        Update: {
          created_at?: string
          home_id?: string
          id?: string
          name?: string
          parent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_categories_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_grouped: {
        Row: {
          amount: number
          article_id: string
          created_at: string
          group_id: string
          home_id: string
          id: string
          quantity: number
        }
        Insert: {
          amount: number
          article_id: string
          created_at?: string
          group_id: string
          home_id: string
          id?: string
          quantity?: number
        }
        Update: {
          amount?: number
          article_id?: string
          created_at?: string
          group_id?: string
          home_id?: string
          id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "expense_grouped_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "expense_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_grouped_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "expense_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_grouped_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_groups: {
        Row: {
          count: number
          created_at: string
          date: string
          description: string | null
          home_id: string
          id: string
          name: string
          total: number
        }
        Insert: {
          count?: number
          created_at?: string
          date: string
          description?: string | null
          home_id: string
          id?: string
          name: string
          total: number
        }
        Update: {
          count?: number
          created_at?: string
          date?: string
          description?: string | null
          home_id?: string
          id?: string
          name?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "expense_groups_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_groups_categories: {
        Row: {
          category_id: string
          group_id: string
          home_id: string
        }
        Insert: {
          category_id: string
          group_id: string
          home_id: string
        }
        Update: {
          category_id?: string
          group_id?: string
          home_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_groups_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_groups_categories_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "expense_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_groups_categories_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_items: {
        Row: {
          category_id: string
          created_at: string
          home_id: string
          id: string
          name: string
          unit: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          home_id?: string
          id?: string
          name: string
          unit?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          home_id?: string
          id?: string
          name?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          article_id: string
          category_id: string | null
          created_at: string
          date: string
          description: string | null
          home_id: string
          id: string
          quantity: number
        }
        Insert: {
          amount: number
          article_id: string
          category_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          home_id: string
          id?: string
          quantity: number
        }
        Update: {
          amount?: number
          article_id?: string
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          home_id?: string
          id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "expenses_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "expense_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      homes: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["Currency"]
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          currency: Database["public"]["Enums"]["Currency"]
          id?: string
          name: string
          owner_id?: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["Currency"]
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          auth_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          auth_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_expense_group_with_items: {
        Args: {
          p_categories: string[]
          p_date?: string
          p_description?: string
          p_items?: Database["public"]["CompositeTypes"]["expense_group_item"][]
          p_name: string
        }
        Returns: string
      }
      get_request_home: { Args: never; Returns: string }
      update_expense_group_with_items: {
        Args: {
          p_description?: string
          p_id: string
          p_name?: string
          p_new_categories?: string[]
          p_new_items?: Database["public"]["CompositeTypes"]["expense_group_item"][]
          p_old_categories?: string[]
          p_old_items?: string[]
          p_update_items?: Database["public"]["CompositeTypes"]["update_exp_groupd_item"][]
        }
        Returns: string
      }
    }
    Enums: {
      Currency: "MGA" | "EUR" | "USD"
    }
    CompositeTypes: {
      expense_group_item: {
        article_id: string | null
        amount: number | null
        quantity: number | null
      }
      update_exp_groupd_item: {
        id: string | null
        amount: number | null
        quantity: number | null
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      Currency: ["MGA", "EUR", "USD"],
    },
  },
} as const


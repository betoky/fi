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
          id: number
          name: string
          parent: number | null
        }
        Insert: {
          created_at?: string
          home_id: string
          id?: number
          name: string
          parent?: number | null
        }
        Update: {
          created_at?: string
          home_id?: string
          id?: number
          name?: string
          parent?: number | null
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
      expense_details: {
        Row: {
          amount: number
          article_id: number
          expense_id: number
          home_id: string
          id: number
          quantity: number
        }
        Insert: {
          amount: number
          article_id: number
          expense_id: number
          home_id: string
          id?: number
          quantity?: number
        }
        Update: {
          amount?: number
          article_id?: number
          expense_id?: number
          home_id?: string
          id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "expense_details_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "expense_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_details_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_details_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_items: {
        Row: {
          category_id: number
          created_at: string
          home_id: string
          id: number
          name: string
          unit: string | null
        }
        Insert: {
          category_id: number
          created_at?: string
          home_id: string
          id?: number
          name: string
          unit?: string | null
        }
        Update: {
          category_id?: number
          created_at?: string
          home_id?: string
          id?: number
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
          as_group: boolean
          count: number
          created_at: string
          date: string
          description: string | null
          home_id: string
          id: number
          name: string
        }
        Insert: {
          amount: number
          as_group?: boolean
          count?: number
          created_at?: string
          date: string
          description?: string | null
          home_id: string
          id?: number
          name: string
        }
        Update: {
          amount?: number
          as_group?: boolean
          count?: number
          created_at?: string
          date?: string
          description?: string | null
          home_id?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses_categories: {
        Row: {
          category_id: number
          expense_id: number
          home_id: string
          id: number
        }
        Insert: {
          category_id: number
          expense_id: number
          home_id: string
          id?: number
        }
        Update: {
          category_id?: number
          expense_id?: number
          home_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "expenses_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_categories_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_categories_home_id_fkey"
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
          owner_id: string
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
      get_categories: {
        Args: never
        Returns: {
          created_at: string
          home_id: string
          id: number
          name: string
          parent: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "expense_categories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_request_home: { Args: never; Returns: string }
      save_expenses: {
        Args: {
          p_date?: string
          p_description?: string
          p_items: Database["public"]["CompositeTypes"]["exp_input_item"][]
        }
        Returns: undefined
      }
      save_expenses_as_group: {
        Args: {
          p_date?: string
          p_description?: string
          p_items: Database["public"]["CompositeTypes"]["exp_input_item"][]
          p_name: string
        }
        Returns: number
      }
    }
    Enums: {
      Currency: "MGA" | "EUR" | "USD"
    }
    CompositeTypes: {
      exp_input_item: {
        article_id: number | null
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


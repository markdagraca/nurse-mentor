export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analysis: {
        Row: {
          adultContent: boolean
          analysis: string | null
          created_at: string
          id: string
          keywords: string
          slug: string
          title: string | null
          views: number
        }
        Insert: {
          adultContent?: boolean
          analysis?: string | null
          created_at?: string
          id?: string
          keywords?: string
          slug?: string
          title?: string | null
          views?: number
        }
        Update: {
          adultContent?: boolean
          analysis?: string | null
          created_at?: string
          id?: string
          keywords?: string
          slug?: string
          title?: string | null
          views?: number
        }
        Relationships: []
      }
      analysisViews: {
        Row: {
          analysisID: string | null
          created_at: string
          id: number
        }
        Insert: {
          analysisID?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          analysisID?: string | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "analysisViews_analysisID_fkey"
            columns: ["analysisID"]
            isOneToOne: false
            referencedRelation: "analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysisViews_analysisID_fkey"
            columns: ["analysisID"]
            isOneToOne: false
            referencedRelation: "most_popular_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          answer: string | null
          created_at: string
          id: number
          insertedAt: string | null
          question: string | null
          threadID: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: number
          insertedAt?: string | null
          question?: string | null
          threadID?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: number
          insertedAt?: string | null
          question?: string | null
          threadID?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          browser: string
          created_at: string
          email: string
          feedback: string
          id: string
          source: string
        }
        Insert: {
          browser?: string
          created_at?: string
          email?: string
          feedback?: string
          id?: string
          source?: string
        }
        Update: {
          browser?: string
          created_at?: string
          email?: string
          feedback?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      nurse_mentor_lessons: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      productRedirect: {
        Row: {
          created_at: string
          id: number
          productID: string
        }
        Insert: {
          created_at?: string
          id?: number
          productID: string
        }
        Update: {
          created_at?: string
          id?: number
          productID?: string
        }
        Relationships: [
          {
            foreignKeyName: "productViews_productID_fkey"
            columns: ["productID"]
            isOneToOne: false
            referencedRelation: "most_popular_analysis"
            referencedColumns: ["topProductID"]
          },
          {
            foreignKeyName: "productViews_productID_fkey"
            columns: ["productID"]
            isOneToOne: false
            referencedRelation: "productResults"
            referencedColumns: ["productID"]
          },
        ]
      }
      productResults: {
        Row: {
          amazonItem: boolean
          analysisID: string | null
          avgPrice: number | null
          avgRating: number | null
          bestFor: string | null
          cons: string | null
          description: string | null
          insertDate: string | null
          manufacturer: string | null
          model: string | null
          name: string | null
          notes: string | null
          productID: string
          productImageURL: string
          pros: string | null
          ranking: number | null
          threadID: string | null
          views: number
        }
        Insert: {
          amazonItem?: boolean
          analysisID?: string | null
          avgPrice?: number | null
          avgRating?: number | null
          bestFor?: string | null
          cons?: string | null
          description?: string | null
          insertDate?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string | null
          notes?: string | null
          productID?: string
          productImageURL?: string
          pros?: string | null
          ranking?: number | null
          threadID?: string | null
          views?: number
        }
        Update: {
          amazonItem?: boolean
          analysisID?: string | null
          avgPrice?: number | null
          avgRating?: number | null
          bestFor?: string | null
          cons?: string | null
          description?: string | null
          insertDate?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string | null
          notes?: string | null
          productID?: string
          productImageURL?: string
          pros?: string | null
          ranking?: number | null
          threadID?: string | null
          views?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          createdAt: string | null
          options: string | null
          question: string | null
          threadID: string | null
          type: string | null
        }
        Insert: {
          createdAt?: string | null
          options?: string | null
          question?: string | null
          threadID?: string | null
          type?: string | null
        }
        Update: {
          createdAt?: string | null
          options?: string | null
          question?: string | null
          threadID?: string | null
          type?: string | null
        }
        Relationships: []
      }
      SearchQuery: {
        Row: {
          created_at: string
          question: string | null
          threadID: string
        }
        Insert: {
          created_at?: string
          question?: string | null
          threadID: string
        }
        Update: {
          created_at?: string
          question?: string | null
          threadID?: string
        }
        Relationships: []
      }
    }
    Views: {
      most_popular_analysis: {
        Row: {
          adultContent: boolean | null
          analysis: string | null
          created_at: string | null
          dailyviews: number | null
          id: string | null
          keywords: string | null
          title: string | null
          topProductAmazonItem: boolean | null
          topProductAvgPrice: number | null
          topProductAvgRating: number | null
          topProductCons: string | null
          topProductDescription: string | null
          topProductID: string | null
          topProductImageURL: string | null
          topProductInsertDate: string | null
          topProductManufacturer: string | null
          topProductModel: string | null
          topProductName: string | null
          topProductNotes: string | null
          topProductPros: string | null
          topProductThreadID: string | null
          topProductViews: number | null
          views: number | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

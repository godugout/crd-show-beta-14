export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          permission_name: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          permission_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          permission_name?: string
        }
        Relationships: []
      }
      admin_role_permissions: {
        Row: {
          granted_at: string | null
          id: string
          permission_id: string | null
          role: string
        }
        Insert: {
          granted_at?: string | null
          id?: string
          permission_id?: string | null
          role: string
        }
        Update: {
          granted_at?: string | null
          id?: string
          permission_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "admin_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          amount: number
          auction_id: string | null
          bid_time: string | null
          bid_type: string | null
          bidder_id: string | null
          created_at: string | null
          id: string
          is_winning_bid: boolean | null
          proxy_max_amount: number | null
        }
        Insert: {
          amount: number
          auction_id?: string | null
          bid_time?: string | null
          bid_type?: string | null
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_winning_bid?: boolean | null
          proxy_max_amount?: number | null
        }
        Update: {
          amount?: number
          auction_id?: string | null
          bid_time?: string | null
          bid_type?: string | null
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_winning_bid?: boolean | null
          proxy_max_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          automated_action: boolean | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          risk_score: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          automated_action?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          automated_action?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      beta_feedback: {
        Row: {
          actual_behavior: string | null
          browser_info: Json | null
          category: string
          created_at: string | null
          description: string
          expected_behavior: string | null
          feedback_type: string
          id: string
          priority: string
          status: string
          steps_to_reproduce: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          user_rating: number | null
        }
        Insert: {
          actual_behavior?: string | null
          browser_info?: Json | null
          category?: string
          created_at?: string | null
          description: string
          expected_behavior?: string | null
          feedback_type: string
          id?: string
          priority?: string
          status?: string
          steps_to_reproduce?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          user_rating?: number | null
        }
        Update: {
          actual_behavior?: string | null
          browser_info?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          expected_behavior?: string | null
          feedback_type?: string
          id?: string
          priority?: string
          status?: string
          steps_to_reproduce?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          user_rating?: number | null
        }
        Relationships: []
      }
      bi_reports: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_run_at: string | null
          name: string
          next_run_at: string | null
          report_type: string
          schedule: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          report_type: string
          schedule?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          report_type?: string
          schedule?: string | null
        }
        Relationships: []
      }
      brand_usage_stats: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          last_used_at: string
          updated_at: string
          usage_context: string | null
          usage_count: number
          user_id: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          last_used_at?: string
          updated_at?: string
          usage_context?: string | null
          usage_count?: number
          user_id?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          last_used_at?: string
          updated_at?: string
          usage_context?: string | null
          usage_count?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_usage_stats_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "cardshow_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      branding_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      card_favorites: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_favorites_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_likes: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      card_recommendations: {
        Row: {
          card_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          recommendation_score: number | null
          recommendation_type: string | null
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          recommendation_score?: number | null
          recommendation_type?: string | null
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          recommendation_score?: number | null
          recommendation_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_recommendations_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_sets: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_published: boolean | null
          metadata: Json | null
          name: string
          price: number | null
          release_date: string | null
          royalty_percentage: number | null
          total_cards: number | null
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          name: string
          price?: number | null
          release_date?: string | null
          royalty_percentage?: number | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          name?: string
          price?: number | null
          release_date?: string | null
          royalty_percentage?: number | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_sets_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_templates: {
        Row: {
          ai_analysis: Json | null
          category: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          fabric_data: Json | null
          id: string
          is_premium: boolean | null
          is_public: boolean | null
          layers: Json | null
          name: string
          parameters: Json | null
          preview_url: string | null
          source_file_url: string | null
          source_type: string | null
          template_data: Json
          usage_count: number | null
        }
        Insert: {
          ai_analysis?: Json | null
          category: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          fabric_data?: Json | null
          id?: string
          is_premium?: boolean | null
          is_public?: boolean | null
          layers?: Json | null
          name: string
          parameters?: Json | null
          preview_url?: string | null
          source_file_url?: string | null
          source_type?: string | null
          template_data: Json
          usage_count?: number | null
        }
        Update: {
          ai_analysis?: Json | null
          category?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          fabric_data?: Json | null
          id?: string
          is_premium?: boolean | null
          is_public?: boolean | null
          layers?: Json | null
          name?: string
          parameters?: Json | null
          preview_url?: string | null
          source_file_url?: string | null
          source_type?: string | null
          template_data?: Json
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "card_templates_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_templates_creator: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_published: boolean | null
          license_type: string | null
          name: string
          preview_images: string[] | null
          price: number
          rating: number | null
          revenue_generated: number | null
          sales_count: number | null
          tags: string[] | null
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          license_type?: string | null
          name: string
          preview_images?: string[] | null
          price?: number
          rating?: number | null
          revenue_generated?: number | null
          sales_count?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          license_type?: string | null
          name?: string
          preview_images?: string[] | null
          price?: number
          rating?: number | null
          revenue_generated?: number | null
          sales_count?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_templates_creator_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          abilities: string[] | null
          base_price: number | null
          card_set_id: string | null
          card_type: Database["public"]["Enums"]["card_type"] | null
          collection_id: string | null
          completed_at: string | null
          crd_catalog_inclusion: boolean | null
          created_at: string | null
          creator_id: string
          current_market_value: number | null
          current_supply: number | null
          description: string | null
          design_metadata: Json | null
          edition_number: number | null
          favorite_count: number | null
          id: string
          image_locked: boolean | null
          image_url: string | null
          is_public: boolean | null
          is_tradeable: boolean | null
          locked_image_url: string | null
          mana_cost: Json | null
          marketplace_listing: boolean | null
          minting_metadata: Json | null
          minting_status: string | null
          name: string | null
          power: number | null
          price: number | null
          print_available: boolean | null
          print_metadata: Json | null
          rarity: Database["public"]["Enums"]["card_rarity"] | null
          royalty_percentage: number | null
          serial_number: number | null
          series: string | null
          series_one_number: number | null
          set_id: string | null
          tags: string[] | null
          team_id: string | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          total_supply: number | null
          toughness: number | null
          updated_at: string | null
          verification_status: string | null
          view_count: number | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          abilities?: string[] | null
          base_price?: number | null
          card_set_id?: string | null
          card_type?: Database["public"]["Enums"]["card_type"] | null
          collection_id?: string | null
          completed_at?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string | null
          creator_id: string
          current_market_value?: number | null
          current_supply?: number | null
          description?: string | null
          design_metadata?: Json | null
          edition_number?: number | null
          favorite_count?: number | null
          id?: string
          image_locked?: boolean | null
          image_url?: string | null
          is_public?: boolean | null
          is_tradeable?: boolean | null
          locked_image_url?: string | null
          mana_cost?: Json | null
          marketplace_listing?: boolean | null
          minting_metadata?: Json | null
          minting_status?: string | null
          name?: string | null
          power?: number | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          rarity?: Database["public"]["Enums"]["card_rarity"] | null
          royalty_percentage?: number | null
          serial_number?: number | null
          series?: string | null
          series_one_number?: number | null
          set_id?: string | null
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          total_supply?: number | null
          toughness?: number | null
          updated_at?: string | null
          verification_status?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          abilities?: string[] | null
          base_price?: number | null
          card_set_id?: string | null
          card_type?: Database["public"]["Enums"]["card_type"] | null
          collection_id?: string | null
          completed_at?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string | null
          creator_id?: string
          current_market_value?: number | null
          current_supply?: number | null
          description?: string | null
          design_metadata?: Json | null
          edition_number?: number | null
          favorite_count?: number | null
          id?: string
          image_locked?: boolean | null
          image_url?: string | null
          is_public?: boolean | null
          is_tradeable?: boolean | null
          locked_image_url?: string | null
          mana_cost?: Json | null
          marketplace_listing?: boolean | null
          minting_metadata?: Json | null
          minting_status?: string | null
          name?: string | null
          power?: number | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          rarity?: Database["public"]["Enums"]["card_rarity"] | null
          royalty_percentage?: number | null
          serial_number?: number | null
          series?: string | null
          series_one_number?: number | null
          set_id?: string | null
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          total_supply?: number | null
          toughness?: number | null
          updated_at?: string | null
          verification_status?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_card_set_id_fkey"
            columns: ["card_set_id"]
            isOneToOne: false
            referencedRelation: "card_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "sets"
            referencedColumns: ["id"]
          },
        ]
      }
      cardshow_brands: {
        Row: {
          category: string
          collectibility_score: number
          color_palette: string[] | null
          created_at: string
          created_by: string | null
          current_supply: number
          decade: string | null
          description: string | null
          design_elements: string[] | null
          display_name: string
          dna_code: string
          drop_rate: number
          file_name: string
          file_size: number | null
          font_style: string
          founded_year: number | null
          group_type: string | null
          id: string
          image_dimensions: Json | null
          image_url: string
          is_active: boolean
          is_blendable: boolean
          is_remixable: boolean
          league: string | null
          logo_theme: Json | null
          mascot: string | null
          notes: string | null
          power_level: number
          primary_color: string
          product_name: string | null
          quaternary_color: string | null
          rarity: string
          secondary_color: string
          sort_order: number
          style_tags: string[] | null
          team_city: string | null
          team_code: string | null
          team_name: string | null
          tertiary_color: string | null
          theme_usage: Json | null
          thumbnail_url: string | null
          total_supply: number | null
          unlock_method: string
          updated_at: string
        }
        Insert: {
          category: string
          collectibility_score?: number
          color_palette?: string[] | null
          created_at?: string
          created_by?: string | null
          current_supply?: number
          decade?: string | null
          description?: string | null
          design_elements?: string[] | null
          display_name: string
          dna_code: string
          drop_rate?: number
          file_name: string
          file_size?: number | null
          font_style?: string
          founded_year?: number | null
          group_type?: string | null
          id?: string
          image_dimensions?: Json | null
          image_url: string
          is_active?: boolean
          is_blendable?: boolean
          is_remixable?: boolean
          league?: string | null
          logo_theme?: Json | null
          mascot?: string | null
          notes?: string | null
          power_level?: number
          primary_color: string
          product_name?: string | null
          quaternary_color?: string | null
          rarity?: string
          secondary_color: string
          sort_order?: number
          style_tags?: string[] | null
          team_city?: string | null
          team_code?: string | null
          team_name?: string | null
          tertiary_color?: string | null
          theme_usage?: Json | null
          thumbnail_url?: string | null
          total_supply?: number | null
          unlock_method?: string
          updated_at?: string
        }
        Update: {
          category?: string
          collectibility_score?: number
          color_palette?: string[] | null
          created_at?: string
          created_by?: string | null
          current_supply?: number
          decade?: string | null
          description?: string | null
          design_elements?: string[] | null
          display_name?: string
          dna_code?: string
          drop_rate?: number
          file_name?: string
          file_size?: number | null
          font_style?: string
          founded_year?: number | null
          group_type?: string | null
          id?: string
          image_dimensions?: Json | null
          image_url?: string
          is_active?: boolean
          is_blendable?: boolean
          is_remixable?: boolean
          league?: string | null
          logo_theme?: Json | null
          mascot?: string | null
          notes?: string | null
          power_level?: number
          primary_color?: string
          product_name?: string | null
          quaternary_color?: string | null
          rarity?: string
          secondary_color?: string
          sort_order?: number
          style_tags?: string[] | null
          team_city?: string | null
          team_code?: string | null
          team_name?: string | null
          tertiary_color?: string | null
          theme_usage?: Json | null
          thumbnail_url?: string | null
          total_supply?: number | null
          unlock_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      challenge_participations: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          ranking: number | null
          score: number | null
          submission_data: Json | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          ranking?: number | null
          score?: number | null
          submission_data?: Json | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          ranking?: number | null
          score?: number | null
          submission_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_submissions: {
        Row: {
          card_id: string | null
          challenge_id: string | null
          creator_id: string | null
          feedback: string | null
          id: string
          is_winner: boolean | null
          prize_amount: number | null
          ranking: number | null
          score: number | null
          submission_description: string | null
          submission_title: string | null
          submitted_at: string | null
        }
        Insert: {
          card_id?: string | null
          challenge_id?: string | null
          creator_id?: string | null
          feedback?: string | null
          id?: string
          is_winner?: boolean | null
          prize_amount?: number | null
          ranking?: number | null
          score?: number | null
          submission_description?: string | null
          submission_title?: string | null
          submitted_at?: string | null
        }
        Update: {
          card_id?: string | null
          challenge_id?: string | null
          creator_id?: string | null
          feedback?: string | null
          id?: string
          is_winner?: boolean | null
          prize_amount?: number | null
          ranking?: number | null
          score?: number | null
          submission_description?: string | null
          submission_title?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "creator_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          area_codes: string[] | null
          city_code: string
          city_name: string
          coordinates: unknown | null
          country: string
          created_at: string | null
          cuisine: string[] | null
          established_year: number | null
          id: string
          landmarks: string[] | null
          nicknames: string[] | null
          region: string | null
          state_code: string | null
          state_province: string | null
          updated_at: string | null
        }
        Insert: {
          area_codes?: string[] | null
          city_code: string
          city_name: string
          coordinates?: unknown | null
          country?: string
          created_at?: string | null
          cuisine?: string[] | null
          established_year?: number | null
          id?: string
          landmarks?: string[] | null
          nicknames?: string[] | null
          region?: string | null
          state_code?: string | null
          state_province?: string | null
          updated_at?: string | null
        }
        Update: {
          area_codes?: string[] | null
          city_code?: string
          city_name?: string
          coordinates?: unknown | null
          country?: string
          created_at?: string | null
          cuisine?: string[] | null
          established_year?: number | null
          id?: string
          landmarks?: string[] | null
          nicknames?: string[] | null
          region?: string | null
          state_code?: string | null
          state_province?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collaboration_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          layer_id: string | null
          position: Json | null
          project_id: string
          replies: Json
          resolved: boolean
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          layer_id?: string | null
          position?: Json | null
          project_id: string
          replies?: Json
          resolved?: boolean
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          layer_id?: string | null
          position?: Json | null
          project_id?: string
          replies?: Json
          resolved?: boolean
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "design_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_activity_log: {
        Row: {
          action: string
          collection_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          collection_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          collection_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_activity_log_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_cards: {
        Row: {
          added_at: string | null
          added_by: string | null
          card_id: string
          collection_id: string
          display_order: number | null
          id: string
          notes: string | null
          quantity: number | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          card_id: string
          collection_id: string
          display_order?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          card_id?: string
          collection_id?: string
          display_order?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_followers: {
        Row: {
          collection_id: string
          followed_at: string | null
          follower_id: string
          id: string
          notification_settings: Json | null
        }
        Insert: {
          collection_id: string
          followed_at?: string | null
          follower_id: string
          id?: string
          notification_settings?: Json | null
        }
        Update: {
          collection_id?: string
          followed_at?: string | null
          follower_id?: string
          id?: string
          notification_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_followers_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_memberships: {
        Row: {
          can_view_member_cards: boolean | null
          collection_id: string
          id: string
          invited_by: string | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          can_view_member_cards?: boolean | null
          collection_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          can_view_member_cards?: boolean | null
          collection_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_memberships_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_ratings: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          rating: number | null
          review: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_ratings_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_templates: {
        Row: {
          card_filters: Json | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_hash: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          card_filters?: Json | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_hash: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          card_filters?: Json | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_hash?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          allow_member_card_sharing: boolean | null
          card_count: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          featured_card_id: string | null
          group_code: string | null
          id: string
          is_featured: boolean | null
          is_group: boolean | null
          metadata: Json | null
          name: string | null
          share_token: string | null
          template_id: string | null
          theme: string | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          allow_member_card_sharing?: boolean | null
          card_count?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          featured_card_id?: string | null
          group_code?: string | null
          id?: string
          is_featured?: boolean | null
          is_group?: boolean | null
          metadata?: Json | null
          name?: string | null
          share_token?: string | null
          template_id?: string | null
          theme?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          allow_member_card_sharing?: boolean | null
          card_count?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          featured_card_id?: string | null
          group_code?: string | null
          id?: string
          is_featured?: boolean | null
          is_group?: boolean | null
          metadata?: Json | null
          name?: string | null
          share_token?: string | null
          template_id?: string | null
          theme?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_featured_card_id_fkey"
            columns: ["featured_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_owner_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "collection_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      color_schemes: {
        Row: {
          accent_color: string | null
          color_code: string
          color_names: string[]
          combo_name: string | null
          contrast: string | null
          created_at: string | null
          id: string
          pattern: string | null
          primary_color: string
          secondary_color: string
          tertiary_color: string | null
        }
        Insert: {
          accent_color?: string | null
          color_code: string
          color_names: string[]
          combo_name?: string | null
          contrast?: string | null
          created_at?: string | null
          id?: string
          pattern?: string | null
          primary_color: string
          secondary_color: string
          tertiary_color?: string | null
        }
        Update: {
          accent_color?: string | null
          color_code?: string
          color_names?: string[]
          combo_name?: string | null
          contrast?: string | null
          created_at?: string | null
          id?: string
          pattern?: string | null
          primary_color?: string
          secondary_color?: string
          tertiary_color?: string | null
        }
        Relationships: []
      }
      color_themes: {
        Row: {
          accent_color: string
          created_at: string | null
          id: string
          name: string
          primary_color: string
          primary_example_team: string
          secondary_color: string
          text_color: string
          updated_at: string | null
        }
        Insert: {
          accent_color: string
          created_at?: string | null
          id?: string
          name: string
          primary_color: string
          primary_example_team: string
          secondary_color: string
          text_color?: string
          updated_at?: string | null
        }
        Update: {
          accent_color?: string
          created_at?: string | null
          id?: string
          name?: string
          primary_color?: string
          primary_example_team?: string
          secondary_color?: string
          text_color?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          card_id: string | null
          collection_id: string | null
          content: string
          created_at: string | null
          id: string
          is_edited: boolean | null
          memory_id: string | null
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          card_id?: string | null
          collection_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          memory_id?: string | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          card_id?: string | null
          collection_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          memory_id?: string | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          entry_requirements: Json | null
          id: string
          max_participants: number | null
          participant_count: number | null
          prize_pool: number | null
          rules: Json | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          entry_requirements?: Json | null
          id?: string
          max_participants?: number | null
          participant_count?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          entry_requirements?: Json | null
          id?: string
          max_participants?: number | null
          participant_count?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_moderation: {
        Row: {
          automated_checks: Json | null
          community_votes: Json | null
          confidence_score: number | null
          content_id: string
          content_type: string
          created_at: string | null
          flags: Json | null
          id: string
          moderation_type: string
          review_notes: string | null
          reviewer_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          automated_checks?: Json | null
          community_votes?: Json | null
          confidence_score?: number | null
          content_id: string
          content_type: string
          created_at?: string | null
          flags?: Json | null
          id?: string
          moderation_type: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          automated_checks?: Json | null
          community_votes?: Json | null
          confidence_score?: number | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          flags?: Json | null
          id?: string
          moderation_type?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_moderation_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_moderation_queue: {
        Row: {
          ai_flags: Json | null
          assigned_to: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          moderator_notes: string | null
          priority: string | null
          reported_by: string | null
          resolution_reason: string | null
          resolved_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_flags?: Json | null
          assigned_to?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          moderator_notes?: string | null
          priority?: string | null
          reported_by?: string | null
          resolution_reason?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_flags?: Json | null
          assigned_to?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          moderator_notes?: string | null
          priority?: string | null
          reported_by?: string | null
          resolution_reason?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          certificate_issued: boolean | null
          completed_at: string | null
          course_id: string | null
          creator_id: string | null
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          rating: number | null
          review: string | null
        }
        Insert: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          creator_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
        }
        Update: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          creator_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "creator_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_elements: {
        Row: {
          asset_urls: Json | null
          category: string | null
          config: Json
          created_at: string | null
          creator_id: string | null
          description: string | null
          download_count: number | null
          element_type: string
          id: string
          is_free: boolean | null
          is_public: boolean | null
          name: string
          preview_image_url: string | null
          price_cents: number | null
          rating_average: number | null
          rating_count: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          asset_urls?: Json | null
          category?: string | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          element_type: string
          id?: string
          is_free?: boolean | null
          is_public?: boolean | null
          name: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          asset_urls?: Json | null
          category?: string | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          element_type?: string
          id?: string
          is_free?: boolean | null
          is_public?: boolean | null
          name?: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crd_frames: {
        Row: {
          category: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          download_count: number | null
          frame_config: Json
          id: string
          included_elements: string[] | null
          is_public: boolean | null
          name: string
          preview_image_url: string | null
          price_cents: number | null
          rating_average: number | null
          rating_count: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          frame_config: Json
          id?: string
          included_elements?: string[] | null
          is_public?: boolean | null
          name: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          frame_config?: Json
          id?: string
          included_elements?: string[] | null
          is_public?: boolean | null
          name?: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crd_visual_styles: {
        Row: {
          animation_profile: Json | null
          base_material: Json
          category: Database["public"]["Enums"]["visual_style_category"]
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean
          is_locked: boolean
          lighting_preset: Json
          particle_effect: Json | null
          performance_budget: Json
          secondary_finish: Json | null
          shader_config: Json
          sort_order: number | null
          texture_profile: Json
          ui_preview_gradient: string
          unlock_cost: number | null
          unlock_method: Database["public"]["Enums"]["unlock_method"]
          updated_at: string | null
          visual_vibe: string
        }
        Insert: {
          animation_profile?: Json | null
          base_material?: Json
          category?: Database["public"]["Enums"]["visual_style_category"]
          created_at?: string | null
          display_name: string
          id: string
          is_active?: boolean
          is_locked?: boolean
          lighting_preset?: Json
          particle_effect?: Json | null
          performance_budget?: Json
          secondary_finish?: Json | null
          shader_config?: Json
          sort_order?: number | null
          texture_profile?: Json
          ui_preview_gradient: string
          unlock_cost?: number | null
          unlock_method?: Database["public"]["Enums"]["unlock_method"]
          updated_at?: string | null
          visual_vibe: string
        }
        Update: {
          animation_profile?: Json | null
          base_material?: Json
          category?: Database["public"]["Enums"]["visual_style_category"]
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          is_locked?: boolean
          lighting_preset?: Json
          particle_effect?: Json | null
          performance_budget?: Json
          secondary_finish?: Json | null
          shader_config?: Json
          sort_order?: number | null
          texture_profile?: Json
          ui_preview_gradient?: string
          unlock_cost?: number | null
          unlock_method?: Database["public"]["Enums"]["unlock_method"]
          updated_at?: string | null
          visual_vibe?: string
        }
        Relationships: []
      }
      crdmkr_processing_jobs: {
        Row: {
          cached_layers_count: number | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          last_accessed_at: string | null
          original_file_path: string | null
          progress: number | null
          result: Json | null
          started_at: string | null
          status: string | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cached_layers_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          last_accessed_at?: string | null
          original_file_path?: string | null
          progress?: number | null
          result?: Json | null
          started_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cached_layers_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          last_accessed_at?: string | null
          original_file_path?: string | null
          progress?: number | null
          result?: Json | null
          started_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      crdmkr_team_variations: {
        Row: {
          created_at: string | null
          generated_css: string | null
          generated_svg: string | null
          id: string
          parameter_overrides: Json | null
          preview_url: string | null
          team_colors: Json | null
          team_logos: Json | null
          team_name: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          generated_css?: string | null
          generated_svg?: string | null
          id?: string
          parameter_overrides?: Json | null
          preview_url?: string | null
          team_colors?: Json | null
          team_logos?: Json | null
          team_name: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          generated_css?: string | null
          generated_svg?: string | null
          id?: string
          parameter_overrides?: Json | null
          preview_url?: string | null
          team_colors?: Json | null
          team_logos?: Json | null
          team_name?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crdmkr_team_variations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_activities: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string | null
          creator_id: string | null
          id: string
          visibility: string | null
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          created_at?: string | null
          creator_id?: string | null
          id?: string
          visibility?: string | null
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string | null
          creator_id?: string | null
          id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_activities_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_analytics: {
        Row: {
          aggregation_level: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Insert: {
          aggregation_level?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Update: {
          aggregation_level?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_analytics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string | null
          creator_id: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed: string | null
          rule_type: string
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          creator_id?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          rule_type: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          creator_id?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          rule_type?: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_automation_rules_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_brands: {
        Row: {
          brand_description: string | null
          brand_name: string
          brand_verification_status: string | null
          created_at: string | null
          creator_id: string | null
          custom_css: string | null
          custom_domain: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          social_links: Json | null
          updated_at: string | null
          white_label_enabled: boolean | null
        }
        Insert: {
          brand_description?: string | null
          brand_name: string
          brand_verification_status?: string | null
          created_at?: string | null
          creator_id?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          updated_at?: string | null
          white_label_enabled?: boolean | null
        }
        Update: {
          brand_description?: string | null
          brand_name?: string
          brand_verification_status?: string | null
          created_at?: string | null
          creator_id?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          updated_at?: string | null
          white_label_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_brands_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string
          difficulty_level: string | null
          end_date: string | null
          entry_fee: number | null
          id: string
          judging_criteria: Json | null
          max_participants: number | null
          prize_pool: number | null
          rules: Json | null
          start_date: string | null
          status: string | null
          submission_deadline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description: string
          difficulty_level?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          judging_criteria?: Json | null
          max_participants?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          submission_deadline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string
          difficulty_level?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          judging_criteria?: Json | null
          max_participants?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          submission_deadline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_collaborations: {
        Row: {
          collaborators: string[]
          completion_date: string | null
          created_at: string | null
          deadline: string | null
          id: string
          ownership_split: Json
          project_id: string
          project_type: string
          revenue_sharing_agreement: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          collaborators?: string[]
          completion_date?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          ownership_split?: Json
          project_id: string
          project_type: string
          revenue_sharing_agreement?: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          collaborators?: string[]
          completion_date?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          ownership_split?: Json
          project_id?: string
          project_type?: string
          revenue_sharing_agreement?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_commissions: {
        Row: {
          client_id: string | null
          commission_type: string
          communication_channel: string | null
          created_at: string | null
          creator_id: string | null
          deadline: string | null
          deliverables: string[] | null
          description: string
          final_price: number | null
          id: string
          quoted_price: number
          requirements: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          commission_type: string
          communication_channel?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          deliverables?: string[] | null
          description: string
          final_price?: number | null
          id?: string
          quoted_price: number
          requirements?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          commission_type?: string
          communication_channel?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          deliverables?: string[] | null
          description?: string
          final_price?: number | null
          id?: string
          quoted_price?: number
          requirements?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_commissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_courses: {
        Row: {
          course_materials: Json | null
          course_type: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          enrollment_count: number | null
          id: string
          instructor_id: string | null
          is_free: boolean | null
          is_published: boolean | null
          learning_objectives: string[] | null
          prerequisites: string[] | null
          price: number | null
          rating: number | null
          skill_level: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          course_materials?: Json | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          price?: number | null
          rating?: number | null
          skill_level?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          course_materials?: Json | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          price?: number | null
          rating?: number | null
          skill_level?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_earnings: {
        Row: {
          amount: number
          card_id: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          metadata: Json | null
          net_amount: number | null
          payout_date: string | null
          platform_fee: number
          source_type: string
          status: string | null
          stripe_transfer_id: string | null
          tax_document_id: string | null
          template_id: string | null
          transaction_date: string | null
        }
        Insert: {
          amount: number
          card_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          payout_date?: string | null
          platform_fee?: number
          source_type: string
          status?: string | null
          stripe_transfer_id?: string | null
          tax_document_id?: string | null
          template_id?: string | null
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          card_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          payout_date?: string | null
          platform_fee?: number
          source_type?: string
          status?: string | null
          stripe_transfer_id?: string | null
          tax_document_id?: string | null
          template_id?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_earnings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates_creator"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_follows: {
        Row: {
          followed_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
          notification_settings: Json | null
        }
        Insert: {
          followed_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
          notification_settings?: Json | null
        }
        Update: {
          followed_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
          notification_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_forums: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity: string | null
          reply_count: number | null
          skill_level: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity?: string | null
          reply_count?: number | null
          skill_level?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity?: string | null
          reply_count?: number | null
          skill_level?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_forums_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_grants: {
        Row: {
          amount: number
          application_deadline: string | null
          applications_count: number | null
          available_slots: number | null
          created_at: string | null
          description: string
          grant_type: string
          id: string
          requirements: Json | null
          selection_criteria: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_deadline?: string | null
          applications_count?: number | null
          available_slots?: number | null
          created_at?: string | null
          description: string
          grant_type: string
          id?: string
          requirements?: Json | null
          selection_criteria?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_deadline?: string | null
          applications_count?: number | null
          available_slots?: number | null
          created_at?: string | null
          description?: string
          grant_type?: string
          id?: string
          requirements?: Json | null
          selection_criteria?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_integrations: {
        Row: {
          api_credentials: Json | null
          config: Json
          created_at: string | null
          creator_id: string | null
          error_log: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          api_credentials?: Json | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          error_log?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_credentials?: Json | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          error_log?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_integrations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_mentorships: {
        Row: {
          commission_percentage: number | null
          created_at: string | null
          feedback_rating: number | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          payment_amount: number | null
          program_type: string
          sessions_completed: number | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          commission_percentage?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          payment_amount?: number | null
          program_type: string
          sessions_completed?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          payment_amount?: number | null
          program_type?: string
          sessions_completed?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_mentorships_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_mentorships_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          avg_rating: number | null
          bio: string | null
          cards_created: number | null
          commission_rates: Json | null
          created_at: string | null
          id: string
          onboarding_completed: boolean | null
          onboarding_step: string | null
          payout_enabled: boolean | null
          portfolio_url: string | null
          specialties: string[] | null
          stripe_account_id: string | null
          tax_info: Json | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          avg_rating?: number | null
          bio?: string | null
          cards_created?: number | null
          commission_rates?: Json | null
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          payout_enabled?: boolean | null
          portfolio_url?: string | null
          specialties?: string[] | null
          stripe_account_id?: string | null
          tax_info?: Json | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          avg_rating?: number | null
          bio?: string | null
          cards_created?: number | null
          commission_rates?: Json | null
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          payout_enabled?: boolean | null
          portfolio_url?: string | null
          specialties?: string[] | null
          stripe_account_id?: string | null
          tax_info?: Json | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      creator_progress: {
        Row: {
          cards_created_basic: number | null
          cards_created_studio: number | null
          created_at: string | null
          elements_created: number | null
          frames_created: number | null
          id: string
          preferred_mode: string | null
          studio_unlocked: boolean | null
          total_earnings_cents: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_created_basic?: number | null
          cards_created_studio?: number | null
          created_at?: string | null
          elements_created?: number | null
          frames_created?: number | null
          id?: string
          preferred_mode?: string | null
          studio_unlocked?: boolean | null
          total_earnings_cents?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_created_basic?: number | null
          cards_created_studio?: number | null
          created_at?: string | null
          elements_created?: number | null
          frames_created?: number | null
          id?: string
          preferred_mode?: string | null
          studio_unlocked?: boolean | null
          total_earnings_cents?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      creator_streams: {
        Row: {
          actual_start: string | null
          chat_enabled: boolean | null
          created_at: string | null
          creator_id: string | null
          current_viewers: number | null
          description: string | null
          ended_at: string | null
          id: string
          max_viewers: number | null
          recording_url: string | null
          scheduled_start: string | null
          status: string | null
          stream_type: string | null
          stream_url: string | null
          thumbnail_url: string | null
          title: string
          total_views: number | null
        }
        Insert: {
          actual_start?: string | null
          chat_enabled?: boolean | null
          created_at?: string | null
          creator_id?: string | null
          current_viewers?: number | null
          description?: string | null
          ended_at?: string | null
          id?: string
          max_viewers?: number | null
          recording_url?: string | null
          scheduled_start?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          title: string
          total_views?: number | null
        }
        Update: {
          actual_start?: string | null
          chat_enabled?: boolean | null
          created_at?: string | null
          creator_id?: string | null
          current_viewers?: number | null
          description?: string | null
          ended_at?: string | null
          id?: string
          max_viewers?: number | null
          recording_url?: string | null
          scheduled_start?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          title?: string
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_subscription_tiers: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          limits: Json
          monthly_price: number
          sort_order: number | null
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          monthly_price: number
          sort_order?: number | null
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          monthly_price?: number
          sort_order?: number | null
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_subscriptions: {
        Row: {
          benefits: Json | null
          created_at: string | null
          creator_id: string | null
          end_date: string | null
          id: string
          monthly_fee: number
          start_date: string | null
          status: string | null
          stripe_subscription_id: string | null
          subscriber_id: string | null
          subscription_type: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          creator_id?: string | null
          end_date?: string | null
          id?: string
          monthly_fee: number
          start_date?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          subscriber_id?: string | null
          subscription_type: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          creator_id?: string | null
          end_date?: string | null
          id?: string
          monthly_fee?: number
          start_date?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          subscriber_id?: string | null
          subscription_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_templates: {
        Row: {
          canvas: Json
          category: string
          compatibility: string[]
          created_at: string
          creator_id: string
          description: string | null
          download_count: number
          file_size: number
          id: string
          last_updated: string
          layers: Json
          license: string
          preview_images: string[]
          price: number
          rating: number
          review_count: number
          tags: string[]
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          canvas?: Json
          category: string
          compatibility?: string[]
          created_at?: string
          creator_id: string
          description?: string | null
          download_count?: number
          file_size?: number
          id?: string
          last_updated?: string
          layers?: Json
          license?: string
          preview_images?: string[]
          price?: number
          rating?: number
          review_count?: number
          tags?: string[]
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          canvas?: Json
          category?: string
          compatibility?: string[]
          created_at?: string
          creator_id?: string
          description?: string | null
          download_count?: number
          file_size?: number
          id?: string
          last_updated?: string
          layers?: Json
          license?: string
          preview_images?: string[]
          price?: number
          rating?: number
          review_count?: number
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      creator_tokens: {
        Row: {
          created_at: string | null
          creator_id: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          source: string
          token_type: string
          token_value: number
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          source: string
          token_type: string
          token_value: number
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          source?: string
          token_type?: string
          token_value?: number
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_tokens_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          description: string
          expires_at: string
          id: string
          is_active: boolean | null
          points_reward: number
          target_value: number
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          description: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          points_reward?: number
          target_value?: number
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          description?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          points_reward?: number
          target_value?: number
          title?: string
        }
        Relationships: []
      }
      design_assets_library: {
        Row: {
          asset_name: string
          asset_type: string
          categories: string[] | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          dimensions: Json | null
          downloads_count: number | null
          file_format: string | null
          file_size: number | null
          file_url: string
          id: string
          is_featured: boolean | null
          metadata: Json | null
          price: number | null
          revenue_generated: number | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          usage_rights: string | null
        }
        Insert: {
          asset_name: string
          asset_type: string
          categories?: string[] | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          dimensions?: Json | null
          downloads_count?: number | null
          file_format?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price?: number | null
          revenue_generated?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          usage_rights?: string | null
        }
        Update: {
          asset_name?: string
          asset_type?: string
          categories?: string[] | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          dimensions?: Json | null
          downloads_count?: number | null
          file_format?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price?: number | null
          revenue_generated?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_assets_library_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      design_projects: {
        Row: {
          canvas: Json
          collaborators: Json
          created_at: string
          creator_id: string
          description: string | null
          id: string
          last_modified: string
          layers: Json
          metadata: Json
          status: string
          template_id: string | null
          title: string
          version: number
        }
        Insert: {
          canvas?: Json
          collaborators?: Json
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          last_modified?: string
          layers?: Json
          metadata?: Json
          status?: string
          template_id?: string | null
          title: string
          version?: number
        }
        Update: {
          canvas?: Json
          collaborators?: Json
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          last_modified?: string
          layers?: Json
          metadata?: Json
          status?: string
          template_id?: string | null
          title?: string
          version?: number
        }
        Relationships: []
      }
      dna_entries_v2: {
        Row: {
          architecture: string[] | null
          city_id: string | null
          climate: string | null
          collectibility: number | null
          color_scheme_id: string | null
          community_tags: string[] | null
          created_at: string | null
          current_supply: number | null
          dna_code: string
          drop_rate: number | null
          emoji: string | null
          id: string
          is_blendable: boolean | null
          is_remixable: boolean | null
          legacy_group: string | null
          legacy_team_code: string | null
          legacy_team_name: string | null
          migration_date: string | null
          music: string[] | null
          pack_exclusive: boolean | null
          popularity: number | null
          power_level: number | null
          rarity: string
          requires_achievement: string | null
          requires_purchase: boolean | null
          search_terms: string[] | null
          seasonal_only: boolean | null
          source: string | null
          style_id: string | null
          symbols: string[] | null
          tags: string[] | null
          total_supply: number | null
          unlock_method: string | null
          updated_at: string | null
          variant: string | null
          version: string | null
          vibes: string[] | null
        }
        Insert: {
          architecture?: string[] | null
          city_id?: string | null
          climate?: string | null
          collectibility?: number | null
          color_scheme_id?: string | null
          community_tags?: string[] | null
          created_at?: string | null
          current_supply?: number | null
          dna_code: string
          drop_rate?: number | null
          emoji?: string | null
          id?: string
          is_blendable?: boolean | null
          is_remixable?: boolean | null
          legacy_group?: string | null
          legacy_team_code?: string | null
          legacy_team_name?: string | null
          migration_date?: string | null
          music?: string[] | null
          pack_exclusive?: boolean | null
          popularity?: number | null
          power_level?: number | null
          rarity?: string
          requires_achievement?: string | null
          requires_purchase?: boolean | null
          search_terms?: string[] | null
          seasonal_only?: boolean | null
          source?: string | null
          style_id?: string | null
          symbols?: string[] | null
          tags?: string[] | null
          total_supply?: number | null
          unlock_method?: string | null
          updated_at?: string | null
          variant?: string | null
          version?: string | null
          vibes?: string[] | null
        }
        Update: {
          architecture?: string[] | null
          city_id?: string | null
          climate?: string | null
          collectibility?: number | null
          color_scheme_id?: string | null
          community_tags?: string[] | null
          created_at?: string | null
          current_supply?: number | null
          dna_code?: string
          drop_rate?: number | null
          emoji?: string | null
          id?: string
          is_blendable?: boolean | null
          is_remixable?: boolean | null
          legacy_group?: string | null
          legacy_team_code?: string | null
          legacy_team_name?: string | null
          migration_date?: string | null
          music?: string[] | null
          pack_exclusive?: boolean | null
          popularity?: number | null
          power_level?: number | null
          rarity?: string
          requires_achievement?: string | null
          requires_purchase?: boolean | null
          search_terms?: string[] | null
          seasonal_only?: boolean | null
          source?: string | null
          style_id?: string | null
          symbols?: string[] | null
          tags?: string[] | null
          total_supply?: number | null
          unlock_method?: string | null
          updated_at?: string | null
          variant?: string | null
          version?: string | null
          vibes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "dna_entries_v2_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dna_entries_v2_color_scheme_id_fkey"
            columns: ["color_scheme_id"]
            isOneToOne: false
            referencedRelation: "color_schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dna_entries_v2_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "style_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      element_downloads: {
        Row: {
          amount_paid_cents: number | null
          download_type: string
          downloaded_at: string | null
          element_id: string | null
          frame_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          amount_paid_cents?: number | null
          download_type: string
          downloaded_at?: string | null
          element_id?: string | null
          frame_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          amount_paid_cents?: number | null
          download_type?: string
          downloaded_at?: string | null
          element_id?: string | null
          frame_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "element_downloads_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "crd_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "element_downloads_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "crd_frames"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_organizations: {
        Row: {
          billing_contact_id: string | null
          created_at: string | null
          custom_domain: string | null
          domain: string | null
          id: string
          name: string
          ssl_certificate_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          white_label_config: Json | null
        }
        Insert: {
          billing_contact_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          domain?: string | null
          id?: string
          name: string
          ssl_certificate_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          white_label_config?: Json | null
        }
        Update: {
          billing_contact_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          domain?: string | null
          id?: string
          name?: string
          ssl_certificate_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          white_label_config?: Json | null
        }
        Relationships: []
      }
      enterprise_users: {
        Row: {
          added_at: string | null
          id: string
          organization_id: string | null
          permissions: Json | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "enterprise_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flag_user_overrides: {
        Row: {
          created_at: string | null
          flag_id: string | null
          id: string
          is_enabled: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          flag_id?: string | null
          id?: string
          is_enabled: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          flag_id?: string | null
          id?: string
          is_enabled?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flag_user_overrides_flag_id_fkey"
            columns: ["flag_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          metadata: Json | null
          name: string
          rollout_percentage: number | null
          target_users: Json | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          name: string
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          name?: string
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_analytics: {
        Row: {
          avg_transaction_value: number | null
          created_at: string | null
          id: string
          total_fees: number | null
          total_payouts: number | null
          total_revenue: number | null
          transaction_count: number | null
          transaction_date: string
        }
        Insert: {
          avg_transaction_value?: number | null
          created_at?: string | null
          id?: string
          total_fees?: number | null
          total_payouts?: number | null
          total_revenue?: number | null
          transaction_count?: number | null
          transaction_date: string
        }
        Update: {
          avg_transaction_value?: number | null
          created_at?: string | null
          id?: string
          total_fees?: number | null
          total_payouts?: number | null
          total_revenue?: number | null
          transaction_count?: number | null
          transaction_date?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          followed_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          followed_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          followed_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          creator_id: string | null
          forum_id: string | null
          id: string
          is_solution: boolean | null
          parent_reply_id: string | null
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          creator_id?: string | null
          forum_id?: string | null
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          creator_id?: string | null
          forum_id?: string | null
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "creator_forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_preferences: {
        Row: {
          accessibility_mode: boolean | null
          ambient_lighting: boolean | null
          auto_rotate: boolean | null
          created_at: string | null
          environment_theme: string | null
          id: string
          layout_type: string | null
          navigation_speed: number | null
          particle_effects: boolean | null
          reduced_motion: boolean | null
          spatial_audio: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility_mode?: boolean | null
          ambient_lighting?: boolean | null
          auto_rotate?: boolean | null
          created_at?: string | null
          environment_theme?: string | null
          id?: string
          layout_type?: string | null
          navigation_speed?: number | null
          particle_effects?: boolean | null
          reduced_motion?: boolean | null
          spatial_audio?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility_mode?: boolean | null
          ambient_lighting?: boolean | null
          auto_rotate?: boolean | null
          created_at?: string | null
          environment_theme?: string | null
          id?: string
          layout_type?: string | null
          navigation_speed?: number | null
          particle_effects?: boolean | null
          reduced_motion?: boolean | null
          spatial_audio?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gallery_session_participants: {
        Row: {
          cursor_position: Json | null
          id: string
          is_host: boolean | null
          joined_at: string | null
          last_active: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          cursor_position?: Json | null
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          last_active?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          cursor_position?: Json | null
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          last_active?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shared_gallery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_viewing_history: {
        Row: {
          cards_viewed: string[] | null
          collection_id: string
          created_at: string | null
          id: string
          interaction_count: number | null
          last_card_viewed: string | null
          layout_used: string
          session_duration: number | null
          updated_at: string | null
          user_id: string
          viewing_position: Json | null
        }
        Insert: {
          cards_viewed?: string[] | null
          collection_id: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          last_card_viewed?: string | null
          layout_used: string
          session_duration?: number | null
          updated_at?: string | null
          user_id: string
          viewing_position?: Json | null
        }
        Update: {
          cards_viewed?: string[] | null
          collection_id?: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          last_card_viewed?: string | null
          layout_used?: string
          session_duration?: number | null
          updated_at?: string | null
          user_id?: string
          viewing_position?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_viewing_history_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_viewing_history_last_card_viewed_fkey"
            columns: ["last_card_viewed"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      gdpr_requests: {
        Row: {
          created_at: string | null
          data_package_url: string | null
          expires_at: string | null
          id: string
          processed_at: string | null
          request_type: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_package_url?: string | null
          expires_at?: string | null
          id?: string
          processed_at?: string | null
          request_type: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_package_url?: string | null
          expires_at?: string | null
          id?: string
          processed_at?: string | null
          request_type?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      grant_applications: {
        Row: {
          approved_amount: number | null
          budget_breakdown: Json
          creator_id: string | null
          feedback: string | null
          grant_id: string | null
          id: string
          portfolio_links: string[] | null
          project_proposal: string
          reviewed_at: string | null
          score: number | null
          status: string | null
          submitted_at: string | null
          timeline: Json
        }
        Insert: {
          approved_amount?: number | null
          budget_breakdown: Json
          creator_id?: string | null
          feedback?: string | null
          grant_id?: string | null
          id?: string
          portfolio_links?: string[] | null
          project_proposal: string
          reviewed_at?: string | null
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          timeline: Json
        }
        Update: {
          approved_amount?: number | null
          budget_breakdown?: Json
          creator_id?: string | null
          feedback?: string | null
          grant_id?: string | null
          id?: string
          portfolio_links?: string[] | null
          project_proposal?: string
          reviewed_at?: string | null
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          timeline?: Json
        }
        Relationships: [
          {
            foreignKeyName: "grant_applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_applications_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "creator_grants"
            referencedColumns: ["id"]
          },
        ]
      }
      image_assets: {
        Row: {
          alt_text: string | null
          category: string | null
          cdn_url: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          id: string
          is_optimized: boolean | null
          mime_type: string | null
          name: string
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          cdn_url?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          is_optimized?: boolean | null
          mime_type?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          cdn_url?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_optimized?: boolean | null
          mime_type?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          api_keys: Json | null
          config: Json
          created_at: string | null
          created_by: string | null
          error_log: string | null
          id: string
          integration_name: string
          is_active: boolean | null
          last_sync: string | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_keys?: Json | null
          config?: Json
          created_at?: string | null
          created_by?: string | null
          error_log?: string | null
          id?: string
          integration_name: string
          is_active?: boolean | null
          last_sync?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_keys?: Json | null
          config?: Json
          created_at?: string | null
          created_by?: string | null
          error_log?: string | null
          id?: string
          integration_name?: string
          is_active?: boolean | null
          last_sync?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          helpful_count: number | null
          id: string
          search_vector: unknown | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      market_analytics: {
        Row: {
          avg_price: number | null
          card_id: string | null
          created_at: string | null
          date: string
          id: string
          liquidity_score: number | null
          market_cap: number | null
          price_change_24h: number | null
          transactions: number | null
          volume: number | null
        }
        Insert: {
          avg_price?: number | null
          card_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          liquidity_score?: number | null
          market_cap?: number | null
          price_change_24h?: number | null
          transactions?: number | null
          volume?: number | null
        }
        Update: {
          avg_price?: number | null
          card_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          liquidity_score?: number | null
          market_cap?: number | null
          price_change_24h?: number | null
          transactions?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_analytics_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          auction_end_time: string | null
          card_id: string
          condition: string
          created_at: string | null
          description: string | null
          estimated_delivery: string | null
          featured: boolean | null
          id: string
          listing_type: string
          location: string | null
          price: number
          quantity: number
          reserve_price: number | null
          seller_id: string
          shipping_cost: number | null
          status: string
          updated_at: string | null
          views: number | null
          watchers_count: number | null
        }
        Insert: {
          auction_end_time?: string | null
          card_id: string
          condition?: string
          created_at?: string | null
          description?: string | null
          estimated_delivery?: string | null
          featured?: boolean | null
          id?: string
          listing_type?: string
          location?: string | null
          price: number
          quantity?: number
          reserve_price?: number | null
          seller_id: string
          shipping_cost?: number | null
          status?: string
          updated_at?: string | null
          views?: number | null
          watchers_count?: number | null
        }
        Update: {
          auction_end_time?: string | null
          card_id?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          estimated_delivery?: string | null
          featured?: boolean | null
          id?: string
          listing_type?: string
          location?: string | null
          price?: number
          quantity?: number
          reserve_price?: number | null
          seller_id?: string
          shipping_cost?: number | null
          status?: string
          updated_at?: string | null
          views?: number | null
          watchers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offers: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          review_text: string | null
          review_type: string | null
          reviewed_id: string | null
          reviewer_id: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          review_type?: string | null
          reviewed_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          review_type?: string | null
          reviewed_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_seo: {
        Row: {
          auto_optimization_enabled: boolean | null
          created_at: string | null
          id: string
          keywords: string[] | null
          last_optimized: string | null
          listing_id: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          seo_score: number | null
          structured_data: Json | null
          updated_at: string | null
        }
        Insert: {
          auto_optimization_enabled?: boolean | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          last_optimized?: string | null
          listing_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          seo_score?: number | null
          structured_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          auto_optimization_enabled?: boolean | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          last_optimized?: string | null
          listing_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          seo_score?: number | null
          structured_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_seo_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_watchers: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_watchers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          bucket_id: string | null
          created_at: string | null
          duration: number | null
          file_name: string
          file_size: number | null
          file_url: string
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          owner_id: string
          storage_path: string | null
          thumbnail_url: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_name: string
          file_size?: number | null
          file_url: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          owner_id: string
          storage_path?: string | null
          thumbnail_url?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          owner_id?: string
          storage_path?: string | null
          thumbnail_url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          card_id: string | null
          created_at: string | null
          description: string | null
          id: string
          location: Json | null
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: Json | null
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: Json | null
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          assigned_moderator_id: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          priority: number | null
          reason: string
          reporter_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          assigned_moderator_id?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          priority?: number | null
          reason: string
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          assigned_moderator_id?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          priority?: number | null
          reason?: string
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          recipient_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          recipient_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          recipient_id?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          creator_id: string | null
          id: string
          measurement_context: string | null
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          timestamp: string | null
        }
        Insert: {
          creator_id?: string | null
          id?: string
          measurement_context?: string | null
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          creator_id?: string | null
          id?: string
          measurement_context?: string | null
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      portfolio_tracking: {
        Row: {
          card_id: string | null
          created_at: string | null
          current_value: number | null
          id: string
          purchase_date: string | null
          purchase_price: number | null
          quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_tracking_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          preferences: Json | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          preferences?: Json | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          preferences?: Json | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      project_collaborators: {
        Row: {
          id: string
          invited_at: string
          joined_at: string | null
          permissions: string[]
          project_id: string
          role: string
          user_id: string
          username: string
        }
        Insert: {
          id?: string
          invited_at?: string
          joined_at?: string | null
          permissions?: string[]
          project_id: string
          role?: string
          user_id: string
          username: string
        }
        Update: {
          id?: string
          invited_at?: string
          joined_at?: string | null
          permissions?: string[]
          project_id?: string
          role?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "design_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      psd_generated_frames: {
        Row: {
          auto_generated: boolean | null
          created_at: string | null
          frame_config: Json
          frame_name: string
          id: string
          job_id: string | null
          layer_mapping: Json | null
          updated_at: string | null
          user_modified: boolean | null
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string | null
          frame_config: Json
          frame_name: string
          id?: string
          job_id?: string | null
          layer_mapping?: Json | null
          updated_at?: string | null
          user_modified?: boolean | null
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string | null
          frame_config?: Json
          frame_name?: string
          id?: string
          job_id?: string | null
          layer_mapping?: Json | null
          updated_at?: string | null
          user_modified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "psd_generated_frames_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "crdmkr_processing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      psd_layers: {
        Row: {
          bounds: Json
          cached_image_url: string | null
          content: Json | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          job_id: string | null
          last_modified_at: string | null
          layer_hash: string | null
          layer_name: string
          layer_order: number | null
          layer_type: string
          parent_layer_id: string | null
          style_properties: Json | null
        }
        Insert: {
          bounds: Json
          cached_image_url?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          job_id?: string | null
          last_modified_at?: string | null
          layer_hash?: string | null
          layer_name: string
          layer_order?: number | null
          layer_type: string
          parent_layer_id?: string | null
          style_properties?: Json | null
        }
        Update: {
          bounds?: Json
          cached_image_url?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          job_id?: string | null
          last_modified_at?: string | null
          layer_hash?: string | null
          layer_name?: string
          layer_order?: number | null
          layer_type?: string
          parent_layer_id?: string | null
          style_properties?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "psd_layers_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "crdmkr_processing_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psd_layers_parent_layer_id_fkey"
            columns: ["parent_layer_id"]
            isOneToOne: false
            referencedRelation: "psd_layers"
            referencedColumns: ["id"]
          },
        ]
      }
      ransom_letter_elements: {
        Row: {
          background_color: string | null
          background_css: string | null
          background_pattern: string | null
          border_radius: string | null
          border_style: string | null
          box_shadow: string | null
          character: string
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          font_family: string
          font_size_em: number
          font_style: string
          font_weight: string
          id: string
          image_url: string | null
          margin: string | null
          padding: string | null
          rarity: string
          rotation_deg: number | null
          scale_factor: number | null
          skew_deg: number | null
          source_type: string
          style_category: string
          tags: string[] | null
          text_color: string
          text_decoration: string | null
          text_shadow: string | null
          thumbnail_url: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          background_color?: string | null
          background_css?: string | null
          background_pattern?: string | null
          border_radius?: string | null
          border_style?: string | null
          box_shadow?: string | null
          character: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name: string
          font_family: string
          font_size_em?: number
          font_style?: string
          font_weight?: string
          id?: string
          image_url?: string | null
          margin?: string | null
          padding?: string | null
          rarity?: string
          rotation_deg?: number | null
          scale_factor?: number | null
          skew_deg?: number | null
          source_type?: string
          style_category?: string
          tags?: string[] | null
          text_color: string
          text_decoration?: string | null
          text_shadow?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          background_color?: string | null
          background_css?: string | null
          background_pattern?: string | null
          border_radius?: string | null
          border_style?: string | null
          box_shadow?: string | null
          character?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name?: string
          font_family?: string
          font_size_em?: number
          font_style?: string
          font_weight?: string
          id?: string
          image_url?: string | null
          margin?: string | null
          padding?: string | null
          rarity?: string
          rotation_deg?: number | null
          scale_factor?: number | null
          skew_deg?: number | null
          source_type?: string
          style_category?: string
          tags?: string[] | null
          text_color?: string
          text_decoration?: string | null
          text_shadow?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          card_id: string | null
          collection_id: string | null
          comment_id: string | null
          created_at: string | null
          id: string
          memory_id: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string | null
          id?: string
          memory_id?: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string | null
          id?: string
          memory_id?: string | null
          type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          business_type: string | null
          charges_enabled: boolean | null
          created_at: string | null
          id: string
          payout_enabled: boolean | null
          rating: number | null
          stripe_account_id: string | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          business_type?: string | null
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          payout_enabled?: boolean | null
          rating?: number | null
          stripe_account_id?: string | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          business_type?: string | null
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          payout_enabled?: boolean | null
          rating?: number | null
          stripe_account_id?: string | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      sets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          release_date: string | null
          total_cards: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          release_date?: string | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          release_date?: string | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shader_performance_logs: {
        Row: {
          compilation_time_ms: number | null
          device_info: Json | null
          fps_average: number | null
          id: string
          quality_preset: string | null
          render_time_ms: number | null
          shader_type: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          compilation_time_ms?: number | null
          device_info?: Json | null
          fps_average?: number | null
          id?: string
          quality_preset?: string | null
          render_time_ms?: number | null
          shader_type?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          compilation_time_ms?: number | null
          device_info?: Json | null
          fps_average?: number | null
          id?: string
          quality_preset?: string | null
          render_time_ms?: number | null
          shader_type?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      shared_gallery_sessions: {
        Row: {
          collection_id: string
          created_at: string | null
          current_participants: number | null
          expires_at: string | null
          host_user_id: string
          id: string
          is_active: boolean | null
          layout_type: string | null
          max_participants: number | null
          session_code: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          current_participants?: number | null
          expires_at?: string | null
          host_user_id: string
          id?: string
          is_active?: boolean | null
          layout_type?: string | null
          max_participants?: number | null
          session_code?: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          current_participants?: number | null
          expires_at?: string | null
          host_user_id?: string
          id?: string
          is_active?: boolean | null
          layout_type?: string | null
          max_participants?: number | null
          session_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_gallery_sessions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      social_activities: {
        Row: {
          activity_timestamp: string | null
          activity_type: string
          created_at: string | null
          featured_status: boolean | null
          id: string
          metadata: Json | null
          reaction_count: number | null
          target_id: string | null
          target_type: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          activity_timestamp?: string | null
          activity_type: string
          created_at?: string | null
          featured_status?: boolean | null
          id?: string
          metadata?: Json | null
          reaction_count?: number | null
          target_id?: string | null
          target_type?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          activity_timestamp?: string | null
          activity_type?: string
          created_at?: string | null
          featured_status?: boolean | null
          id?: string
          metadata?: Json | null
          reaction_count?: number | null
          target_id?: string | null
          target_type?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          share_type: string
          user_id: string | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          share_type: string
          user_id?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          share_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sport_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          region: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          region?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sports_leagues: {
        Row: {
          abbreviation: string | null
          country: string | null
          created_at: string | null
          founded_year: number | null
          id: string
          name: string
          official_website: string | null
          sport_category_id: string | null
          updated_at: string | null
        }
        Insert: {
          abbreviation?: string | null
          country?: string | null
          created_at?: string | null
          founded_year?: number | null
          id?: string
          name: string
          official_website?: string | null
          sport_category_id?: string | null
          updated_at?: string | null
        }
        Update: {
          abbreviation?: string | null
          country?: string | null
          created_at?: string | null
          founded_year?: number | null
          id?: string
          name?: string
          official_website?: string | null
          sport_category_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_leagues_sport_category_id_fkey"
            columns: ["sport_category_id"]
            isOneToOne: false
            referencedRelation: "sport_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_teams: {
        Row: {
          accent_color: string | null
          alternate_colors: Json | null
          brand_guidelines: Json | null
          city: string
          created_at: string | null
          founded_year: number | null
          id: string
          league_id: string | null
          logo_url: string | null
          name: string
          neutral_color: string | null
          nickname: string | null
          official_website: string | null
          primary_color: string
          secondary_color: string
          stadium_arena: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          alternate_colors?: Json | null
          brand_guidelines?: Json | null
          city: string
          created_at?: string | null
          founded_year?: number | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name: string
          neutral_color?: string | null
          nickname?: string | null
          official_website?: string | null
          primary_color: string
          secondary_color: string
          stadium_arena?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          alternate_colors?: Json | null
          brand_guidelines?: Json | null
          city?: string
          created_at?: string | null
          founded_year?: number | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name?: string
          neutral_color?: string | null
          nickname?: string | null
          official_website?: string | null
          primary_color?: string
          secondary_color?: string
          stadium_arena?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "sports_leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_interactions: {
        Row: {
          id: string
          interaction_type: string
          message: string | null
          stream_id: string | null
          timestamp: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          interaction_type: string
          message?: string | null
          stream_id?: string | null
          timestamp?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          interaction_type?: string
          message?: string | null
          stream_id?: string | null
          timestamp?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_interactions_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "creator_streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_interactions_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      style_definitions: {
        Row: {
          created_at: string | null
          era: string | null
          has_borders: boolean | null
          has_gradients: boolean | null
          has_shadows: boolean | null
          id: string
          style_code: string
          style_name: string
          textures: string[] | null
          typography_style: string | null
          typography_transform: string | null
          typography_weight: string | null
        }
        Insert: {
          created_at?: string | null
          era?: string | null
          has_borders?: boolean | null
          has_gradients?: boolean | null
          has_shadows?: boolean | null
          id?: string
          style_code: string
          style_name: string
          textures?: string[] | null
          typography_style?: string | null
          typography_transform?: string | null
          typography_weight?: string | null
        }
        Update: {
          created_at?: string | null
          era?: string | null
          has_borders?: boolean | null
          has_gradients?: boolean | null
          has_shadows?: boolean | null
          id?: string
          style_code?: string
          style_name?: string
          textures?: string[] | null
          typography_style?: string | null
          typography_transform?: string | null
          typography_weight?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_agent_id: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          recorded_at: string | null
          status: string | null
          threshold_critical: number | null
          threshold_warning: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          recorded_at?: string | null
          status?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string | null
          status?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string | null
          metric_value: number
          recorded_at: string | null
          tags: Json | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type?: string | null
          metric_value: number
          recorded_at?: string | null
          tags?: Json | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string | null
          metric_value?: number
          recorded_at?: string | null
          tags?: Json | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      team_color_palettes: {
        Row: {
          accent_hsl: string
          accessibility_level: string | null
          contrast_ratio: number | null
          created_at: string | null
          cta_bg_hsl: string
          id: string
          navbar_bg_hsl: string
          neutral_hsl: string
          primary_hsl: string
          secondary_hsl: string
          team_id: string | null
          text_primary_hsl: string
          text_secondary_hsl: string
          updated_at: string | null
        }
        Insert: {
          accent_hsl: string
          accessibility_level?: string | null
          contrast_ratio?: number | null
          created_at?: string | null
          cta_bg_hsl: string
          id?: string
          navbar_bg_hsl: string
          neutral_hsl: string
          primary_hsl: string
          secondary_hsl: string
          team_id?: string | null
          text_primary_hsl: string
          text_secondary_hsl: string
          updated_at?: string | null
        }
        Update: {
          accent_hsl?: string
          accessibility_level?: string | null
          contrast_ratio?: number | null
          created_at?: string | null
          cta_bg_hsl?: string
          id?: string
          navbar_bg_hsl?: string
          neutral_hsl?: string
          primary_hsl?: string
          secondary_hsl?: string
          team_id?: string | null
          text_primary_hsl?: string
          text_secondary_hsl?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_color_palettes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "sports_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          abbreviation: string
          city: string
          color_theme_id: string | null
          created_at: string | null
          id: string
          league: string
          name: string
          sport: string
        }
        Insert: {
          abbreviation: string
          city: string
          color_theme_id?: string | null
          created_at?: string | null
          id?: string
          league: string
          name: string
          sport: string
        }
        Update: {
          abbreviation?: string
          city?: string
          color_theme_id?: string | null
          created_at?: string | null
          id?: string
          league?: string
          name?: string
          sport?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_color_theme_id_fkey"
            columns: ["color_theme_id"]
            isOneToOne: false
            referencedRelation: "color_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_card_analysis: {
        Row: {
          created_at: string | null
          id: string
          processed: boolean | null
          relevance_score: number | null
          session_id: string
          snippet: string | null
          source: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed?: boolean | null
          relevance_score?: number | null
          session_id: string
          snippet?: string | null
          source: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          processed?: boolean | null
          relevance_score?: number | null
          session_id?: string
          snippet?: string | null
          source?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      trade_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number | null
          reviewed_id: string
          reviewer_id: string
          trade_id: string
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          reviewed_id: string
          reviewer_id: string
          trade_id: string
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          reviewed_id?: string
          reviewer_id?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_feedback_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_messages: {
        Row: {
          attachment_url: string | null
          id: string
          message: string
          message_type: string | null
          metadata: Json | null
          read_status: boolean | null
          sender_id: string
          timestamp: string | null
          trade_id: string
        }
        Insert: {
          attachment_url?: string | null
          id?: string
          message: string
          message_type?: string | null
          metadata?: Json | null
          read_status?: boolean | null
          sender_id: string
          timestamp?: string | null
          trade_id: string
        }
        Update: {
          attachment_url?: string | null
          id?: string
          message?: string
          message_type?: string | null
          metadata?: Json | null
          read_status?: boolean | null
          sender_id?: string
          timestamp?: string | null
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_messages_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_offers: {
        Row: {
          cash_included: number | null
          completed_at: string | null
          counter_offer_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          initiator_id: string
          messages_channel_id: string | null
          metadata: Json | null
          offered_cards: Json
          recipient_id: string
          requested_cards: Json
          status: string
          trade_note: string | null
          trade_value_difference: number | null
          updated_at: string | null
        }
        Insert: {
          cash_included?: number | null
          completed_at?: string | null
          counter_offer_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          initiator_id: string
          messages_channel_id?: string | null
          metadata?: Json | null
          offered_cards?: Json
          recipient_id: string
          requested_cards?: Json
          status?: string
          trade_note?: string | null
          trade_value_difference?: number | null
          updated_at?: string | null
        }
        Update: {
          cash_included?: number | null
          completed_at?: string | null
          counter_offer_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          initiator_id?: string
          messages_channel_id?: string | null
          metadata?: Json | null
          offered_cards?: Json
          recipient_id?: string
          requested_cards?: Json
          status?: string
          trade_note?: string | null
          trade_value_difference?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_offers_counter_offer_id_fkey"
            columns: ["counter_offer_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_participants: {
        Row: {
          id: string
          is_typing: boolean | null
          last_seen: string | null
          presence_status: string | null
          trade_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_typing?: boolean | null
          last_seen?: string | null
          presence_status?: string | null
          trade_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_typing?: boolean | null
          last_seen?: string | null
          presence_status?: string | null
          trade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_participants_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          listing_id: string
          platform_fee: number
          refunded_at: string | null
          seller_id: string
          shipping_info: Json | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          tracking_number: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id: string
          platform_fee: number
          refunded_at?: string | null
          seller_id: string
          shipping_info?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tracking_number?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string
          platform_fee?: number
          refunded_at?: string | null
          seller_id?: string
          shipping_info?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_3d_preferences: {
        Row: {
          accessibility_mode: boolean | null
          battery_optimization: boolean | null
          created_at: string
          custom_settings: Json | null
          enable_animations: boolean | null
          enable_haptics: boolean | null
          enable_particles: boolean | null
          enable_shaders: boolean | null
          enable_sound: boolean | null
          id: string
          quality_preset: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_mode?: boolean | null
          battery_optimization?: boolean | null
          created_at?: string
          custom_settings?: Json | null
          enable_animations?: boolean | null
          enable_haptics?: boolean | null
          enable_particles?: boolean | null
          enable_shaders?: boolean | null
          enable_sound?: boolean | null
          id?: string
          quality_preset?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_mode?: boolean | null
          battery_optimization?: boolean | null
          created_at?: string
          custom_settings?: Json | null
          enable_animations?: boolean | null
          enable_haptics?: boolean | null
          enable_particles?: boolean | null
          enable_shaders?: boolean | null
          enable_sound?: boolean | null
          id?: string
          quality_preset?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          badge_image_url: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          metadata: Json | null
          points_awarded: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          badge_image_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          badge_image_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          cards_created: number | null
          cards_viewed: number | null
          created_at: string | null
          id: string
          last_activity: string | null
          login_count: number | null
          metric_date: string
          session_duration_minutes: number | null
          total_earned: number | null
          total_spent: number | null
          transactions_count: number | null
          user_id: string | null
        }
        Insert: {
          cards_created?: number | null
          cards_viewed?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          login_count?: number | null
          metric_date: string
          session_duration_minutes?: number | null
          total_earned?: number | null
          total_spent?: number | null
          transactions_count?: number | null
          user_id?: string | null
        }
        Update: {
          cards_created?: number | null
          cards_viewed?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          login_count?: number | null
          metric_date?: string
          session_duration_minutes?: number | null
          total_earned?: number | null
          total_spent?: number | null
          transactions_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_card_ownership: {
        Row: {
          acquisition_date: string | null
          acquisition_method: string | null
          acquisition_price: number | null
          card_id: string
          id: string
          is_favorite: boolean | null
          quantity: number | null
          user_id: string
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_method?: string | null
          acquisition_price?: number | null
          card_id: string
          id?: string
          is_favorite?: boolean | null
          quantity?: number | null
          user_id: string
        }
        Update: {
          acquisition_date?: string | null
          acquisition_method?: string | null
          acquisition_price?: number | null
          card_id?: string
          id?: string
          is_favorite?: boolean | null
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_card_ownership_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_ownership_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          is_completed: boolean | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cosmic_sessions: {
        Row: {
          alignment_achieved: boolean | null
          best_alignment_score: number | null
          camera_distance_avg: number | null
          card_angle_peak: number | null
          created_at: string | null
          id: string
          optimal_time_spent: number | null
          session_end: string | null
          session_start: string | null
          total_attempts: number | null
          user_id: string | null
        }
        Insert: {
          alignment_achieved?: boolean | null
          best_alignment_score?: number | null
          camera_distance_avg?: number | null
          card_angle_peak?: number | null
          created_at?: string | null
          id?: string
          optimal_time_spent?: number | null
          session_end?: string | null
          session_start?: string | null
          total_attempts?: number | null
          user_id?: string | null
        }
        Update: {
          alignment_achieved?: boolean | null
          best_alignment_score?: number | null
          camera_distance_avg?: number | null
          card_angle_peak?: number | null
          created_at?: string | null
          id?: string
          optimal_time_spent?: number | null
          session_end?: string | null
          session_start?: string | null
          total_attempts?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_experience_points: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          points_earned: number
          points_source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number
          points_source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number
          points_source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_interaction_events: {
        Row: {
          coordinates: Json | null
          event_type: string
          id: string
          metadata: Json | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          coordinates?: Json | null
          event_type: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          coordinates?: Json | null
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interaction_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_cosmic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accessibility_options: Json | null
          created_at: string | null
          id: string
          notifications_enabled: Json | null
          privacy_settings: Json | null
          quality_settings: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility_options?: Json | null
          created_at?: string | null
          id?: string
          notifications_enabled?: Json | null
          privacy_settings?: Json | null
          quality_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility_options?: Json | null
          created_at?: string | null
          id?: string
          notifications_enabled?: Json | null
          privacy_settings?: Json | null
          quality_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cards_created_count: number | null
          cover_image_url: string | null
          created_at: string | null
          days_active_streak: number | null
          effects_applied_count: number | null
          email: string
          experience_points: number | null
          full_name: string | null
          id: string
          is_creator: boolean | null
          is_verified: boolean | null
          last_active_date: string | null
          level: number | null
          location: string | null
          privacy_settings: Json | null
          progress_milestones: Json | null
          social_links: Json | null
          subscription_tier: string | null
          total_followers: number | null
          total_following: number | null
          unique_templates_used: number | null
          updated_at: string | null
          username: string
          verification_status: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cards_created_count?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          days_active_streak?: number | null
          effects_applied_count?: number | null
          email: string
          experience_points?: number | null
          full_name?: string | null
          id: string
          is_creator?: boolean | null
          is_verified?: boolean | null
          last_active_date?: string | null
          level?: number | null
          location?: string | null
          privacy_settings?: Json | null
          progress_milestones?: Json | null
          social_links?: Json | null
          subscription_tier?: string | null
          total_followers?: number | null
          total_following?: number | null
          unique_templates_used?: number | null
          updated_at?: string | null
          username: string
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cards_created_count?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          days_active_streak?: number | null
          effects_applied_count?: number | null
          email?: string
          experience_points?: number | null
          full_name?: string | null
          id?: string
          is_creator?: boolean | null
          is_verified?: boolean | null
          last_active_date?: string | null
          level?: number | null
          location?: string | null
          privacy_settings?: Json | null
          progress_milestones?: Json | null
          social_links?: Json | null
          subscription_tier?: string | null
          total_followers?: number | null
          total_following?: number | null
          unique_templates_used?: number | null
          updated_at?: string | null
          username?: string
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_psd_sessions: {
        Row: {
          auto_saved_at: string | null
          canvas_state: Json | null
          created_at: string | null
          id: string
          job_id: string
          layer_modifications: Json | null
          session_data: Json
          updated_at: string | null
          user_id: string
          visible_layers: string[] | null
        }
        Insert: {
          auto_saved_at?: string | null
          canvas_state?: Json | null
          created_at?: string | null
          id?: string
          job_id: string
          layer_modifications?: Json | null
          session_data?: Json
          updated_at?: string | null
          user_id: string
          visible_layers?: string[] | null
        }
        Update: {
          auto_saved_at?: string | null
          canvas_state?: Json | null
          created_at?: string | null
          id?: string
          job_id?: string
          layer_modifications?: Json | null
          session_data?: Json
          updated_at?: string | null
          user_id?: string
          visible_layers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_psd_sessions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "crdmkr_processing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_relationships: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
          interaction_count: number | null
          last_interaction: string | null
          notification_settings: Json | null
          relationship_type: string | null
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          notification_settings?: Json | null
          relationship_type?: string | null
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          notification_settings?: Json | null
          relationship_type?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          cards_created: number | null
          cards_owned: number | null
          created_at: string | null
          id: string
          last_active: string | null
          reputation_score: number | null
          total_earned: number | null
          total_spent: number | null
          trades_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cards_created?: number | null
          cards_owned?: number | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          reputation_score?: number | null
          total_earned?: number | null
          total_spent?: number | null
          trades_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cards_created?: number | null
          cards_owned?: number | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          reputation_score?: number | null
          total_earned?: number | null
          total_spent?: number | null
          trades_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_style_preferences: {
        Row: {
          created_at: string | null
          custom_parameters: Json | null
          id: string
          last_used_at: string | null
          style_id: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_parameters?: Json | null
          id?: string
          last_used_at?: string | null
          style_id: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_parameters?: Json | null
          id?: string
          last_used_at?: string | null
          style_id?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_style_preferences_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "crd_visual_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_style_unlocks: {
        Row: {
          id: string
          style_id: string
          unlock_metadata: Json | null
          unlock_method: Database["public"]["Enums"]["unlock_method"]
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          style_id: string
          unlock_metadata?: Json | null
          unlock_method: Database["public"]["Enums"]["unlock_method"]
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          style_id?: string
          unlock_metadata?: Json | null
          unlock_method?: Database["public"]["Enums"]["unlock_method"]
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_style_unlocks_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "crd_visual_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trade_preferences: {
        Row: {
          auto_accept_threshold: number | null
          blocked_users: string[] | null
          created_at: string | null
          id: string
          notification_preferences: Json | null
          preferred_trade_types: string[] | null
          surplus_cards: string[] | null
          updated_at: string | null
          user_id: string
          wishlist_cards: string[] | null
        }
        Insert: {
          auto_accept_threshold?: number | null
          blocked_users?: string[] | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_trade_types?: string[] | null
          surplus_cards?: string[] | null
          updated_at?: string | null
          user_id: string
          wishlist_cards?: string[] | null
        }
        Update: {
          auto_accept_threshold?: number | null
          blocked_users?: string[] | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_trade_types?: string[] | null
          surplus_cards?: string[] | null
          updated_at?: string | null
          user_id?: string
          wishlist_cards?: string[] | null
        }
        Relationships: []
      }
      user_watchlists: {
        Row: {
          alert_conditions: Json | null
          alert_enabled: boolean | null
          created_at: string | null
          id: string
          name: string
          search_criteria: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_conditions?: Json | null
          alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_conditions?: Json | null
          alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ux_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          setting_category: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_category: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_category?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_user_xp: {
        Args: {
          user_uuid: string
          points: number
          source: string
          source_ref_id?: string
          xp_metadata?: Json
        }
        Returns: Json
      }
      calculate_creator_earnings: {
        Args: { creator_uuid: string; start_date?: string; end_date?: string }
        Returns: {
          total_earnings: number
          pending_earnings: number
          paid_earnings: number
          transaction_count: number
        }[]
      }
      calculate_creator_performance_score: {
        Args: { creator_uuid: string }
        Returns: number
      }
      calculate_platform_fee: {
        Args: { amount: number }
        Returns: number
      }
      calculate_user_level: {
        Args: { total_xp: number }
        Returns: Json
      }
      cleanup_temp_card_analysis: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_collection_from_template: {
        Args: { template_id: string; collection_title: string; user_id: string }
        Returns: string
      }
      expire_old_trades: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_daily_challenges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_group_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_share_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_activity_feed: {
        Args: { user_uuid: string; limit_count?: number }
        Returns: {
          activity_id: string
          user_id: string
          username: string
          avatar_url: string
          activity_type: string
          target_id: string
          target_type: string
          activity_timestamp: string
          metadata: Json
          reaction_count: number
        }[]
      }
      get_collection_card_count: {
        Args: { collection_uuid: string }
        Returns: number
      }
      get_collection_follower_count: {
        Args: { collection_uuid: string }
        Returns: number
      }
      get_collection_stats: {
        Args: { collection_uuid: string }
        Returns: {
          total_cards: number
          unique_cards: number
          total_value: number
          completion_percentage: number
          last_updated: string
        }[]
      }
      get_creator_activity_feed: {
        Args: { creator_uuid: string; limit_count?: number }
        Returns: {
          activity_id: string
          creator_id: string
          creator_username: string
          activity_type: string
          activity_data: Json
          created_at: string
        }[]
      }
      get_current_user_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_platform_metrics: {
        Args: { days_back?: number }
        Returns: {
          metric_type: string
          current_value: number
          previous_value: number
          change_percentage: number
        }[]
      }
      get_trending_creators: {
        Args: { days_back?: number }
        Returns: {
          creator_id: string
          username: string
          activity_count: number
          follower_count: number
        }[]
      }
      get_user_cosmic_analytics: {
        Args: { user_uuid?: string }
        Returns: {
          total_sessions: number
          successful_alignments: number
          avg_alignment_score: number
          total_time_spent: number
          best_session: Json
        }[]
      }
      get_user_stats: {
        Args: { user_uuid: string }
        Returns: {
          total_cards: number
          total_collections: number
          total_followers: number
          total_following: number
          experience_points: number
          level: number
          achievements_count: number
        }[]
      }
      get_user_unlocked_styles: {
        Args: { user_uuid: string }
        Returns: {
          style_id: string
          display_name: string
          category: Database["public"]["Enums"]["visual_style_category"]
          unlocked_at: string
          unlock_method: Database["public"]["Enums"]["unlock_method"]
        }[]
      }
      has_admin_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
      increment_listing_views: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_feature_enabled: {
        Args: { flag_name: string; user_uuid?: string }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: string
      }
      optimize_listing_pricing: {
        Args: { listing_uuid: string }
        Returns: number
      }
      place_bid: {
        Args: { p_auction_id: string; p_amount: number; p_proxy_max?: number }
        Returns: string
      }
      process_creator_payouts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_gdpr_export: {
        Args: { user_uuid: string }
        Returns: Json
      }
      unlock_achievement: {
        Args: {
          user_uuid: string
          achievement_type_param: string
          achievement_name_param: string
          description_param: string
          points_param: number
          metadata_param?: Json
        }
        Returns: boolean
      }
      unlock_style_for_user: {
        Args: {
          user_uuid: string
          style_id_param: string
          unlock_method_param: Database["public"]["Enums"]["unlock_method"]
          metadata_param?: Json
        }
        Returns: boolean
      }
      update_market_analytics: {
        Args: { p_card_id: string; p_sale_price: number }
        Returns: undefined
      }
      update_seo_optimization: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      user_has_admin_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      user_has_style_unlocked: {
        Args: { user_uuid: string; style_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      card_rarity:
        | "common"
        | "uncommon"
        | "rare"
        | "epic"
        | "legendary"
        | "mythic"
      card_type:
        | "athlete"
        | "creature"
        | "spell"
        | "artifact"
        | "vehicle"
        | "character"
      media_type: "image" | "video" | "audio"
      notification_type:
        | "comment"
        | "reaction"
        | "follow"
        | "card_shared"
        | "collection_shared"
      reaction_type: "like" | "love" | "wow" | "laugh" | "angry" | "sad"
      unlock_method:
        | "free"
        | "subscription"
        | "points"
        | "marketplace"
        | "premium_template"
        | "achievement"
      visibility_type: "public" | "private" | "shared"
      visual_style_category:
        | "premium"
        | "metallic"
        | "specialty"
        | "atmospheric"
        | "classic"
        | "experimental"
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
      card_rarity: [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic",
      ],
      card_type: [
        "athlete",
        "creature",
        "spell",
        "artifact",
        "vehicle",
        "character",
      ],
      media_type: ["image", "video", "audio"],
      notification_type: [
        "comment",
        "reaction",
        "follow",
        "card_shared",
        "collection_shared",
      ],
      reaction_type: ["like", "love", "wow", "laugh", "angry", "sad"],
      unlock_method: [
        "free",
        "subscription",
        "points",
        "marketplace",
        "premium_template",
        "achievement",
      ],
      visibility_type: ["public", "private", "shared"],
      visual_style_category: [
        "premium",
        "metallic",
        "specialty",
        "atmospheric",
        "classic",
        "experimental",
      ],
    },
  },
} as const

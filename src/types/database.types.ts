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
      chapters: {
        Row: {
          chapter_code: string
          chapter_detailed_description: string | null
          chapter_name: string | null
          chapter_number: number | null
          chapter_short_description: string | null
          class: number | null
          created_at: string | null
          id: string
          learning_speed: string | null
          number_of_topics: number | null
          sub_subject: string | null
          subject: string | null
          tactical_strategy: string | null
          toughness: string | null
          updated_at: string | null
          weightage_percent: number | null
        }
        Insert: {
          chapter_code: string
          chapter_detailed_description?: string | null
          chapter_name?: string | null
          chapter_number?: number | null
          chapter_short_description?: string | null
          class?: number | null
          created_at?: string | null
          id?: string
          learning_speed?: string | null
          number_of_topics?: number | null
          sub_subject?: string | null
          subject?: string | null
          tactical_strategy?: string | null
          toughness?: string | null
          updated_at?: string | null
          weightage_percent?: number | null
        }
        Update: {
          chapter_code?: string
          chapter_detailed_description?: string | null
          chapter_name?: string | null
          chapter_number?: number | null
          chapter_short_description?: string | null
          class?: number | null
          created_at?: string | null
          id?: string
          learning_speed?: string | null
          number_of_topics?: number | null
          sub_subject?: string | null
          subject?: string | null
          tactical_strategy?: string | null
          toughness?: string | null
          updated_at?: string | null
          weightage_percent?: number | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      diagnostic_attempts: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_attempts_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_questions: {
        Row: {
          attempt_id: string
          concept: string | null
          correct_option: string
          created_at: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          topic_id: string
        }
        Insert: {
          attempt_id: string
          concept?: string | null
          correct_option: string
          created_at?: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          topic_id: string
        }
        Update: {
          attempt_id?: string
          concept?: string | null
          correct_option?: string
          created_at?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_questions_attempt_id_diagnostic_attempts_id_fk"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_questions_option_a_diagnostic_statement_bank_id_fk"
            columns: ["option_a"]
            isOneToOne: false
            referencedRelation: "diagnostic_statement_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_questions_option_b_diagnostic_statement_bank_id_fk"
            columns: ["option_b"]
            isOneToOne: false
            referencedRelation: "diagnostic_statement_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_questions_option_c_diagnostic_statement_bank_id_fk"
            columns: ["option_c"]
            isOneToOne: false
            referencedRelation: "diagnostic_statement_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_questions_option_d_diagnostic_statement_bank_id_fk"
            columns: ["option_d"]
            isOneToOne: false
            referencedRelation: "diagnostic_statement_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_questions_topic_id_chapters_chapter_code_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_code"]
          },
        ]
      }
      diagnostic_results: {
        Row: {
          attempt_id: string
          attempted_count: number
          concept_wise_performance: Json | null
          correct_count: number
          created_at: string
          id: string
          topic_wise_performance: Json | null
          total_questions: number
          weak_areas: Json | null
        }
        Insert: {
          attempt_id: string
          attempted_count?: number
          concept_wise_performance?: Json | null
          correct_count: number
          created_at?: string
          id?: string
          topic_wise_performance?: Json | null
          total_questions: number
          weak_areas?: Json | null
        }
        Update: {
          attempt_id?: string
          attempted_count?: number
          concept_wise_performance?: Json | null
          correct_count?: number
          created_at?: string
          id?: string
          topic_wise_performance?: Json | null
          total_questions?: number
          weak_areas?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_results_attempt_id_diagnostic_attempts_id_fk"
            columns: ["attempt_id"]
            isOneToOne: true
            referencedRelation: "diagnostic_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_statement_bank: {
        Row: {
          concept: string | null
          created_at: string
          id: string
          is_correct: boolean
          statement_text: string
          subject: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          concept?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          statement_text: string
          subject: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          concept?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          statement_text?: string
          subject?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      options: {
        Row: {
          answer_id: string
          created_at: string
          hint_image_url: string | null
          id: string
          is_correct: boolean
          option_hint: string | null
          option_text: string
          question_id: string
          updated_at: string
        }
        Insert: {
          answer_id: string
          created_at?: string
          hint_image_url?: string | null
          id?: string
          is_correct?: boolean
          option_hint?: string | null
          option_text: string
          question_id: string
          updated_at?: string
        }
        Update: {
          answer_id?: string
          created_at?: string
          hint_image_url?: string | null
          id?: string
          is_correct?: boolean
          option_hint?: string | null
          option_text?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          subject: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          subject: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          subject?: string
        }
        Relationships: []
      }
      plan_pricing: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          mrp_price: number
          offer_price: number
          plan_id: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          mrp_price: number
          offer_price: number
          plan_id: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          mrp_price?: number
          offer_price?: number
          plan_id?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_pricing_plan_id_plans_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          id: string
          is_active: boolean
          plan_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean
          plan_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          plan_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_sprint_plan_id: string | null
          attempt_count: number | null
          avatar_url: string | null
          average_mock_score: number | null
          chapter_strengths: Json | null
          city_events: boolean
          course_launch: boolean
          created_at: string
          current_class: string | null
          department_id: string | null
          diagnostic_data: Json | null
          email: boolean
          full_name: string | null
          generated_plan: Json | null
          has_paid: boolean | null
          id: string
          is_active: boolean | null
          last_neet_score: number | null
          newsletter: boolean
          onboarding_status: string
          otp_generated_at: string | null
          phone: boolean
          role: string
          sms: boolean
          subject_strengths: Json | null
          target_exam_year: number | null
          updated_at: string
        }
        Insert: {
          active_sprint_plan_id?: string | null
          attempt_count?: number | null
          avatar_url?: string | null
          average_mock_score?: number | null
          chapter_strengths?: Json | null
          city_events?: boolean
          course_launch?: boolean
          created_at?: string
          current_class?: string | null
          department_id?: string | null
          diagnostic_data?: Json | null
          email?: boolean
          full_name?: string | null
          generated_plan?: Json | null
          has_paid?: boolean | null
          id: string
          is_active?: boolean | null
          last_neet_score?: number | null
          newsletter?: boolean
          onboarding_status?: string
          otp_generated_at?: string | null
          phone?: boolean
          role?: string
          sms?: boolean
          subject_strengths?: Json | null
          target_exam_year?: number | null
          updated_at?: string
        }
        Update: {
          active_sprint_plan_id?: string | null
          attempt_count?: number | null
          avatar_url?: string | null
          average_mock_score?: number | null
          chapter_strengths?: Json | null
          city_events?: boolean
          course_launch?: boolean
          created_at?: string
          current_class?: string | null
          department_id?: string | null
          diagnostic_data?: Json | null
          email?: boolean
          full_name?: string | null
          generated_plan?: Json | null
          has_paid?: boolean | null
          id?: string
          is_active?: boolean | null
          last_neet_score?: number | null
          newsletter?: boolean
          onboarding_status?: string
          otp_generated_at?: string | null
          phone?: boolean
          role?: string
          sms?: boolean
          subject_strengths?: Json | null
          target_exam_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_sprint_plan_id_sprint_plans_id_fk"
            columns: ["active_sprint_plan_id"]
            isOneToOne: false
            referencedRelation: "sprint_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_department_id_departments_id_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          analytical_pct: number | null
          application_pct: number | null
          created_at: string
          difficulty_level: string | null
          id: string
          memorization_pct: number | null
          question_id: string
          question_img_url: string | null
          question_source: string | null
          question_text: string
          question_type: string | null
          question_use: string | null
          sub_chapter_code: string
          understanding_pct: number | null
          updated_at: string
        }
        Insert: {
          analytical_pct?: number | null
          application_pct?: number | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          memorization_pct?: number | null
          question_id: string
          question_img_url?: string | null
          question_source?: string | null
          question_text: string
          question_type?: string | null
          question_use?: string | null
          sub_chapter_code: string
          understanding_pct?: number | null
          updated_at?: string
        }
        Update: {
          analytical_pct?: number | null
          application_pct?: number | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          memorization_pct?: number | null
          question_id?: string
          question_img_url?: string | null
          question_source?: string | null
          question_text?: string
          question_type?: string | null
          question_use?: string | null
          sub_chapter_code?: string
          understanding_pct?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_sub_chapter_code_sub_chapters_sub_chapter_code_fk"
            columns: ["sub_chapter_code"]
            isOneToOne: false
            referencedRelation: "sub_chapters"
            referencedColumns: ["sub_chapter_code"]
          },
        ]
      }
      razorpay_orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          plan_id: string
          plan_pricing_id: string
          razorpay_order_id: string
          status: string
          user_id: string
          user_purchase_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          plan_id: string
          plan_pricing_id: string
          razorpay_order_id: string
          status: string
          user_id: string
          user_purchase_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          plan_id?: string
          plan_pricing_id?: string
          razorpay_order_id?: string
          status?: string
          user_id?: string
          user_purchase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "razorpay_orders_plan_id_plans_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "razorpay_orders_plan_pricing_id_plan_pricing_id_fk"
            columns: ["plan_pricing_id"]
            isOneToOne: false
            referencedRelation: "plan_pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "razorpay_orders_user_purchase_id_user_plan_purchases_id_fk"
            columns: ["user_purchase_id"]
            isOneToOne: false
            referencedRelation: "user_plan_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      razorpay_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string
          razorpay_signature: string | null
          status: string
          user_purchase_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id: string
          razorpay_signature?: string | null
          status: string
          user_purchase_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string
          razorpay_signature?: string | null
          status?: string
          user_purchase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "razorpay_payments_razorpay_order_id_razorpay_orders_razorpay_or"
            columns: ["razorpay_order_id"]
            isOneToOne: false
            referencedRelation: "razorpay_orders"
            referencedColumns: ["razorpay_order_id"]
          },
          {
            foreignKeyName: "razorpay_payments_user_purchase_id_user_plan_purchases_id_fk"
            columns: ["user_purchase_id"]
            isOneToOne: false
            referencedRelation: "user_plan_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          assigned_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          assigned_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          assigned_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_permissions_id_fk"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_roles_id_fk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          hierarchy_level: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hierarchy_level?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hierarchy_level?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          description: string | null
          updated_at: string
          value: string
          variable: string
        }
        Insert: {
          description?: string | null
          updated_at?: string
          value: string
          variable: string
        }
        Update: {
          description?: string | null
          updated_at?: string
          value?: string
          variable?: string
        }
        Relationships: []
      }
      sprint_plan_bonuses: {
        Row: {
          chapter_code: string
          created_at: string | null
          end_order: number
          id: string
          plan_id: string
          start_order: number
          subject: string
          updated_at: string | null
        }
        Insert: {
          chapter_code: string
          created_at?: string | null
          end_order: number
          id?: string
          plan_id: string
          start_order: number
          subject: string
          updated_at?: string | null
        }
        Update: {
          chapter_code?: string
          created_at?: string | null
          end_order?: number
          id?: string
          plan_id?: string
          start_order?: number
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprint_plan_bonuses_chapter_code_chapters_chapter_code_fk"
            columns: ["chapter_code"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_code"]
          },
          {
            foreignKeyName: "sprint_plan_bonuses_plan_id_sprint_plans_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "sprint_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sprint_plan_days: {
        Row: {
          biology_chapter_code: string | null
          biology_end_order: number | null
          biology_start_order: number | null
          chemistry_chapter_code: string | null
          chemistry_end_order: number | null
          chemistry_start_order: number | null
          created_at: string | null
          day_number: number
          id: string
          physics_chapter_code: string | null
          physics_end_order: number | null
          physics_start_order: number | null
          plan_id: string
          updated_at: string | null
        }
        Insert: {
          biology_chapter_code?: string | null
          biology_end_order?: number | null
          biology_start_order?: number | null
          chemistry_chapter_code?: string | null
          chemistry_end_order?: number | null
          chemistry_start_order?: number | null
          created_at?: string | null
          day_number: number
          id?: string
          physics_chapter_code?: string | null
          physics_end_order?: number | null
          physics_start_order?: number | null
          plan_id: string
          updated_at?: string | null
        }
        Update: {
          biology_chapter_code?: string | null
          biology_end_order?: number | null
          biology_start_order?: number | null
          chemistry_chapter_code?: string | null
          chemistry_end_order?: number | null
          chemistry_start_order?: number | null
          created_at?: string | null
          day_number?: number
          id?: string
          physics_chapter_code?: string | null
          physics_end_order?: number | null
          physics_start_order?: number | null
          plan_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprint_plan_days_biology_chapter_code_chapters_chapter_code_fk"
            columns: ["biology_chapter_code"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_code"]
          },
          {
            foreignKeyName: "sprint_plan_days_chemistry_chapter_code_chapters_chapter_code_f"
            columns: ["chemistry_chapter_code"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_code"]
          },
          {
            foreignKeyName: "sprint_plan_days_physics_chapter_code_chapters_chapter_code_fk"
            columns: ["physics_chapter_code"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_code"]
          },
          {
            foreignKeyName: "sprint_plan_days_plan_id_sprint_plans_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "sprint_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sprint_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sub_chapters: {
        Row: {
          chapter_code: string
          created_at: string | null
          english_video_url: string | null
          english_video_url_killer: string | null
          hinglish_video_url: string | null
          hinglish_video_url_killer: string | null
          id: string
          sub_chapter_code: string
          sub_chapter_name: string
          sub_chapter_order: number
          updated_at: string | null
        }
        Insert: {
          chapter_code: string
          created_at?: string | null
          english_video_url?: string | null
          english_video_url_killer?: string | null
          hinglish_video_url?: string | null
          hinglish_video_url_killer?: string | null
          id?: string
          sub_chapter_code: string
          sub_chapter_name: string
          sub_chapter_order: number
          updated_at?: string | null
        }
        Update: {
          chapter_code?: string
          created_at?: string | null
          english_video_url?: string | null
          english_video_url_killer?: string | null
          hinglish_video_url?: string | null
          hinglish_video_url_killer?: string | null
          id?: string
          sub_chapter_code?: string
          sub_chapter_name?: string
          sub_chapter_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_chapters_chapter_code_chapters_chapter_code_fk"
            columns: ["chapter_code"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_code"]
          },
        ]
      }
      user_plan_purchases: {
        Row: {
          created_at: string
          currency: string
          end_date: string
          id: string
          mrp_price: number
          paid_price: number
          plan_id: string
          plan_pricing_id: string
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          end_date: string
          id?: string
          mrp_price: number
          paid_price: number
          plan_id: string
          plan_pricing_id: string
          start_date: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          end_date?: string
          id?: string
          mrp_price?: number
          paid_price?: number
          plan_id?: string
          plan_pricing_id?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plan_purchases_plan_id_plans_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_plan_purchases_plan_pricing_id_plan_pricing_id_fk"
            columns: ["plan_pricing_id"]
            isOneToOne: false
            referencedRelation: "plan_pricing"
            referencedColumns: ["id"]
          },
        ]
      }
      user_questions: {
        Row: {
          correct_option_id: string | null
          created_at: string
          difficulty: string
          id: string
          is_correct: boolean | null
          question_id: string
          question_order: number
          selected_option_id: string | null
          session_id: string | null
          shown_at: string
          sub_chapter_id: string
          time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_option_id?: string | null
          created_at?: string
          difficulty: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          question_order: number
          selected_option_id?: string | null
          session_id?: string | null
          shown_at?: string
          sub_chapter_id: string
          time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_option_id?: string | null
          created_at?: string
          difficulty?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          question_order?: number
          selected_option_id?: string | null
          session_id?: string | null
          shown_at?: string
          sub_chapter_id?: string
          time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_questions_correct_option_id_fkey"
            columns: ["correct_option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["answer_id"]
          },
          {
            foreignKeyName: "user_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "user_questions_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["answer_id"]
          },
          {
            foreignKeyName: "user_questions_sub_chapter_id_fkey"
            columns: ["sub_chapter_id"]
            isOneToOne: false
            referencedRelation: "sub_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_roles_id_fk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_owner_exists: { Args: never; Returns: Json }
      check_system_status: { Args: never; Returns: Json }
      create_razorpay_order: {
        Args: {
          p_amount: number
          p_currency?: string
          p_plan_id: string
          p_plan_pricing_id: string
          p_razorpay_order_id: string
          p_user_id: string
        }
        Returns: string
      }
      debug_email_logs: {
        Args: never
        Returns: {
          created_at: string
          error_msg: string
          id: number
          response_body: string
          status: number
        }[]
      }
      generate_diagnostic_test: { Args: { p_user_id: string }; Returns: Json }
      get_user_department_id: { Args: { user_uuid: string }; Returns: string }
      get_user_id_by_email: { Args: { p_email: string }; Returns: string }
      get_user_strategy_data: {
        Args: { p_user_id: string }
        Returns: {
          chapter_name: string
          progress: number
          subject: string
        }[]
      }
      is_app_admin: { Args: never; Returns: boolean }
      is_maintenance_mode: { Args: never; Returns: boolean }
      lookup_user_by_phone: { Args: { p_phone: string }; Returns: Json }
      process_payment_success: {
        Args: {
          p_duration_days: number
          p_mrp_price: number
          p_paid_price: number
          p_plan_id: string
          p_plan_pricing_id: string
          p_razorpay_order_id: string
          p_razorpay_payment_id: string
          p_razorpay_signature: string
          p_user_id: string
        }
        Returns: string
      }
      reset_practice_session: {
        Args: { p_questions: Json; p_sub_chapter_id: string; p_user_id: string }
        Returns: {
          id: string
          question_id: string
          question_order: number
        }[]
      }
      send_email: {
        Args: {
          from_email: string
          html_body: string
          subject: string
          to_email: string
        }
        Returns: string
      }
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

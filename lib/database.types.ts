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
      exams: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          is_active: boolean
          chat_question_index: number | null
          participant_id: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          is_active?: boolean
          chat_question_index?: number | null
          participant_id?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          is_active?: boolean
          chat_question_index?: number | null
          participant_id?: string | null
          metadata?: Json
        }
      }
      questions: {
        Row: {
          id: string
          exam_id: string
          created_at: string
          order_index: number
          question_text: string
          question_type: string
          options: Json | null
          metadata: Json
        }
        Insert: {
          id?: string
          exam_id?: string
          created_at?: string
          order_index: number
          question_text: string
          question_type: string
          options?: Json | null
          metadata?: Json
        }
        Update: {
          id?: string
          exam_id?: string
          created_at?: string
          order_index?: number
          question_text?: string
          question_type?: string
          options?: Json | null
          metadata?: Json
        }
      }
      chat_messages: {
        Row: {
          id: string
          exam_id: string
          created_at: string
          sender: 'admin' | 'participant'
          message: string
          is_read: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          exam_id: string
          created_at?: string
          sender: 'admin' | 'participant'
          message: string
          is_read?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          exam_id?: string
          created_at?: string
          sender?: 'admin' | 'participant'
          message?: string
          is_read?: boolean
          metadata?: Json
        }
      }
      participant_answers: {
        Row: {
          id: string
          exam_id: string
          question_id: string
          created_at: string
          updated_at: string
          answer_text: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          exam_id: string
          question_id: string
          created_at?: string
          updated_at?: string
          answer_text?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          exam_id?: string
          question_id?: string
          created_at?: string
          updated_at?: string
          answer_text?: string | null
          metadata?: Json
        }
      }
    }
  }
}

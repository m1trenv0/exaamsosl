import { z } from 'zod'

// Question Types
export const questionTypeEnum = z.enum(['multiple_choice', 'text', 'essay', 'code'])

export const questionSchema = z.object({
  id: z.string().uuid().optional(),
  exam_id: z.string().uuid().optional(),
  order_index: z.number().int().min(0),
  question_text: z.string().min(1, 'Question text is required'),
  question_type: questionTypeEnum,
  options: z.object({
    options: z.array(z.string()).optional(),
    correct: z.number().int().optional(),
  }).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const questionsArraySchema = z.object({
  questions: z.array(questionSchema),
})

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string().uuid().optional(),
  exam_id: z.string().uuid(),
  sender: z.enum(['admin', 'participant']),
  message: z.string().min(1, 'Message cannot be empty'),
  is_read: z.boolean().optional(),
  created_at: z.string().optional(),
})

// Exam Schema
export const examSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Exam title is required'),
  is_active: z.boolean().default(true),
  chat_question_index: z.number().int().min(0).nullable(),
  participant_id: z.string().optional(),
})

// Answer Schema
export const answerSchema = z.object({
  question_id: z.string().uuid(),
  answer_text: z.string(),
})

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Export types
export type Question = z.infer<typeof questionSchema>
export type QuestionsArray = z.infer<typeof questionsArraySchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type Exam = z.infer<typeof examSchema>
export type Answer = z.infer<typeof answerSchema>
export type AdminLogin = z.infer<typeof adminLoginSchema>

// Example JSON format for importing questions
export const EXAMPLE_QUESTIONS_JSON = {
  questions: [
    {
      order_index: 0,
      question_text: "What is the capital of France?",
      question_type: "multiple_choice",
      options: {
        options: ["London", "Paris", "Berlin", "Madrid"],
        correct: 1
      }
    },
    {
      order_index: 1,
      question_text: "Explain the concept of closure in JavaScript.",
      question_type: "essay",
    },
    {
      order_index: 2,
      question_text: "Write a function to reverse a string.",
      question_type: "code",
    }
  ]
}

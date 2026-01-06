import { z } from 'zod'

// Question Types
export const questionTypeEnum = z.enum([
  'multiple_choice', 
  'text', 
  'essay', 
  'code',
  'true_false',
  'multiple_select',
  'categorization',
  'essay_rich'
])

export const questionSchema = z.object({
  id: z.string().uuid().optional(),
  exam_id: z.string().uuid().optional(),
  order_index: z.number().int().min(0),
  question_text: z.string().min(1, 'Question text is required'),
  question_type: questionTypeEnum,
  options: z.object({
    options: z.array(z.string()).optional(),
    correct: z.union([z.number().int(), z.array(z.number().int())]).optional(),
    categories: z.array(z.object({
      name: z.string(),
      items: z.array(z.string())
    })).optional(),
    possibleAnswers: z.array(z.string()).optional(),
    wordLimit: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional()
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
export const EXAMPLE_QUESTIONS_JSON = JSON.stringify({
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
      question_text: "Select all programming languages:",
      question_type: "multiple_select",
      options: {
        options: ["JavaScript", "HTML", "Python", "CSS", "Java"],
        correct: [0, 2, 4]
      }
    },
    {
      order_index: 2,
      question_text: "JavaScript is a compiled language.",
      question_type: "true_false",
      options: {
        correct: 1
      }
    },
    {
      order_index: 3,
      question_text: "Match colors with shapes:",
      question_type: "categorization",
      options: {
        categories: [
          { name: "Colors", items: ["Red", "Blue"] },
          { name: "Shapes", items: ["Square", "Circle"] }
        ],
        possibleAnswers: ["Red", "Blue", "Square", "Circle", "Green"]
      }
    },
    {
      order_index: 4,
      question_text: "Explain the concept of closure in JavaScript.",
      question_type: "essay_rich",
      options: {
        wordLimit: { min: 100, max: 150 }
      }
    },
    {
      order_index: 5,
      question_text: "Write a function to reverse a string.",
      question_type: "code",
    }
  ]
}, null, 2)

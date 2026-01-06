import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { withAccelerate } from '@prisma/extension-accelerate'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create exam
  const exam = await prisma.exams.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Programming Fundamentals Exam',
      is_active: true,
      chat_question_index: 4,
    },
  })
  console.log('✅ Created exam:', exam.title)

  // 2. Create questions
  const questions = [
    {
      order_index: 1,
      question_text: 'What is the primary purpose of version control systems?',
      question_type: 'multiple_choice',
      options: {
        options: [
          'To compile code faster',
          'To track changes and collaborate',
          'To debug applications',
          'To deploy websites'
        ],
        correct: 1
      }
    },
    {
      order_index: 2,
      question_text: 'Explain the difference between var, let, and const in JavaScript.',
      question_type: 'essay',
      options: null
    },
    {
      order_index: 3,
      question_text: 'What does HTTP stand for?',
      question_type: 'text',
      options: null
    },
    {
      order_index: 4,
      question_text: 'Which data structure uses LIFO (Last In First Out)?',
      question_type: 'multiple_choice',
      options: {
        options: ['Queue', 'Stack', 'Array', 'Hash Table'],
        correct: 1
      }
    },
    {
      order_index: 5,
      question_text: 'Write a function to reverse a string in JavaScript.',
      question_type: 'code',
      options: null
    },
  ]

  for (const q of questions) {
    await prisma.questions.create({
      data: {
        exam_id: exam.id,
        ...q,
      },
    })
  }
  console.log('✅ Created', questions.length, 'questions')

  // 3. Create admin user in Supabase Auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const adminExists = existingUser?.users.some(u => u.email === 'admin@exam.local')

    if (!adminExists) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@exam.local',
        password: 'admin123',
        email_confirm: true,
      })

      if (error) {
        console.log('⚠️  Could not create admin user:', error.message)
        console.log('   Create manually in Supabase Dashboard > Authentication > Users')
      } else {
        console.log('✅ Created admin user:', data.user?.email)
      }
    } else {
      console.log('ℹ️  Admin user already exists')
    }
  } else {
    console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not found')
    console.log('   Create admin manually:')
    console.log('   Email: admin@exam.local')
    console.log('   Password: admin123')
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

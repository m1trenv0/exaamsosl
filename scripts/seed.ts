import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create exam
  const { data: existingExam } = await supabase
    .from('exams')
    .select('id')
    .eq('is_active', true)
    .single()

  let examId: string

  if (existingExam) {
    examId = existingExam.id
    console.log('ℹ️  Active exam already exists')
  } else {
    const { data: newExam, error: examError } = await supabase
      .from('exams')
      .insert({
        title: 'Programming Fundamentals Exam',
        is_active: true,
        chat_question_index: 4,
      })
      .select()
      .single()

    if (examError) throw examError
    examId = newExam.id
    console.log('✅ Created exam:', newExam.title)
  }

  // 2. Check if questions exist
  const { data: existingQuestions } = await supabase
    .from('questions')
    .select('id')
    .eq('exam_id', examId)

  if (!existingQuestions || existingQuestions.length === 0) {
    // Create questions
    const questions = [
      {
        exam_id: examId,
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
        exam_id: examId,
        order_index: 2,
        question_text: 'Explain the difference between var, let, and const in JavaScript.',
        question_type: 'essay',
        options: null
      },
      {
        exam_id: examId,
        order_index: 3,
        question_text: 'What does HTTP stand for?',
        question_type: 'text',
        options: null
      },
      {
        exam_id: examId,
        order_index: 4,
        question_text: 'Which data structure uses LIFO (Last In First Out)?',
        question_type: 'multiple_choice',
        options: {
          options: ['Queue', 'Stack', 'Array', 'Hash Table'],
          correct: 1
        }
      },
      {
        exam_id: examId,
        order_index: 5,
        question_text: 'Write a function to reverse a string in JavaScript.',
        question_type: 'code',
        options: null
      },
    ]

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questions)

    if (questionsError) throw questionsError
    console.log('✅ Created', questions.length, 'questions')
  } else {
    console.log('ℹ️  Questions already exist')
  }

  // 3. Create admin user
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const adminExists = existingUsers?.users.some(u => u.email === 'admin@exam.local')

    if (!adminExists) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@exam.local',
        password: 'admin123',
        email_confirm: true,
      })

      if (error) {
        console.log('⚠️  Could not create admin user:', error.message)
        console.log('   Go to Supabase Dashboard > Authentication > Users')
        console.log('   Email: admin@exam.local, Password: admin123')
      } else {
        console.log('✅ Created admin user:', data.user?.email)
      }
    } else {
      console.log('ℹ️  Admin user already exists')
    }
  } else {
    console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not set')
    console.log('   Create admin manually in Supabase Dashboard:')
    console.log('   Email: admin@exam.local')
    console.log('   Password: admin123')
  }

  console.log('\n✨ Seeding completed!')
  console.log('\n📍 Access URLs:')
  console.log('   Exam: http://localhost:3000')
  console.log('   Admin: http://localhost:3000/admin')
  console.log('\n🔐 Admin credentials:')
  console.log('   Email: admin@exam.local')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })

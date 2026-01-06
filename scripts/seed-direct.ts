import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.env.local' })

const { Client } = pg

async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('🌱 Заполнение базы данных...\n')

    // 1. Создаем или получаем активный экзамен
    const examResult = await client.query(`
      INSERT INTO exams (title, is_active, chat_question_index)
      VALUES ('Programming Fundamentals Exam', true, 4)
      ON CONFLICT DO NOTHING
      RETURNING id
    `)

    let examId: string

    if (examResult.rows.length > 0) {
      examId = examResult.rows[0].id
      console.log('✅ Создан экзамен:', examId)
    } else {
      // Получаем существующий
      const existing = await client.query(`
        SELECT id FROM exams WHERE is_active = true LIMIT 1
      `)
      examId = existing.rows[0].id
      console.log('ℹ️  Используется существующий экзамен:', examId)
    }

    // 2. Проверяем есть ли вопросы
    const questionCount = await client.query(`
      SELECT COUNT(*) as count FROM questions WHERE exam_id = $1
    `, [examId])

    if (parseInt(questionCount.rows[0].count) === 0) {
      // Создаем вопросы
      const questions = [
        {
          order_index: 1,
          question_text: 'What is the primary purpose of version control systems?',
          question_type: 'multiple_choice',
          options: JSON.stringify({
            options: [
              'To compile code faster',
              'To track changes and collaborate',
              'To debug applications',
              'To deploy websites'
            ],
            correct: 1
          })
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
          options: JSON.stringify({
            options: ['Queue', 'Stack', 'Array', 'Hash Table'],
            correct: 1
          })
        },
        {
          order_index: 5,
          question_text: 'Write a function to reverse a string in JavaScript.',
          question_type: 'code',
          options: null
        },
        {
          order_index: 6,
          question_text: 'What is the difference between == and === in JavaScript?',
          question_type: 'essay',
          options: null
        },
        {
          order_index: 7,
          question_text: 'Which HTTP method is used to retrieve data?',
          question_type: 'multiple_choice',
          options: JSON.stringify({
            options: ['POST', 'GET', 'PUT', 'DELETE'],
            correct: 1
          })
        },
      ]

      for (const q of questions) {
        await client.query(`
          INSERT INTO questions (exam_id, order_index, question_text, question_type, options)
          VALUES ($1, $2, $3, $4, $5)
        `, [examId, q.order_index, q.question_text, q.question_type, q.options])
      }

      console.log(`✅ Создано ${questions.length} вопросов`)
    } else {
      console.log('ℹ️  Вопросы уже существуют')
    }

    console.log('\n✨ База данных готова!\n')
    console.log('📍 Теперь получите ANON_KEY:')
    console.log('   1. Откройте: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/settings/api')
    console.log('   2. Скопируйте "anon" "public" ключ')
    console.log('   3. Обновите .env.local:\n')
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (ваш ключ)\n')
    console.log('📍 Создайте администратора:')
    console.log('   1. Откройте: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/auth/users')
    console.log('   2. Add user → Create new user')
    console.log('   3. Email: admin@exam.local')
    console.log('   4. Password: admin123\n')
    console.log('🚀 Затем запустите: npm run dev')
    console.log('   Админка: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

seedDatabase()

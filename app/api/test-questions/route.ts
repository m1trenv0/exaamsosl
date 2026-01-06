import { NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function GET() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()

    const examResult = await client.query(`
      SELECT * FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'No active exam found' }, { status: 404 })
    }

    const exam = examResult.rows[0]

    const questionsResult = await client.query(`
      SELECT * FROM questions 
      WHERE exam_id = $1 
      ORDER BY order_index ASC
    `, [exam.id])

    // Check specific questions
    const q10 = questionsResult.rows.find(q => q.order_index === 10)
    const q11 = questionsResult.rows.find(q => q.order_index === 11)
    const q13 = questionsResult.rows.find(q => q.order_index === 13)

    return NextResponse.json({
      summary: {
        total: questionsResult.rows.length,
        exam_title: exam.title,
      },
      samples: {
        q10: {
          type: q10?.question_type,
          has_options: !!q10?.options,
          options_type: typeof q10?.options,
          options_count: q10?.options?.options?.length,
          correct: q10?.options?.correct,
        },
        q11: {
          type: q11?.question_type,
          has_options: !!q11?.options,
          options_count: q11?.options?.options?.length,
        },
        q13: {
          type: q13?.question_type,
          has_options: !!q13?.options,
          correct: q13?.options?.correct,
        },
      },
      full_q10: q10,
      full_q11: q11,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to load exam' }, { status: 500 })
  } finally {
    await client.end()
  }
}

import { NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function GET() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()

    const result = await client.query(`
      SELECT id, order_index, question_type, options 
      FROM questions 
      WHERE order_index IN (0, 10, 11, 13)
      ORDER BY order_index
    `)

    const debug = result.rows.map(row => ({
      order_index: row.order_index,
      question_type: row.question_type,
      has_options: !!row.options,
      options_type: typeof row.options,
      options_value: row.options,
      options_is_object: row.options !== null && typeof row.options === 'object',
      options_has_array: row.options?.options ? Array.isArray(row.options.options) : false,
    }))

    return NextResponse.json({
      debug,
      raw: result.rows
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  } finally {
    await client.end()
  }
}

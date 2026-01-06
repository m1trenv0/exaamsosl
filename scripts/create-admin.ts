import { config } from 'dotenv'
import pg from 'pg'
import bcrypt from 'bcryptjs'

config({ path: '.env.local' })

const { Client } = pg

async function createUsersTable() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('🔧 Создание таблицы users...\n')

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    console.log('✅ Таблица users создана')

    // Check if admin exists
    const existing = await client.query(`
      SELECT id FROM users WHERE email = 'admin@exam.local' LIMIT 1
    `)

    if (existing.rows.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await client.query(`
        INSERT INTO users (email, password, name, role)
        VALUES ($1, $2, $3, $4)
      `, ['admin@exam.local', hashedPassword, 'Admin', 'admin'])

      console.log('✅ Создан администратор:')
      console.log('   Email: admin@exam.local')
      console.log('   Password: admin123\n')
    } else {
      console.log('ℹ️  Администратор уже существует\n')
    }

    console.log('✨ Готово! Запустите: npm run dev')
    console.log('   Админка: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

createUsersTable()

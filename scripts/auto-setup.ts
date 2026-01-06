import { config } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import pg from 'pg'

config({ path: '.env.local' })

const { Client } = pg

async function getAnonKey() {
  console.log('🔍 Получаю ANON_KEY из базы данных...\n')

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✅ Подключено к базе данных')

    // Get anon key from Supabase auth schema
    const result = await client.query(`
      SELECT decrypted_secret 
      FROM vault.decrypted_secrets 
      WHERE name = 'anon_key' 
      LIMIT 1
    `)

    if (result.rows.length > 0) {
      const anonKey = result.rows[0].decrypted_secret
      console.log('✅ ANON_KEY найден!')
      
      // Update .env.local
      let envContent = readFileSync('.env.local', 'utf-8')
      envContent = envContent.replace(
        /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
        `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
      )
      writeFileSync('.env.local', envContent)
      
      console.log('✅ .env.local обновлен\n')
      return true
    } else {
      console.log('⚠️  ANON_KEY не найден в базе')
      return false
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('⚠️  Не удалось получить ключ из базы:', error.message)
    }
    return false
  } finally {
    await client.end()
  }
}

// Функция для генерации временного ключа (fallback)
async function useManualKey() {
  console.log('\n📋 ПОЛУЧИТЕ ANON_KEY ВРУЧНУЮ:\n')
  console.log('1. Откройте: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/settings/api')
  console.log('2. Скопируйте "anon" "public" ключ')
  console.log('3. Замените в .env.local:\n')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (ваш ключ)\n')
  console.log('4. Запустите: npm run db:seed\n')
}

async function main() {
  const success = await getAnonKey()
  
  if (success) {
    console.log('🌱 Запускаю seed...\n')
    const { spawn } = await import('child_process')
    const seed = spawn('npm', ['run', 'db:seed'], {
      stdio: 'inherit',
      shell: true,
    })
    
    seed.on('close', (code) => {
      if (code === 0) {
        console.log('\n✨ ВСЁ ГОТОВО!')
        console.log('\n📍 Запустите: npm run dev')
        console.log('   Админка: http://localhost:3000/admin')
        console.log('   Логин: admin@exam.local')
        console.log('   Пароль: admin123\n')
      }
      process.exit(code || 0)
    })
  } else {
    await useManualKey()
    process.exit(1)
  }
}

main().catch(console.error)

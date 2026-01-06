import { config } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { createInterface } from 'readline'

config({ path: '.env.local' })

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function setup() {
  console.log('\n🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА SUPABASE\n')
  
  const currentKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (currentKey && currentKey !== 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.log('✅ ANON_KEY уже настроен!')
    console.log('Key:', currentKey.substring(0, 20) + '...')
    rl.close()
    return
  }

  console.log('❌ ANON_KEY не найден в .env.local\n')
  console.log('📋 ИНСТРУКЦИЯ:')
  console.log('1. Открывается браузер с Supabase Dashboard')
  console.log('2. Войдите в свой аккаунт')
  console.log('3. Скопируйте "anon public" ключ')
  console.log('4. Вставьте сюда\n')

  const answer = await question('Открыть Dashboard? (y/n): ')
  
  if (answer.toLowerCase() === 'y') {
    const projectRef = 'tsfhzvyeifrlxytzejbh'
    const url = `https://supabase.com/dashboard/project/${projectRef}/settings/api`
    
    console.log('\n🌐 Открываю:', url)
    
    // Open browser
    const { exec } = await import('child_process')
    const command = process.platform === 'win32' 
      ? `start ${url}`
      : process.platform === 'darwin'
      ? `open ${url}`
      : `xdg-open ${url}`
    
    exec(command)
    
    console.log('\n📝 Скопируйте "anon public" ключ и вставьте ниже:')
  }
  
  const anonKey = await question('\nANON_KEY: ')
  
  if (!anonKey || anonKey.length < 50) {
    console.log('❌ Неправильный ключ')
    rl.close()
    return
  }

  // Update .env.local
  const envPath = '.env.local'
  let envContent = readFileSync(envPath, 'utf-8')
  
  envContent = envContent.replace(
    /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
  )
  
  writeFileSync(envPath, envContent)
  
  console.log('\n✅ ANON_KEY сохранен в .env.local')
  console.log('\n🌱 Запускаю seed...\n')
  
  rl.close()
  
  // Run seed
  const { spawn } = await import('child_process')
  const seed = spawn('npm', ['run', 'db:seed'], {
    stdio: 'inherit',
    shell: true,
  })
  
  seed.on('close', (code) => {
    if (code === 0) {
      console.log('\n✨ ВСЁ ГОТОВО!\n')
      console.log('Запустите: npm run dev')
      console.log('Админка: http://localhost:3000/admin')
      console.log('Логин: admin@exam.local')
      console.log('Пароль: admin123')
    }
    process.exit(code || 0)
  })
}

setup().catch(console.error)

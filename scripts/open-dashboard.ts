import { exec } from 'child_process'

const urls = {
  api: 'https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/settings/api',
  auth: 'https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/auth/users',
}

console.log('\n🌐 Открываю браузер...\n')
console.log('📝 ШАГ 1: Получите ANON_KEY')
console.log('   Копируем "anon" "public" ключ\n')

// Open API settings
const command = process.platform === 'win32'
  ? `start ${urls.api}`
  : process.platform === 'darwin'
  ? `open ${urls.api}`
  : `xdg-open ${urls.api}`

exec(command, (error) => {
  if (!error) {
    console.log('✅ Открыта страница API Settings')
    console.log('\n⏳ Через 5 секунд откроется страница создания пользователя...\n')
    
    setTimeout(() => {
      const authCommand = process.platform === 'win32'
        ? `start ${urls.auth}`
        : process.platform === 'darwin'
        ? `open ${urls.auth}`
        : `xdg-open ${urls.auth}`
      
      exec(authCommand, (error2) => {
        if (!error2) {
          console.log('✅ Открыта страница Authentication\n')
          console.log('📝 ШАГ 2: Создайте администратора')
          console.log('   Email: admin@exam.local')
          console.log('   Password: admin123\n')
          console.log('📝 ШАГ 3: Обновите .env.local')
          console.log('   Замените YOUR_SUPABASE_ANON_KEY_HERE на скопированный ключ\n')
          console.log('🚀 ШАГ 4: Запустите npm run dev\n')
        }
      })
    }, 5000)
  }
})

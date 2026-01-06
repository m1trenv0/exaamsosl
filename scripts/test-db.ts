import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.env.local' })

const { Client } = pg

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✅ Подключено к PostgreSQL\n')

    // Проверяем версию
    const version = await client.query('SELECT version()')
    console.log('PostgreSQL:', version.rows[0].version.split(' ').slice(0, 2).join(' '))

    // Проверяем текущую схему
    const schema = await client.query('SELECT current_schema()')
    console.log('Current schema:', schema.rows[0].current_schema)

    // Проверяем доступные схемы
    const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('auth', 'vault', 'public', 'pgsodium')
    `)
    console.log('\nДоступные схемы:', schemas.rows.map(r => r.schema_name).join(', '))

    // Пробуем получить ключи разными способами
    console.log('\n🔍 Поиск API ключей...\n')

    try {
      const secrets = await client.query(`
        SELECT name, description 
        FROM vault.secrets 
        LIMIT 5
      `)
      console.log('Vault secrets:', secrets.rows)
    } catch (e) {
      console.log('⚠️  Нет доступа к vault.secrets')
    }

    try {
      const authConfig = await client.query(`
        SELECT * FROM auth.config LIMIT 1
      `)
      console.log('Auth config:', authConfig.rows)
    } catch (e) {
      console.log('⚠️  Нет доступа к auth.config')
    }

    // Проверяем таблицы в public
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)
    console.log('\nТаблицы в public:', tables.rows.map(r => r.tablename).join(', '))

    console.log('\n✅ База данных готова!')
    console.log('\n💡 Для получения ANON_KEY:')
    console.log('   https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/settings/api')

  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await client.end()
  }
}

testConnection()

# Password Authentication System

Система аутентификации экзамена через пароль с ручным подтверждением в админке.

## Функционал

### Для студента:
- При входе на экзамен показывается модалка с вводом имени и пароля
- После отправки показывается loading state с текстом "Waiting for approval..."
- Студент ждет пока админ подтвердит или отклонит доступ
- При подтверждении - открывается экзамен
- При отклонении - показывается сообщение об отказе

### Для админа:
- В админ-панели появляется раздел "Password Approval" (первым в списке)
- Показываются все pending запросы с:
  - Именем студента
  - Паролем который он ввёл
  - Названием экзамена
  - Временем запроса
- Админ может:
  - ✓ Approve - подтвердить доступ
  - ✕ Decline - отклонить доступ
- История всех рассмотренных запросов отображается ниже

## Установка

### 1. Запустить миграцию базы данных

```bash
npx tsx scripts/run-password-migration.ts
```

Эта команда создаст таблицу `password_attempts` и добавит поле `exam_password` в таблицу `exams`.

### 2. Альтернативный способ (если скрипт не работает)

Выполнить SQL напрямую в Supabase:

```sql
-- Открыть файл supabase/migration-add-password-attempts.sql
-- И выполнить его в SQL Editor на Supabase Dashboard
```

## Компоненты

### Созданные файлы:

1. **components/exam/PasswordPrompt.tsx** - модалка ввода пароля для студента
2. **components/admin/PasswordApproval.tsx** - управление запросами в админке
3. **app/api/exam/password/route.ts** - API для отправки и проверки статуса пароля
4. **app/api/admin/password-attempts/route.ts** - API для админа (получение и обновление статуса)
5. **supabase/migration-add-password-attempts.sql** - SQL миграция

### Обновленные файлы:

1. **components/exam/ExamInterface.tsx** - добавлена логика показа PasswordPrompt
2. **components/admin/AdminDashboard.tsx** - добавлен раздел Password Approval
3. **prisma/schema.prisma** - добавлена модель password_attempts

## Использование

### Студент:
1. Открывает страницу экзамена
2. Видит модалку "Enter Exam Credentials"
3. Вводит имя и пароль
4. Нажимает "Submit"
5. Видит состояние загрузки "Waiting for approval..."
6. Ждет решения админа (проверка каждые 2 секунды)

### Админ:
1. Открывает админ-панель
2. Видит секцию "Password Approval" вверху
3. Видит новые запросы в желтых карточках
4. Нажимает "✓ Approve" или "✕ Decline"
5. Запрос перемещается в "Reviewed Attempts"

## Технические детали

- **Polling interval**: 2 секунды для студента, 5 секунд для админа
- **Статусы**: pending, approved, declined
- **Автообновление**: админка автоматически обновляет список каждые 5 секунд
- **Стиль модалки**: такой же как у "Exit application" (компактный, с тенью, центрированный)

## База данных

### Таблица password_attempts:
```sql
- id (UUID)
- exam_id (UUID) -> связь с exams
- participant_name (VARCHAR 255)
- password_entered (VARCHAR 255)
- status (VARCHAR 50) - pending/approved/declined
- created_at (TIMESTAMP)
- reviewed_at (TIMESTAMP nullable)
- reviewed_by (VARCHAR 255 nullable)
```

### Обновление exams:
```sql
- exam_password (VARCHAR 255 nullable) - для будущего использования
```

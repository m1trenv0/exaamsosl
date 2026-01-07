# Применение миграции для Password System

## Шаг 1: Выполнить SQL миграцию

Откройте Supabase Dashboard и выполните следующий SQL:

```sql
-- Add password attempts table for exam authentication
CREATE TABLE IF NOT EXISTS password_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  participant_name VARCHAR(255) NOT NULL,
  password_entered VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by VARCHAR(255)
);

CREATE INDEX idx_password_attempts_exam_id ON password_attempts(exam_id);
CREATE INDEX idx_password_attempts_status ON password_attempts(status);

ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_password VARCHAR(255);
```

## Шаг 2: Запустить приложение

```bash
npm run dev
```

## Готово!

Теперь:
- При открытии экзамена студент увидит модалку ввода пароля
- В админке появится раздел "Password Approval" для подтверждения доступа

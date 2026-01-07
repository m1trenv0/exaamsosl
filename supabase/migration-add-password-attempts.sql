-- Add password attempts table for exam authentication
CREATE TABLE IF NOT EXISTS password_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  participant_name VARCHAR(255) NOT NULL,
  password_entered VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, declined
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by VARCHAR(255)
);

CREATE INDEX idx_password_attempts_exam_id ON password_attempts(exam_id);
CREATE INDEX idx_password_attempts_status ON password_attempts(status);

-- Add password field to exams table
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_password VARCHAR(255);

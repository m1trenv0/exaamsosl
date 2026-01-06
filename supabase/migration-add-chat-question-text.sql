-- Add chat_question_text column to exams table
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS chat_question_text TEXT;

-- Update comment for the column
COMMENT ON COLUMN exams.chat_question_text IS 'Text of the question that appears next to the chat';

-- Supabase Database Schema for Fake Exam Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Exams Configuration Table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL DEFAULT 'Practice Exam',
  is_active BOOLEAN DEFAULT TRUE,
  chat_question_index INTEGER, -- Which question contains the hidden chat (0-based index)
  participant_id TEXT, -- Unique identifier for the participant session
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_index INTEGER NOT NULL, -- 0-based question order
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'text', 'essay', 'code')),
  options JSONB, -- For multiple choice: {"options": ["A", "B", "C"], "correct": 0}
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender TEXT NOT NULL CHECK (sender IN ('admin', 'participant')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Participant Answers Table
CREATE TABLE participant_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answer_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(exam_id, question_id)
);

-- Create indexes for performance
CREATE INDEX idx_questions_exam_id ON questions(exam_id);
CREATE INDEX idx_questions_order ON questions(exam_id, order_index);
CREATE INDEX idx_chat_messages_exam_id ON chat_messages(exam_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_participant_answers_exam_id ON participant_answers(exam_id);

-- Enable Row Level Security (RLS)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (participant side)
-- Participants can read active exams
CREATE POLICY "Anyone can view active exams"
  ON exams FOR SELECT
  USING (is_active = TRUE);

-- Participants can read questions for active exams
CREATE POLICY "Anyone can view questions for active exams"
  ON questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM exams 
    WHERE exams.id = questions.exam_id 
    AND exams.is_active = TRUE
  ));

-- Participants can view chat messages for their exam
CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  USING (TRUE);

-- Participants can insert chat messages
CREATE POLICY "Anyone can send chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (sender = 'participant');

-- Participants can insert/update their answers
CREATE POLICY "Anyone can submit answers"
  ON participant_answers FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can update their answers"
  ON participant_answers FOR UPDATE
  USING (TRUE);

-- Admin policies (authenticated users have full access)
CREATE POLICY "Authenticated users can do everything on exams"
  ON exams FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on questions"
  ON questions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on chat_messages"
  ON chat_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on participant_answers"
  ON participant_answers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participant_answers_updated_at
  BEFORE UPDATE ON participant_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default exam
INSERT INTO exams (title, is_active, chat_question_index) 
VALUES ('Practice Exam EN', TRUE, 10);

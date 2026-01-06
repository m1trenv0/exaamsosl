-- Migration to add sender column to chat_messages table if it doesn't exist

-- Check if sender column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'chat_messages' 
    AND column_name = 'sender'
  ) THEN
    ALTER TABLE chat_messages 
    ADD COLUMN sender TEXT NOT NULL DEFAULT 'participant' 
    CHECK (sender IN ('admin', 'participant'));
    
    -- Update existing rows if any
    UPDATE chat_messages SET sender = 'participant' WHERE sender IS NULL;
  END IF;
END $$;

-- Check if is_read column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'chat_messages' 
    AND column_name = 'is_read'
  ) THEN
    ALTER TABLE chat_messages 
    ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Ensure the check constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chat_messages_sender_check'
  ) THEN
    ALTER TABLE chat_messages 
    ADD CONSTRAINT chat_messages_sender_check 
    CHECK (sender IN ('admin', 'participant'));
  END IF;
END $$;

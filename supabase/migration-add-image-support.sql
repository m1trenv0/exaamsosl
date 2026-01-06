-- Add image support to chat_messages
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS image_data TEXT;

-- Add sender and is_read columns if they don't exist
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS sender VARCHAR(50);

ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Sample Questions for Testing
-- Run this AFTER running schema.sql

-- First, get the exam ID (should be the one created in schema.sql)
DO $$
DECLARE
  exam_uuid UUID;
BEGIN
  -- Get the active exam ID
  SELECT id INTO exam_uuid FROM exams WHERE is_active = TRUE LIMIT 1;
  
  -- Insert sample questions
  INSERT INTO questions (exam_id, order_index, question_text, question_type, options) VALUES
  (exam_uuid, 0, 'What does the acronym "KdG" stand for?', 'text', NULL),
  
  (exam_uuid, 1, 'Which of the following is NOT a valid JavaScript data type?', 'multiple_choice', 
   '{"options": ["String", "Boolean", "Character", "Number"], "correct": 2}'::jsonb),
  
  (exam_uuid, 2, 'Explain the difference between let, const, and var in JavaScript.', 'essay', NULL),
  
  (exam_uuid, 3, 'What is the output of: console.log(typeof null)?', 'multiple_choice',
   '{"options": ["null", "object", "undefined", "number"], "correct": 1}'::jsonb),
  
  (exam_uuid, 4, 'Write a JavaScript function that reverses a string.', 'code', NULL),
  
  (exam_uuid, 5, 'Which HTTP status code indicates "Not Found"?', 'multiple_choice',
   '{"options": ["200", "301", "404", "500"], "correct": 2}'::jsonb),
  
  (exam_uuid, 6, 'Describe what REST API stands for and its main principles.', 'essay', NULL),
  
  (exam_uuid, 7, 'What is the capital of Belgium?', 'text', NULL),
  
  (exam_uuid, 8, 'Which of these is a NoSQL database?', 'multiple_choice',
   '{"options": ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], "correct": 2}'::jsonb),
  
  (exam_uuid, 9, 'Explain the concept of "Big O" notation in algorithm complexity.', 'essay', NULL),
  
  (exam_uuid, 10, 'In React, what is the purpose of the useEffect hook?', 'essay', NULL),
  
  (exam_uuid, 11, 'Which CSS property is used to change text color?', 'multiple_choice',
   '{"options": ["font-color", "text-color", "color", "fg-color"], "correct": 2}'::jsonb),
  
  (exam_uuid, 12, 'Write a SQL query to select all users from a "users" table where age > 18.', 'code', NULL),
  
  (exam_uuid, 13, 'What does "DOM" stand for in web development?', 'text', NULL),
  
  (exam_uuid, 14, 'Which of the following is true about async/await in JavaScript?', 'multiple_choice',
   '{"options": ["It makes code synchronous", "It is syntactic sugar for Promises", "It creates new threads", "It is only available in Node.js"], "correct": 1}'::jsonb),
  
  (exam_uuid, 15, 'Explain the difference between == and === in JavaScript.', 'essay', NULL),
  
  (exam_uuid, 16, 'What is the time complexity of binary search?', 'multiple_choice',
   '{"options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "correct": 1}'::jsonb),
  
  (exam_uuid, 17, 'Write a function in any language to check if a string is a palindrome.', 'code', NULL),
  
  (exam_uuid, 18, 'What port does HTTPS typically use?', 'text', NULL),
  
  (exam_uuid, 19, 'Which of these is NOT a valid Git command?', 'multiple_choice',
   '{"options": ["git commit", "git push", "git pull", "git upload"], "correct": 3}'::jsonb),
  
  (exam_uuid, 20, 'Describe the MVC (Model-View-Controller) architectural pattern.', 'essay', NULL),
  
  (exam_uuid, 21, 'In Python, what is the output of: print(type([]))?', 'multiple_choice',
   '{"options": ["<class ''array''>", "<class ''list''>", "<class ''dict''>", "<class ''tuple''>"], "correct": 1}'::jsonb),
  
  (exam_uuid, 22, 'Write a CSS rule to make all paragraphs have red text.', 'code', NULL),
  
  (exam_uuid, 23, 'What does "API" stand for?', 'text', NULL),
  
  (exam_uuid, 24, 'Which HTTP method is idempotent?', 'multiple_choice',
   '{"options": ["POST", "GET", "PATCH", "All of the above"], "correct": 1}'::jsonb);

END $$;

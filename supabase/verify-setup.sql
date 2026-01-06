-- Verification Script for Supabase Setup
-- Run this in Supabase SQL Editor AFTER running schema.sql

-- 1. Check if all tables exist
SELECT 
  'Tables Check' as check_type,
  CASE 
    WHEN COUNT(*) = 4 THEN '✅ All 4 tables exist'
    ELSE '❌ Missing tables! Expected 4, found ' || COUNT(*)
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('exams', 'questions', 'chat_messages', 'participant_answers');

-- 2. Check if RLS is enabled on all tables
SELECT 
  'RLS Check' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('exams', 'questions', 'chat_messages', 'participant_answers')
ORDER BY tablename;

-- 3. Check if default exam exists
SELECT 
  'Default Exam Check' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Default exam exists (ID: ' || id::text || ')'
    ELSE '❌ No default exam found'
  END as status
FROM exams 
WHERE is_active = true
LIMIT 1;

-- 4. Check if policies exist
SELECT 
  'RLS Policies Check' as check_type,
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ Has policies'
    ELSE '❌ Missing policies'
  END as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('exams', 'questions', 'chat_messages', 'participant_answers')
GROUP BY tablename
ORDER BY tablename;

-- 5. Check question count
SELECT 
  'Questions Check' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Has ' || COUNT(*) || ' questions'
    ELSE '⚠️ No questions yet (import via admin panel)'
  END as status
FROM questions;

-- 6. Show exam configuration
SELECT 
  '📋 Exam Configuration' as info,
  id,
  title,
  is_active,
  COALESCE(chat_question_index::text, 'Not set') as chat_question_index,
  created_at
FROM exams
WHERE is_active = true;

-- 7. Summary
SELECT 
  '====== SETUP SUMMARY ======' as summary,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
     AND table_name IN ('exams', 'questions', 'chat_messages', 'participant_answers')) as tables_created,
  (SELECT COUNT(*) FROM exams WHERE is_active = true) as active_exams,
  (SELECT COUNT(*) FROM questions) as total_questions,
  (SELECT COUNT(DISTINCT tablename) FROM pg_policies 
   WHERE schemaname = 'public' 
     AND tablename IN ('exams', 'questions', 'chat_messages', 'participant_answers')) as tables_with_policies;

-- Expected results:
-- tables_created: 4
-- active_exams: 1
-- total_questions: 0 (until you import)
-- tables_with_policies: 4

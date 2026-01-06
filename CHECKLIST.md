# ✅ Setup Checklist

Use this to track your progress setting up the exam application.

## Before Starting
- [ ] Node.js installed (check with `node --version`)
- [ ] Have access to Supabase project
- [ ] Code editor open (VS Code recommended)

## Supabase Setup
- [ ] Opened Supabase dashboard
- [ ] Went to SQL Editor
- [ ] Copied contents of `supabase/schema.sql`
- [ ] Pasted and ran in SQL Editor
- [ ] Saw "Success" message
- [ ] Verified 4 tables created (exams, questions, chat_messages, participant_answers)
- [ ] Went to Project Settings → API
- [ ] Copied anon public key
- [ ] Updated `.env.local` with the key
- [ ] Went to Authentication → Users
- [ ] Created admin user (email + password)
- [ ] Noted down the credentials

## Local Development
- [ ] Opened terminal in `canvaspromax` folder
- [ ] Ran `npm install`
- [ ] Waited for installation to complete (no errors)
- [ ] Ran `npm run dev`
- [ ] Saw "Ready" message
- [ ] Opened http://localhost:3000 in browser
- [ ] Page loaded (might show "No active exam")

## Admin Panel
- [ ] Opened http://localhost:3000/admin
- [ ] Logged in with admin credentials
- [ ] Saw admin dashboard with 3 tabs
- [ ] Clicked "Questions" tab
- [ ] Clicked "Load Example" button
- [ ] Saw example JSON appear
- [ ] Clicked "Import Questions"
- [ ] Saw success message
- [ ] Saw questions listed below

## Testing Exam
- [ ] Went to http://localhost:3000
- [ ] Refreshed page
- [ ] Saw exam questions
- [ ] Clicked on question numbers in left sidebar
- [ ] Questions changed
- [ ] Answered a question
- [ ] Checked answer saved (no error messages)

## Testing Chat
- [ ] In admin panel, went to Settings tab
- [ ] Set "Hidden Chat Question" to 0
- [ ] Clicked "Save Settings"
- [ ] Went to exam page (http://localhost:3000)
- [ ] On first question, saw "💬 Help" button
- [ ] Clicked it - chat opened
- [ ] Typed a message and sent
- [ ] In admin panel, went to Chat tab
- [ ] Saw participant message
- [ ] Typed reply and sent
- [ ] Checked both sides update in real-time

## Verification
- [ ] No console errors in browser (F12)
- [ ] Questions load quickly
- [ ] Can navigate between questions
- [ ] Answers are saved
- [ ] Chat works both ways
- [ ] Real-time updates work

## Optional: Sample Questions
- [ ] Opened `supabase/sample-questions.sql`
- [ ] Copied contents
- [ ] Ran in Supabase SQL Editor
- [ ] Refreshed exam page
- [ ] Saw 25 questions loaded

## Ready for Production
- [ ] Everything above works
- [ ] No errors in development
- [ ] Tested on different browsers
- [ ] Read DEPLOYMENT.md
- [ ] Ready to push to GitHub
- [ ] Ready to deploy to Vercel

---

## If Stuck

**Can't complete a step?**
1. Check the error message carefully
2. Look in browser console (F12)
3. Read START_HERE.md for solutions
4. Check SETUP.md for detailed help

**Common Issues:**
- Forgot to add Supabase anon key → Update .env.local
- Database tables not created → Run schema.sql again
- Can't login → Check admin user exists in Supabase
- Questions not showing → Click "Import Questions" in admin

---

**Status:** [ ] Not Started  [ ] In Progress  [ ] ✅ Complete

**Notes:**
_Write any issues or questions here:_




---

**When all checkboxes are ✅, you're ready to go!** 🎉

# ✅ FINAL SETUP INSTRUCTIONS

## 🎯 Your Exam Application is Ready!

Everything has been created and configured. Follow these simple steps to complete the setup.

## ⚠️ Important: You MUST Complete These Steps

### Step 1: Get Supabase Anon Key (REQUIRED)

The `.env.local` file needs your Supabase Anon Key.

**How to get it:**

1. Open your browser
2. Go to: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/settings/api
3. Scroll to "Project API keys"
4. Copy the value under "anon" "public" (long string starting with "eyJ...")
5. Open `.env.local` in your code editor
6. Replace `YOUR_SUPABASE_ANON_KEY_HERE` with the key you copied
7. Save the file

### Step 2: Run Database Schema (REQUIRED)

The database tables need to be created.

**How to do it:**

1. Go to: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/sql
2. Click "New Query"
3. Open the file `supabase/schema.sql` in your code editor
4. Copy ALL its contents (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor (Ctrl+V)
6. Click "Run" button (or press Ctrl+Enter)
7. You should see "Success. No rows returned" in green

**Verify it worked:**
1. Click "Table Editor" in left sidebar
2. You should see 4 tables: exams, questions, chat_messages, participant_answers

### Step 3: Create Admin User (REQUIRED)

You need a user to login to the admin panel.

**How to create:**

1. Go to: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/auth/users
2. Click the green "Add user" button (top right)
3. Select "Create new user"
4. Fill in:
   - Email: `admin@exam.local` (or your email)
   - Password: `admin123` (or your password)
5. Click "Create user"

**If email confirmation is required:**
- Option A: Use your real email instead of admin@exam.local
- Option B: Disable email confirmation:
  - Go to: https://supabase.com/dashboard/project/tsfhzvyeifrlxytzejbh/auth/settings
  - Find "Enable email confirmations"
  - Toggle it OFF

### Step 4: Start the Application

```bash
# Make sure you're in the right folder
cd canvaspromax

# Install packages (if not done already)
npm install

# Start the development server
npm run dev
```

**Wait for:**
- "Ready in X seconds"
- "Local: http://localhost:3000"

### Step 5: Test It Works

1. **Open Participant View:**
   - Browser: http://localhost:3000
   - You should see "No active exam found" OR the exam interface
   - This is normal if no questions are loaded yet

2. **Open Admin Panel:**
   - Browser: http://localhost:3000/admin
   - Login with your credentials (admin@exam.local / admin123)
   - You should see the admin dashboard with 3 tabs

3. **Import Questions:**
   - In admin panel, click "Questions" tab
   - Click "Load Example" button
   - You'll see example JSON appear
   - Click "Import Questions" button
   - Should say "Questions imported successfully!"

4. **Check Exam:**
   - Go back to http://localhost:3000
   - Refresh the page
   - You should now see questions!
   - Navigate with Previous/Next buttons
   - Try answering a question

5. **Test Chat:**
   - In admin panel, go to "Settings" tab
   - Set "Hidden Chat Question" to 0 (first question)
   - Click "Save Settings"
   - Go to exam page (http://localhost:3000)
   - On first question, you'll see "💬 Help" button
   - Click it to open chat
   - Send a message
   - In admin panel, go to "Chat" tab
   - You should see the message
   - Reply to it
   - Both sides should update in real-time!

## 🎉 Success!

If all the above worked, your application is **fully functional**!

## 📋 Quick Reference

### URLs:
- **Exam (Participant):** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

### Default Credentials:
- **Email:** admin@exam.local
- **Password:** admin123

### Key Files:
- `.env.local` - Environment variables (add your Supabase key here)
- `supabase/schema.sql` - Database setup (run in Supabase SQL Editor)
- `supabase/sample-questions.sql` - 25 ready-made questions
- `README_RU.md` - Russian documentation
- `SETUP.md` - Detailed English setup guide

## 🚨 Common Issues

### Issue: "Cannot find module './ChatManager'"
**Fix:** This is a TypeScript cache issue. 
- Restart VS Code
- Or run: `npm run dev` (it will work at runtime)
- The error is cosmetic, code will run fine

### Issue: "No active exam found"
**Fix:** Database not set up correctly
1. Make sure you ran `supabase/schema.sql` in Supabase
2. Check Table Editor - should have 4 tables
3. Check `exams` table - should have 1 row with `is_active = true`

### Issue: Can't login to admin
**Fix:** Admin user not created
1. Check Supabase → Authentication → Users
2. Make sure user exists
3. Try creating new user with your email
4. Check if email confirmation is required

### Issue: Questions not showing
**Fix:** 
1. Make sure you clicked "Import Questions" in admin panel
2. Check browser console (F12) for errors
3. Verify .env.local has correct ANON_KEY

### Issue: Chat not working
**Fix:**
1. Make sure both tabs are open (exam + admin)
2. Verify you're on the correct question (check Settings)
3. Check browser console for WebSocket errors

## 🚀 Deploy to Production

When ready for Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

See `DEPLOYMENT.md` for detailed steps.

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check Supabase logs in dashboard
3. Read `SETUP.md` for detailed troubleshooting
4. Review code comments - they're helpful!

## ✨ Optional Enhancements

**Load 25 Sample Questions:**
1. Open `supabase/sample-questions.sql`
2. Copy contents
3. Run in Supabase SQL Editor
4. Refresh exam page - 25 questions loaded!

**Change Exam Title:**
1. Admin panel → Settings
2. Change "Exam Title"
3. Save

**Move Chat to Different Question:**
1. Admin panel → Settings
2. Change "Hidden Chat Question" number
3. Save

---

## 🎓 You're All Set!

Your fake exam application with admin panel is ready to use.

**Created by AI** 🤖
**Built with:** Next.js 16 + Supabase + Tailwind + shadcn/ui

Good luck with your exam! 🎉

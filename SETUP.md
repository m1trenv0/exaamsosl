# Complete Setup Guide

## Step-by-Step Setup Instructions

### Step 1: Supabase Database Setup

1. **Login to Supabase:**
   - Go to https://supabase.com/dashboard
   - Navigate to your project: https://tsfhzvyeifrlxytzejbh.supabase.co

2. **Execute Database Schema:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the ENTIRE contents of the file `supabase/schema.sql`
   - Paste into the SQL editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

3. **Verify Tables Created:**
   - Click "Table Editor" in left sidebar
   - You should see these tables:
     - exams
     - questions
     - chat_messages
     - participant_answers

### Step 2: Get Supabase Credentials

1. **Get Anon Key:**
   - Click "Project Settings" (gear icon) in left sidebar
   - Click "API" in the settings menu
   - Find "Project API keys" section
   - Copy the `anon` `public` key (long string starting with "eyJ...")
   
2. **Update .env.local:**
   - Open `.env.local` in your code editor
   - Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your copied anon key
   - Save the file

### Step 3: Create Admin User

1. **Go to Authentication:**
   - In Supabase dashboard, click "Authentication" in left sidebar
   - Click "Users" tab
   - Click "Add user" button (green button in top right)
   
2. **Create User:**
   - Select "Create new user"
   - Email: `admin@exam.local`
   - Password: `admin123` (or your preferred password)
   - Click "Create user"
   
3. **Confirm Email (if required):**
   - If email confirmation is required, you can:
     - Option A: Use your real email instead
     - Option B: Disable email confirmation:
       - Go to Authentication > Settings > Email Auth
       - Toggle "Enable email confirmations" to OFF

### Step 4: Install and Run

1. **Install Dependencies:**
   ```bash
   cd canvaspromax
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:**
   - Participant interface: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

### Step 5: Import Sample Questions

1. **Login to Admin Panel:**
   - Go to http://localhost:3000/admin
   - Email: `admin@exam.local`
   - Password: `admin123`

2. **Import Questions:**
   - Click "Questions" tab
   - Click "Load Example" button
   - Review the example JSON
   - Click "Import Questions"
   - You should see "Questions imported successfully!"

3. **Test the Exam:**
   - Open http://localhost:3000 in a new tab
   - You should see the exam with imported questions
   - Navigate through questions using Next/Previous buttons
   - Try answering questions

### Step 6: Test Chat Feature

1. **Configure Chat Question:**
   - In admin panel, go to "Settings" tab
   - Set "Hidden Chat Question" to 0 (first question)
   - Click "Save Settings"

2. **Open Chat as Participant:**
   - Go to http://localhost:3000
   - You should see a "💬 Help" button on the first question
   - Click it to open the chat
   - Send a test message

3. **Respond as Admin:**
   - In admin panel, go to "Chat" tab
   - You should see the participant's message
   - Type a response and click "Send"
   - The message should appear in real-time on both sides

## Troubleshooting

### "Failed to login" in Admin Panel

**Problem:** Can't login with admin credentials

**Solutions:**
1. Verify user exists in Supabase Auth > Users
2. Check if email confirmation is required
3. Try creating a new user with your real email
4. Check browser console for specific error messages

### "No active exam found"

**Problem:** Exam page shows this message

**Solutions:**
1. Verify the database schema was executed successfully
2. Check if an exam exists:
   - Go to Supabase > Table Editor > exams
   - Should have one row with `is_active = true`
3. If no exam exists, re-run the schema SQL (it has an INSERT statement)

### Questions not showing

**Problem:** Questions tab shows 0 questions

**Solutions:**
1. Make sure you clicked "Import Questions" after pasting JSON
2. Check browser console for errors
3. Verify the JSON format is correct
4. Try using the "Load Example" button

### Chat not working

**Problem:** Messages not appearing in real-time

**Solutions:**
1. Check if Supabase Realtime is enabled:
   - Go to Project Settings > API
   - Scroll to "Realtime" section
   - Should be enabled by default
2. Check browser console for WebSocket errors
3. Try refreshing both tabs

### Environment variable errors

**Problem:** "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solutions:**
1. Verify `.env.local` file exists in project root
2. Check that variables don't have quotes around values
3. Restart the dev server after changing .env.local
4. Make sure the file is named exactly `.env.local` (not `.env.local.txt`)

## Verifying Everything Works

### Checklist:

- [ ] Database tables created (4 tables in Supabase)
- [ ] Admin user created in Supabase Auth
- [ ] .env.local configured with anon key
- [ ] npm install completed successfully
- [ ] Dev server running without errors
- [ ] Can access http://localhost:3000
- [ ] Can login to admin at http://localhost:3000/admin
- [ ] Questions imported successfully
- [ ] Questions appear on participant page
- [ ] Can answer questions (check autosave in admin panel)
- [ ] Chat appears on configured question
- [ ] Can send/receive chat messages in real-time

## Next Steps

Once everything is working:

1. **Customize Questions:**
   - Create your own questions in JSON format
   - Import them via admin panel

2. **Adjust Settings:**
   - Change exam title
   - Move chat to different question
   - Configure as needed

3. **Deploy to Vercel:**
   - Push code to GitHub
   - Connect to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

## Getting Help

If you encounter issues:

1. Check browser console (F12) for errors
2. Check Supabase logs in dashboard
3. Review the error messages carefully
4. Check that all environment variables are set correctly
5. Verify database schema executed successfully

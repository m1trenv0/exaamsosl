# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js installed
- Supabase account

### Step 1: Setup Supabase (2 minutes)

1. **Execute Database Schema:**
   - Open Supabase Dashboard → SQL Editor
   - Copy & paste content from `supabase/schema.sql`
   - Click "Run"

2. **Get Anon Key:**
   - Supabase Dashboard → Settings → API
   - Copy the `anon public` key

3. **Update .env.local:**
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_key_here
   ```

4. **Create Admin User:**
   - Supabase Dashboard → Authentication → Users → Add user
   - Email: `admin@exam.local`
   - Password: `admin123`

### Step 2: Run the App (1 minute)

```bash
npm install
npm run dev
```

Visit:
- **Exam:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

### Step 3: Import Questions (1 minute)

1. Login to admin panel (admin@exam.local / admin123)
2. Go to "Questions" tab
3. Click "Load Example"
4. Click "Import Questions"

### Step 4: Test Everything (1 minute)

1. Open http://localhost:3000 in new tab
2. Navigate through questions
3. Try the chat feature (click "💬 Help" on question 11)
4. Send messages between admin and participant

## 🎉 Done!

Your exam application is now fully functional.

## Quick Tips

- **Change chat question:** Admin → Settings → Set question number
- **Export questions:** Admin → Questions → Export button
- **View answers:** Admin → Check database in Supabase

## Troubleshooting

**Can't login?**
- Check if admin user exists in Supabase Auth

**No questions showing?**
- Make sure you clicked "Import Questions"

**Chat not working?**
- Verify Realtime is enabled in Supabase

For detailed help, see `SETUP.md`

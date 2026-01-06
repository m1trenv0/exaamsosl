# Fake Exam Application

A full-featured exam application built with Next.js, Supabase, and Tailwind CSS. Features include a Canvas-styled exam interface for participants and a comprehensive admin panel for managing questions and communicating with participants.

## Features

### Participant Interface
- Canvas LMS-styled exam interface
- Multiple question types: Multiple Choice, Text, Essay, Code
- Real-time answer autosave
- Hidden chat feature (accessible on specific questions)
- Realistic exam browser UI with taskbar

### Admin Panel
- Secure authentication
- JSON-based question import/export
- Real-time chat with participants
- Exam settings configuration
- Question management dashboard

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Validation:** Zod
- **UI:** Tailwind CSS + shadcn/ui
- **Real-time:** Supabase Realtime

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### 2. Supabase Setup

1. Go to your Supabase project dashboard (https://tsfhzvyeifrlxytzejbh.supabase.co)

2. **Run the SQL Schema:**
   - Navigate to SQL Editor in Supabase Dashboard
   - Copy the contents of `supabase/schema.sql`
   - Execute the SQL to create all tables and policies

3. **Get your Supabase Anon Key:**
   - Go to Project Settings > API
   - Copy the `anon public` key
   - Add it to `.env.local`

4. **Create an Admin User:**
   - Go to Authentication > Users
   - Click "Add user" > "Create new user"
   - Email: `admin@exam.local` (or your preferred email)
   - Password: `admin123` (or your preferred password)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Participant exam: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## Question JSON Format

```json
{
  "questions": [
    {
      "order_index": 0,
      "question_text": "What is the capital of France?",
      "question_type": "multiple_choice",
      "options": {
        "options": ["London", "Paris", "Berlin", "Madrid"],
        "correct": 1
      }
    },
    {
      "order_index": 1,
      "question_text": "Explain closure in JavaScript.",
      "question_type": "essay"
    }
  ]
}
```

### Question Types
- `multiple_choice` - Multiple choice with options
- `text` - Short text input
- `essay` - Long text area
- `code` - Code editor textarea

## Deployment to Vercel

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

For detailed documentation, see inline code comments.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Local Development Working
- [ ] `npm run dev` runs without errors
- [ ] Can access http://localhost:3000
- [ ] Can login to admin panel at http://localhost:3000/admin
- [ ] Questions are displaying correctly
- [ ] Can import questions via admin panel
- [ ] Chat feature works in real-time
- [ ] Answers are being saved to database

### ✅ Supabase Configuration
- [ ] Database schema executed successfully (schema.sql)
- [ ] All 4 tables created (exams, questions, chat_messages, participant_answers)
- [ ] RLS policies are enabled
- [ ] Admin user created in Supabase Auth
- [ ] Realtime enabled in Supabase project settings
- [ ] Project is not paused (check Supabase dashboard)

### ✅ Environment Variables
- [ ] `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] No sensitive data committed to git

## Vercel Deployment Steps

### Step 1: Prepare Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Exam application"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository:**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `canvaspromax`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://tsfhzvyeifrlxytzejbh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
   ```
   
   Add these for all environments (Production, Preview, Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (~2-3 minutes)

### Step 3: Verify Deployment

After deployment completes:

- [ ] Visit your Vercel URL (e.g., your-app.vercel.app)
- [ ] Participant interface loads correctly
- [ ] Questions are displayed
- [ ] Can navigate between questions
- [ ] Visit /admin route
- [ ] Can login with admin credentials
- [ ] Admin dashboard loads
- [ ] Can import questions
- [ ] Chat works in real-time
- [ ] Test on mobile device

## Post-Deployment Configuration

### Custom Domain (Optional)

1. **Add Domain in Vercel:**
   - Project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Update Supabase (if needed):**
   - Supabase → Authentication → URL Configuration
   - Add your Vercel URL and custom domain

### Supabase Settings

1. **Add Vercel URL to Allowed URLs:**
   - Supabase → Authentication → URL Configuration
   - Add your Vercel deployment URL
   - Add any custom domains

2. **Configure Email Templates (Optional):**
   - Supabase → Authentication → Email Templates
   - Customize confirmation emails if using email auth

## Production Checklist

### ✅ Security
- [ ] Admin credentials are strong
- [ ] Environment variables are not exposed
- [ ] RLS policies are properly configured
- [ ] HTTPS is enabled (Vercel does this automatically)
- [ ] No console.log statements with sensitive data

### ✅ Performance
- [ ] Images optimized (if any added)
- [ ] No unnecessary API calls
- [ ] Database queries are efficient
- [ ] Supabase connection pooling enabled

### ✅ User Experience
- [ ] Questions load quickly
- [ ] Chat messages appear instantly
- [ ] UI is responsive on mobile
- [ ] Error messages are helpful
- [ ] Loading states are clear

## Monitoring & Maintenance

### Vercel Dashboard
- Check deployment logs for errors
- Monitor function invocations
- Review analytics

### Supabase Dashboard
- Monitor database usage
- Check API usage
- Review error logs
- Monitor real-time connections

## Troubleshooting Production Issues

### Issue: Can't access admin panel
**Check:**
- Environment variables in Vercel
- Supabase Auth is working
- Middleware is deployed correctly

### Issue: Questions not loading
**Check:**
- Database connection is working
- RLS policies allow public read
- Exam is marked as active

### Issue: Chat not working
**Check:**
- Realtime is enabled in Supabase
- WebSocket connections allowed
- RLS policies for chat_messages

### Issue: Slow performance
**Check:**
- Database indexes are created
- Supabase project is not paused
- No infinite loops in code

## Rollback Plan

If deployment fails:

1. **Revert to previous deployment:**
   - Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Fix locally and redeploy:**
   ```bash
   git revert HEAD
   git push origin main
   ```

## Scaling Considerations

When you expect more users:

1. **Upgrade Supabase Plan:**
   - More database connections
   - Better performance
   - Higher rate limits

2. **Optimize Queries:**
   - Add database indexes
   - Use pagination for large datasets
   - Cache frequently accessed data

3. **Monitor Usage:**
   - Set up alerts in Supabase
   - Monitor Vercel function usage
   - Track database performance

## Success Criteria

Deployment is successful when:
- ✅ Application is accessible via Vercel URL
- ✅ Participant can take exam
- ✅ Admin can login and manage
- ✅ Real-time features work
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast loading times (<3s)

## Next Steps After Deployment

1. **Share with Users:**
   - Send participant link
   - Provide admin login details
   - Share documentation

2. **Create Backup:**
   - Export questions regularly
   - Backup database (Supabase has automatic backups)

3. **Monitor:**
   - Check logs daily initially
   - Set up error notifications
   - Review user feedback

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Готово!** Your exam application is production-ready! 🎉

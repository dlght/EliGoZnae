# 🚀 Quick Setup Guide

Follow these steps to get your trivia app live in under 10 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Test Locally

```bash
npm run dev
```

Open http://localhost:3000 - your app should be running!

## Step 3: Push to GitHub

### First time setup:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit - Daily Trivia Challenge"

# Create a new repository on GitHub (https://github.com/new)
# Name it: trivia-app (or whatever you want)

# Link your local repo to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/trivia-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel (Easiest!)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your `trivia-app` repository
5. Click "Deploy"
6. Wait 30 seconds... Done! 🎉

Your app is now live at: `https://trivia-app-xxxxx.vercel.app`

## Step 5: Add Google AdSense (Optional)

1. Go to https://www.google.com/adsense
2. Sign up and add your Vercel URL
3. Wait for approval (1-3 days)
4. Once approved, get your ad codes
5. Edit `src/App.jsx` and replace the placeholder ads
6. Push changes: `git add . && git commit -m "Add AdSense" && git push`
7. Vercel will auto-deploy your changes!

## Need Help?

- **Ads not showing?** Check the README.md troubleshooting section
- **Build failed?** Run `npm install` again
- **Questions?** Open an issue on GitHub

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Push to GitHub
git add .
git commit -m "Your message"
git push
```

That's it! Your ad-monetized trivia app is live! 🎯

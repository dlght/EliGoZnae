# 🎯 Daily Trivia Challenge

A production-ready trivia game with ad monetization. Players answer 10 daily questions, track their scores, compete on leaderboards, and build streaks.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Daily Challenges**: 10 new trivia questions from multiple categories
- **Score Tracking**: Personal high scores and statistics
- **Streak System**: Daily streak counter to keep players engaged
- **Leaderboard**: Top 10 players ranked by score
- **Ad Integration**: Banner and interstitial ad slots ready for monetization
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Offline Support**: LocalStorage for data persistence
- **Social Sharing**: Share results to social media

## 💰 Monetization

The app includes 3 strategic ad placements:

1. **Banner Ad** (Top of page, always visible)
   - Format: 728x90 (desktop) / 320x50 (mobile)
   - Location: `src/App.jsx` - Look for `<!-- Banner Ad Slot -->`

2. **Interstitial Ads** (Between questions)
   - Shows every 3 questions
   - Shows after game completion
   - Location: `src/App.jsx` - Look for `<!-- Interstitial Ad Slot -->`

### Expected Revenue (with Google AdSense)

| Daily Users | Est. Monthly Revenue |
|-------------|---------------------|
| 1,000       | $300 - $750        |
| 5,000       | $1,500 - $3,750    |
| 10,000      | $3,000 - $7,500    |

*Assumptions: 5 ad impressions per user, $2-5 RPM*

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed
- Git installed

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/trivia-app.git
cd trivia-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app running!

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📦 Deployment

### Deploy to Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

**That's it!** Your app will be live in ~30 seconds.

### Deploy to Netlify (Alternative - Free)

#### Option 1: Git Integration
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

#### Option 2: Drag & Drop
1. Run `npm run build` locally
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder onto the page
4. Done!

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Update vite.config.js - add base URL
export default defineConfig({
  base: '/trivia-app/', // Your repo name
  // ... rest of config
});

# Deploy
npm run deploy
```

Your app will be live at: `https://YOUR-USERNAME.github.io/trivia-app/`

## 💵 Adding Google AdSense

### Step 1: Sign Up for AdSense

1. Go to [google.com/adsense](https://www.google.com/adsense)
2. Sign up with your Google account
3. Add your website URL (wait for approval, usually 1-3 days)

### Step 2: Get Your Ad Code

1. In AdSense dashboard, go to "Ads" → "By ad unit"
2. Create ad units:
   - **Banner**: Create "Display ads" → 728x90 (Responsive works too)
   - **Interstitial**: Create "In-page ads" → Full-screen
3. Copy the ad code

### Step 3: Add Ads to Your App

Open `src/App.jsx` and find the placeholder divs:

```jsx
// Banner Ad - Replace this:
<div className="ad-placeholder">
  <div className="ad-demo">
    <p>728x90 Banner Ad Space</p>
  </div>
</div>

// With your AdSense code:
<div className="ad-placeholder">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXX"
       data-ad-slot="YYYYYYYYYY"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### Step 4: Add AdSense Script to index.html

Add this to `index.html` in the `<head>`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
```

### Step 5: Test & Deploy

```bash
npm run build
# Deploy to your hosting
```

**Important**: Ads may take 24-48 hours to start showing after deployment.

## 🎨 Customization

### Change Colors

Edit the gradient in `src/App.jsx`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Fonts

Update the Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap');
```

### Change Questions

The app uses the free [Open Trivia Database API](https://opentdb.com/). To modify:

```javascript
// In fetchQuestions() function, change URL:
const response = await fetch(
  'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple'
);
```

**Category IDs**: 9 (General), 21 (Sports), 11 (Film), etc. [See full list](https://opentdb.com/api_config.php)

## 📊 Analytics (Optional)

### Add Google Analytics

1. Get your tracking ID from [analytics.google.com](https://analytics.google.com)
2. Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔧 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **Open Trivia DB** - Free trivia API
- **LocalStorage** - Data persistence

## 📁 Project Structure

```
trivia-app/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## 🐛 Troubleshooting

### Ads not showing?

- Wait 24-48 hours after AdSense approval
- Check browser ad blockers are disabled
- Verify your AdSense account is approved
- Check browser console for errors

### Build fails?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Questions not loading?

- Check internet connection
- Open Trivia DB might be rate-limited (wait a minute)
- Check browser console for CORS errors

## 📈 Growth Tips

1. **SEO**: Add meta descriptions and Open Graph tags
2. **Content**: Add new categories or daily challenges
3. **Social**: Add "Challenge a Friend" feature
4. **Engagement**: Add achievements and badges
5. **Marketing**: Post daily trivia questions on social media with link

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 💬 Support

Having issues? [Open an issue](https://github.com/YOUR-USERNAME/trivia-app/issues) on GitHub.

---

**Ready to make money from trivia?** 🚀

1. Push this to GitHub
2. Deploy to Vercel (free)
3. Add AdSense
4. Share on social media
5. Watch the traffic (and revenue) grow!

Good luck! 🎯

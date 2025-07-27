# BIG BANG Token - Frontend

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

### Option 2: Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your repository
4. Deploy automatically

### Option 3: GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source branch
4. Deploy

## 📁 Project Structure
```
frontend/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Main JavaScript
├── config.js          # Configuration
├── translations.js    # Translations
├── debug-wallet.js    # Debug utilities
├── vercel.json        # Vercel configuration
├── netlify.toml       # Netlify configuration
└── README.md          # This file
```

## 🔧 Local Development
```bash
cd frontend
python3 -m http.server 8003
# Open http://localhost:8003
```

## 🌐 Live Demo
Your dApp will be available at:
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://your-project.netlify.app`
- GitHub Pages: `https://username.github.io/repository-name`

## ⚠️ Important Notes
- Make sure your contract is deployed to the correct network
- Update `config.js` with the correct contract address
- Test wallet connection on the live site
- Ensure all dependencies are properly loaded 
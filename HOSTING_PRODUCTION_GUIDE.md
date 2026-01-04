# 🚀 Production Hosting & Build Guide

## Project Overview
- **Frontend:** HTML/CSS/JavaScript (Client-side)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Architecture:** Full-stack MERN (MongoDB, Express, React/Vanilla JS, Node.js)

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account created with live database
- [ ] Environment variables configured
- [ ] All dependencies installed
- [ ] Database backups created
- [ ] Environment configuration tested

---

## 🏗️ Step 1: Prepare for Production Build

### 1.1 Install Dependencies
```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# Verify installation
npm list
```

### 1.2 Environment Configuration

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection (Use MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret (Generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Cloudinary (if using image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 1.3 Update Build Scripts

Update `server/package.json` scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "build": "echo 'Production ready'",
    "production": "NODE_ENV=production node server.js"
  }
}
```

---

## 🔧 Step 2: Production Build

### 2.1 Build the Application
```bash
# From server directory
npm run build

# Verify build
npm start
```

### 2.2 Optimize for Production

Create `server/config/production.js`:

```javascript
module.exports = {
  cors: {
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
  },
  maxRequestSize: '10mb',
  cacheMaxAge: '1d'
};
```

Update `server/server.js` to use production config:

```javascript
const isProduction = process.env.NODE_ENV === 'production';
const config = isProduction ? require('./config/production') : {};

app.use(cors(config.cors || {}));
```

---

## 🌐 Step 3: Hosting Options

### Option A: Render.com (Recommended for Beginners)

1. **Create Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Build Command: npm install
     Start Command: npm run production
     Environment: NODE_ENV=production
     ```

3. **Add Environment Variables:**
   - In Render dashboard → Environment
   - Add all variables from `.env`

4. **Database:**
   - Use MongoDB Atlas (free tier)
   - Connect via MONGO_URI in environment variables

5. **Frontend Serving:**
   - Server already serves static files from `/client`
   - No separate frontend deployment needed

**Estimated Cost:** Free tier available ($0/month)
**Deployment Time:** ~2 minutes

---

### Option B: Vercel (Frontend) + Render (Backend)

**Frontend Deployment:**
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```

**Backend Deployment:** (Follow Option A)

---

### Option C: Heroku Alternative (Since Heroku ended free tier)

**Not recommended.** Use Render.com instead (free tier available).

---

### Option D: AWS (Advanced)

**EC2 + RDS:**
1. Launch EC2 instance (Ubuntu)
2. Install Node.js
3. Clone repository
4. Run:
   ```bash
   npm install
   npm start
   ```
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ecommerce"
   pm2 startup
   pm2 save
   ```
6. Configure RDS for MongoDB or use MongoDB Atlas

---

### Option E: Docker + Any Cloud Provider

Create `Dockerfile` in root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ecommerce-app .
docker run -p 5000:5000 ecommerce-app
```

---

## 📊 Step 4: MongoDB Atlas Setup (Required)

1. **Create Account:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free tier available)

2. **Create Cluster:**
   - Choose free tier
   - Select region closest to users
   - Create cluster (takes ~3-5 minutes)

3. **Create Database User:**
   - Security → Database Access
   - Add new user (username: your_username)
   - Password: Generate secure password
   - Click Add User

4. **Allow IP Access:**
   - Security → Network Access
   - Add IP Address: `0.0.0.0/0` (allows all - for production use specific IPs)

5. **Get Connection String:**
   - Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>:<password>` with your credentials
   - Add `retryWrites=true&w=majority`

6. **Update `.env`:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

---

## 🔐 Step 5: Security Configuration

### 5.1 Environment Variables Best Practices

**Never commit `.env` file!**

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
node_modules/
```

### 5.2 Update CORS for Production

In `server/server.js`:

```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'http://localhost:3000' // development only
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 5.3 Add Request Limiting

Install rate limiter:
```bash
npm install express-rate-limit
```

Add to `server/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🚀 Step 6: Deploy (Render.com Example)

### Complete Deployment Steps:

```bash
# 1. Ensure .gitignore includes .env
echo ".env" >> .gitignore

# 2. Commit code
git add .
git commit -m "Production ready build"
git push

# 3. Go to Render Dashboard
# - New Web Service
# - Connect GitHub repo
# - Configure as shown above
```

### After Deployment:

1. **Test API endpoints:**
   ```
   https://your-app.onrender.com/api/products
   ```

2. **Test Frontend:**
   ```
   https://your-app.onrender.com/
   ```

3. **Monitor Logs:**
   - Render Dashboard → Logs
   - Check for errors

---

## 📈 Step 7: Monitoring & Maintenance

### Monitoring Checklist

- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Monitor database performance
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Create automated backups
- [ ] Review logs weekly

### Install Sentry for Error Tracking

```bash
npm install @sentry/node

# In server.js:
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your_sentry_dsn" });
```

---

## 🔄 Step 8: Continuous Deployment (Optional)

### Auto-Deploy on Git Push

**Render.com:**
- Already configured! Pushes to main branch auto-deploy

**GitHub Actions (Advanced):**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          # Your deployment script
```

---

## 📊 Performance Optimization

### 1. Enable Compression
```bash
npm install compression
```

Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Database Indexing
Add indexes to MongoDB models:

```javascript
// In Product.js
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
```

### 3. Caching Headers
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

---

## 🧪 Testing Before Production

### 1. Local Testing
```bash
cd server
NODE_ENV=production npm start
```

### 2. API Testing
Use Postman or curl:
```bash
curl http://localhost:5000/api/products
```

### 3. Load Testing
```bash
npm install -g artillery
artillery run load-test.yml
```

---

## 🆘 Troubleshooting

### Issue: "MONGO_URI not found"
**Solution:** Check `.env` file exists in server directory

### Issue: "CORS error"
**Solution:** Update CORS origins in `server/server.js`

### Issue: "Cannot find module"
**Solution:** Run `npm install` in server directory

### Issue: "Server crashes after deploy"
**Solution:** Check Render logs for specific errors

### Issue: "Port 5000 already in use"
**Solution:** 
```bash
# Kill process
lsof -ti:5000 | xargs kill -9
```

---

## 📱 Testing Production URL

Once deployed, test these:

```
✅ Health Check: https://your-app.onrender.com/
✅ Products API: https://your-app.onrender.com/api/products
✅ Register: POST to https://your-app.onrender.com/api/users/register
✅ Login: POST to https://your-app.onrender.com/api/users/login
```

---

## 📞 Support Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Help:** https://docs.atlas.mongodb.com
- **Express.js Guide:** https://expressjs.com
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices

---

## 🎉 You're Ready!

After deployment:
1. Share your production URL
2. Set up custom domain (optional)
3. Monitor performance
4. Gather user feedback
5. Iterate and improve

**Happy hosting! 🚀**

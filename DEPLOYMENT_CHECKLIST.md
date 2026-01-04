# 📋 DEPLOYMENT CHECKLIST

## Pre-Deployment Preparation ✅

### Local Testing
- [ ] Run `npm install` in server directory (✅ Done)
- [ ] Start server locally: `npm start`
- [ ] Test homepage: http://localhost:5000
- [ ] Test API: http://localhost:5000/api/products
- [ ] Test login: http://localhost:5000/login.html

### Environment Configuration
- [ ] Create `.env` file in server directory
- [ ] Copy values from `.env.example`
- [ ] Generate JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add MongoDB URI from MongoDB Atlas
- [ ] Update CORS origins for your domain

### Git Preparation
- [ ] Initialize git (if not already done): `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit - production ready"`
- [ ] Push to GitHub

---

## MongoDB Atlas Setup ✅

- [ ] Create MongoDB Atlas account: https://mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Create database user (save username & password)
- [ ] Allow network access from 0.0.0.0/0
- [ ] Get connection string
- [ ] Update MONGO_URI in `.env`
- [ ] Test connection

---

## Render.com Deployment ✅

### Account & Repository
- [ ] Create Render.com account: https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render to access your GitHub

### Deploy Service
- [ ] Click "New +" → "Web Service"
- [ ] Select your ecommerce GitHub repository
- [ ] Configure deployment:
  - [ ] Name: `ecommerce-app` (or your name)
  - [ ] Root Directory: `server`
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Environment: Choose "production"

### Environment Variables
- [ ] Add `PORT` = `5000`
- [ ] Add `NODE_ENV` = `production`
- [ ] Add `MONGO_URI` = (from MongoDB Atlas)
- [ ] Add `JWT_SECRET` = (secure random string)
- [ ] Add `CLOUDINARY_CLOUD_NAME` (if using image uploads)
- [ ] Add `CLOUDINARY_API_KEY` (if using image uploads)
- [ ] Add `CLOUDINARY_API_SECRET` (if using image uploads)

### Deploy
- [ ] Click "Deploy" button
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Check build logs for errors

---

## Post-Deployment Verification ✅

### Check Deployment Status
- [ ] Deployment shows "Live" status on Render
- [ ] View logs show "Server running on port 5000"
- [ ] No error messages in logs

### Test Application
- [ ] Test home page: `https://your-app.onrender.com`
- [ ] Test products API: `https://your-app.onrender.com/api/products`
- [ ] Test login page: `https://your-app.onrender.com/login.html`
- [ ] Test register page: `https://your-app.onrender.com/register.html`
- [ ] Test shop: `https://your-app.onrender.com/shop.html`
- [ ] Test cart: `https://your-app.onrender.com/cart.html`
- [ ] Test admin: `https://your-app.onrender.com/admin.html`

### Functionality Testing
- [ ] Register new account
- [ ] Login with credentials
- [ ] View products
- [ ] Add product to cart
- [ ] Create order
- [ ] View order history
- [ ] Create seller account
- [ ] Upload product as seller

---

## Security Verification ✅

- [ ] `.env` file not committed to git
- [ ] `.gitignore` includes `.env`
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB user has limited permissions
- [ ] HTTPS is enabled (automatic on Render)
- [ ] CORS is configured correctly
- [ ] No API keys logged in public files

---

## Performance & Monitoring ✅

### Optimization
- [ ] Enable database connection pooling
- [ ] Set up static file caching headers
- [ ] Enable compression on responses
- [ ] Optimize database indexes

### Monitoring Setup
- [ ] Set up error logging (Sentry - optional)
- [ ] Enable Render alerts
- [ ] Create MongoDB backups
- [ ] Monitor API response times

---

## Custom Domain (Optional) ✅

- [ ] Register domain (GoDaddy, Namecheap, etc.)
- [ ] Update DNS records on Render
- [ ] Update CORS origins in `.env`
- [ ] Update MONGO_URI allowed origins
- [ ] Test on custom domain

---

## Maintenance & Updates ✅

### Regular Tasks
- [ ] Weekly: Check application logs
- [ ] Monthly: Review error tracking
- [ ] Monthly: Update database backups
- [ ] Quarterly: Update dependencies: `npm update`
- [ ] Quarterly: Audit security: `npm audit`

### Scaling (When Needed)
- [ ] Monitor active users
- [ ] Check database performance
- [ ] Upgrade Render plan if needed
- [ ] Upgrade MongoDB tier if storage increases

---

## Troubleshooting Common Issues

### Build Fails on Render
**Solution:** 
```bash
cd server
npm install
npm start
```
Fix locally first, then push to GitHub.

### Cannot Connect to MongoDB
**Solution:**
- Check MONGO_URI spelling
- Verify IP whitelist: 0.0.0.0/0
- Check database user exists
- Check password doesn't contain special characters

### CORS Errors
**Solution:**
- Update ALLOWED_ORIGINS in `.env`
- Check frontend and backend URLs match
- Clear browser cache

### Application Crashes
**Solution:**
- Check Render logs for errors
- Verify all environment variables set
- Check for missing dependencies

---

## 🎉 Deployment Complete!

Once everything is checked, you're ready to share your application:

```
Share this URL with users:
https://your-app.onrender.com

Share with sellers:
https://your-app.onrender.com/register.html

Admin panel:
https://your-app.onrender.com/admin.html
```

---

## 📞 Support & Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Help:** https://docs.atlas.mongodb.com
- **Node.js Guide:** https://nodejs.org/en/docs/
- **Express Documentation:** https://expressjs.com

---

## ✅ Final Verification

| Task | Status |
|------|--------|
| Dependencies installed | ✅ |
| Production scripts added | ✅ |
| Configuration created | ✅ |
| Environment file ready | ✅ |
| Documentation created | ✅ |
| Ready for deployment | ✅ |

**You're all set! Deploy with confidence! 🚀**

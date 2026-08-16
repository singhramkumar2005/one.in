# Deployment Guide

## 🚀 Deployment Options

### Option 1: Local Deployment (Development)

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure MongoDB connection
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### Option 2: Heroku Deployment

#### Backend on Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create mocktest-api
```

4. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set NODE_ENV="production"
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

#### Frontend on Vercel/Netlify

**Vercel:**
```bash
npm install -g vercel
cd frontend
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod
```

### Option 3: AWS Deployment

#### Backend on AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu Server
   - Configure security groups (port 5000)
   - Get SSH key

2. **Connect to Instance**
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB**
```bash
sudo apt-get install -y mongodb
```

5. **Deploy Application**
```bash
git clone your-repo
cd backend
npm install
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

#### Frontend on AWS S3 + CloudFront

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Upload build folder contents

3. **Setup CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Configure SSL

### Option 4: Digital Ocean

#### Using Digital Ocean App Platform

1. **Connect Repository**
   - Link GitHub/GitLab repo

2. **Configure Backend**
```yaml
name: mocktest-backend
services:
  - name: api
    github:
      repo: your-repo
      branch: main
      deploy_on_push: true
    build_command: npm install
    run_command: npm start
    envs:
      - key: MONGODB_URI
        value: ${DATABASE_URL}
      - key: JWT_SECRET
        value: ${JWT_SECRET}
```

3. **Configure Frontend**
```yaml
name: mocktest-frontend
static_sites:
  - name: web
    github:
      repo: your-repo
      branch: main
    build_command: npm run build
    output_dir: build
```

### Option 5: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/mocktest
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

**Deploy:**
```bash
docker-compose up -d
```

## 🔒 Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Regular security updates

### Database
- [ ] Use MongoDB Atlas or managed DB
- [ ] Set up regular backups
- [ ] Enable authentication
- [ ] Optimize indexes
- [ ] Monitor performance

### Environment Variables
- [ ] Never commit .env files
- [ ] Use environment-specific configs
- [ ] Secure sensitive data
- [ ] Document all variables

### Monitoring
- [ ] Set up error logging (Sentry)
- [ ] Monitor uptime
- [ ] Track performance
- [ ] Set up alerts
- [ ] Analytics integration

### Performance
- [ ] Enable compression
- [ ] Use CDN for static files
- [ ] Optimize images
- [ ] Implement caching
- [ ] Minify assets

### Backup
- [ ] Database backups
- [ ] Code repository backups
- [ ] User data backups
- [ ] Regular backup testing

## 📊 Post-Deployment

### Testing
```bash
# Test API endpoints
curl https://your-api.com/health

# Test frontend
curl https://your-app.com

# Load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://your-api.com
```

### Monitoring Setup

**Backend Monitoring (PM2)**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
```

**Error Tracking (Sentry)**
```javascript
// Install
npm install @sentry/node

// Configure
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

### SSL Certificate
```bash
# Using Certbot (Let's Encrypt)
sudo apt-get install certbot
sudo certbot --nginx
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "mocktest-api"
          heroku_email: "your-email@example.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{secrets.VERCEL_TOKEN}}
          vercel-org-id: ${{secrets.ORG_ID}}
          vercel-project-id: ${{secrets.PROJECT_ID}}
```

## 🌐 Domain Configuration

### DNS Settings
```
Type    Name    Value
A       @       your-server-ip
CNAME   www     your-app.com
CNAME   api     your-api.com
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-app.com www.your-app.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.your-app.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 Maintenance

### Regular Tasks
- Update dependencies monthly
- Check security vulnerabilities
- Monitor error logs
- Review performance metrics
- Backup verification
- User feedback review

### Update Process
```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
npm install
pm2 restart all

# Frontend
cd frontend
npm install
npm run build
# Upload to hosting
```

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb
```

**App Not Starting**
```bash
# Check logs
pm2 logs

# Restart app
pm2 restart all
```

**Memory Issues**
```bash
# Check memory usage
free -h

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📞 Support

- Check logs first
- Review error messages
- Search documentation
- Ask in community forums
- Contact support team

---

Choose the deployment option that best fits your needs and budget!

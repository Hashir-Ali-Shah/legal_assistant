# Deployment Guide

## Overview

Deploy Lawbot frontend to Vercel and backend to AWS. Both folders are now self-contained.

---

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

```bash
cd frontend
```

### 2. Set Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-backend-api-url.com/api
VITE_ADMIN_USERNAME=Hazard
VITE_ADMIN_PASSWORD=YourSecurePassword
```

### 3. Deploy

```bash
# Option 1: Connect GitHub repo to Vercel (automatic)
# Option 2: Deploy manually
vercel --prod
```

**Build Command:** `npm run build`
**Output Directory:** `dist`
**Framework:** Vite

---

## Backend Deployment (AWS)

### 1. Choose Deployment Method

#### Option A: AWS Elastic Beanstalk (Recommended)

- Easiest for Django apps
- Automatic load balancing
- Built-in environment variable management

#### Option B: AWS EC2 + Docker

- More control
- Run with Docker Compose

#### Option C: AWS ECS (Container Service)

- For production-grade deployments
- Auto-scaling

### 2. Update Environment Variables

**For Elastic Beanstalk:**
Go to Configuration → Software → Environment Properties

**For EC2/Docker:**
Create `backend/.env` with production values:

```env
# IMPORTANT: Change these values for production!

GROQ_API_KEY=your_actual_groq_key
GEMINI_API_KEY=your_actual_gemini_key

PINECONE_HOST=https://your-index.svc.region.pinecone.io
PINECONE_API_KEY=your_actual_pinecone_key
PINECONE_INDEX=lawbot

SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.your_project_ref
SUPABASE_DB_PASSWORD=your_actual_db_password
SUPABASE_DB_HOST=aws-0-region.pooler.supabase.com
SUPABASE_DB_PORT=5432

# AWS ElastiCache Redis
REDIS_HOST=your-elasticache-endpoint.cache.amazonaws.com
REDIS_PORT=6379
REDIS_SSL=true
REDIS_CACHE_ENABLED=true

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_strong_password_here

# Django
DJANGO_SECRET_KEY=generate-a-new-secret-key-here
DEBUG=False
```

**Generate Django Secret Key:**

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
# OR with uv
uv pip install -r requirements.txt
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Deploy

**Elastic Beanstalk:**

```bash
eb init
eb create lawbot-backend
eb deploy
```

**Docker (EC2):**

```bash
docker build -t lawbot-backend .
docker run -p 8000:8000 --env-file .env lawbot-backend
```

---

## Post-Deployment Checklist

### Frontend

- [ ] Update `VITE_API_URL` to actual backend URL
- [ ] Test login/signup flow
- [ ] Test chat functionality
- [ ] Test admin dashboard login

### Backend

- [ ] Verify database connection
- [ ] Verify Redis connection (or confirm fallback works)
- [ ] Verify Pinecone connection
- [ ] Test `/api/health/system/` endpoint
- [ ] Test admin endpoints with Basic Auth

### Security

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Set `DEBUG=False` in production
- [ ] Generate new `DJANGO_SECRET_KEY`
- [ ] Enable CORS for frontend domain only
- [ ] Set up HTTPS (AWS Load Balancer + SSL)

---

## Connecting Frontend to Backend

After backend is deployed, update frontend env vars:

**Vercel Dashboard:**

```
VITE_API_URL=https://your-backend-domain.com/api
```

Redeploy frontend for changes to take effect.

---

## Testing Deployment

### 1. Health Check

```bash
curl https://your-backend-domain.com/api/health/
```

### 2. Admin Dashboard

```bash
# Get system health
curl https://your-backend-domain.com/api/health/system/

# Test admin auth
curl -u "Hazard:YourPassword" https://your-backend-domain.com/api/analytics/admin/usage
```

### 3. Frontend

Visit `https://your-frontend-domain.vercel.app` and test:

- Sign up / Login
- Create chat session
- Admin dashboard (`/admin`)

---

## Troubleshooting

### Frontend can't connect to backend

- Check `VITE_API_URL` is correct
- Verify CORS settings in backend allow frontend domain

### Backend database errors

- Verify `SUPABASE_DB_*` credentials
- Check security group allows connection from backend

### Redis errors

- If no ElastiCache: Set `REDIS_CACHE_ENABLED=false`
- Verify security group allows port 6379

---

## Folder Structure (Self-Contained)

```
Lawbot/
├── frontend/           # Deploy this to Vercel
│   ├── .env           # Frontend env vars
│   ├── .env.example
│   ├── src/
│   └── package.json
│
├── backend/           # Deploy this to AWS
│   ├── .env          # Backend env vars
│   ├── .env.example
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── configs/
│   ├── manage.py
│   └── requirements.txt (or pyproject.toml)
│
└── .env              # (OLD - can be deleted)
```

You can now zip `frontend/` and `backend/` folders separately and deploy them!

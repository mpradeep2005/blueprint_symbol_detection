# Blueprint Detection - Full Stack Deployment

## 🚀 Quick Start

```bash
# Clone and navigate to project
cd blueprint_symbol_detection

# Start both frontend and backend
docker-compose up --build
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📦 What's Included

### Services
- **Frontend**: React + Vite served by nginx (Port 80)
- **Backend**: FastAPI Python API (Port 8000)

### Features
✅ Multi-stage Docker builds  
✅ Health checks  
✅ Volume persistence for uploads/results  
✅ CI/CD with GitHub Actions  
✅ Production-ready nginx config

## 🛠 Development Commands

```bash
# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

## 📁 Project Structure
```
.
├── frontend/          # React app
│   ├── Dockerfile     # Multi-stage: Node → nginx
│   └── nginx.conf     # SPA routing
├── backend/           # FastAPI
│   └── Dockerfile     # Python container
└── docker-compose.yml # Full-stack orchestration
```

## 🔧 Configuration

Update environment in `docker-compose.yml`:
```yaml
environment:
  - DEBUG=False
  - CORS_ORIGINS=https://yourdomain.com
```

## 📚 Documentation
See [walkthrough.md](file:///C:/Users/prade/.gemini/antigravity/brain/5713737b-8572-4911-9ad9-44090f60c536/walkthrough.md) for detailed deployment guide.

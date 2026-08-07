# Docker Setup Guide

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (usually included with Docker Desktop)

**Install Docker:**
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Mac: https://docs.docker.com/desktop/install/mac-install/
- Linux: https://docs.docker.com/engine/install/

## Quick Start (3 Steps)

### 1. Create Environment File

Copy the template and add your API key:

```bash
# Copy template
copy .env.docker .env

# Edit .env and add your AIMLAPI_KEY
```

Or create `.env` manually in the root directory:
```env
AIMLAPI_KEY=689002b0f2cae022cb8878a6e99e29b5
MODEL_NAME=gpt-4o-mini
```

### 2. Build and Run

```bash
# Build and start both services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Docker Commands

### Start Services
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### Stop Services
```bash
# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything (containers, networks, volumes)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats
```

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use port 3001 instead of 3000
```

### Backend Not Starting
Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Missing `AIMLAPI_KEY` in `.env`
- Python dependencies failed to install

### Frontend Can't Connect to Backend
Make sure backend is healthy:
```bash
docker-compose ps
curl http://localhost:8000/health
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Rebuild and restart
docker-compose up --build
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Remove unused Docker resources
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## Development Mode

For development with hot-reload:

### Backend (with volume mount)
Edit `docker-compose.yml`:
```yaml
backend:
  volumes:
    - ./backend:/app
  command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (with volume mount)
```yaml
frontend:
  volumes:
    - ./Frontend:/app
    - /app/node_modules
  command: npm run dev
```

Then restart:
```bash
docker-compose down
docker-compose up
```

## Production Deployment

For production, use separate `.env` file:

```bash
# Create production env
AIMLAPI_KEY=your_production_key
MODEL_NAME=gpt-4o-mini

# Run with production settings
docker-compose -f docker-compose.yml up -d
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `AIMLAPI_KEY` | AI/ML API Key | - | ✅ Yes |
| `MODEL_NAME` | AI Model | gpt-4o-mini | ❌ No |

## Container Details

### Backend Container
- **Image**: Python 3.11 slim
- **Port**: 8000
- **Health Check**: `/health` endpoint
- **Restart**: Unless stopped

### Frontend Container
- **Image**: Node 20 Alpine
- **Port**: 3000
- **Depends On**: Backend (waits for health check)
- **Restart**: Unless stopped

## Useful Docker Commands

```bash
# Enter backend container shell
docker exec -it dayone-backend bash

# Enter frontend container shell
docker exec -it dayone-frontend sh

# View backend container logs live
docker logs -f dayone-backend

# Check backend health
docker exec dayone-backend curl http://localhost:8000/health

# Run backend tests
docker exec dayone-backend python -m pytest

# Install new frontend package
docker exec dayone-frontend npm install package-name
```

## Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## Need Help?

- Docker Docs: https://docs.docker.com/
- Docker Compose Docs: https://docs.docker.com/compose/
- Project Issues: Check backend/frontend logs

---

**Ready to run!** Just execute `docker-compose up --build` 🚀

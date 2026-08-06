@echo off
echo ================================
echo Day One Backend Server
echo ================================
echo.

REM Check if .env exists
if not exist .env (
    echo WARNING: .env file not found!
    echo Please create .env with: ANTHROPIC_API_KEY=your_key_here
    echo.
    pause
    exit /b 1
)

echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo API Docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

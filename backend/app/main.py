import os
import asyncio
import uuid
from datetime import datetime
from typing import Dict
from fastapi import FastAPI, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.models import IdeaInput, SessionState, AgentMessage
from app.pipeline import CompanyPipeline

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Day One API",
    version="1.0.0",
    description="AI-powered startup validation with 6 specialized agents"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (simple for hackathon)
sessions: Dict[str, SessionState] = {}
active_websockets: Dict[str, WebSocket] = {}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Day One API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "active_sessions": len(sessions),
        "active_connections": len(active_websockets)
    }


@app.post("/api/analyze")
async def start_analysis(idea_input: IdeaInput):
    """
    Start a new company analysis
    
    - **idea**: The startup idea to analyze
    - **target_market**: (Optional) Specific target market
    """
    session_id = str(uuid.uuid4())
    
    session = SessionState(
        session_id=session_id,
        status="running",
        messages=[],
        dossier=None,
        created_at=datetime.utcnow()
    )
    sessions[session_id] = session
    
    # Start pipeline in background
    asyncio.create_task(run_pipeline(session_id, idea_input.idea))
    
    return {
        "session_id": session_id,
        "status": "started",
        "message": "Analysis started. Connect to WebSocket for real-time updates."
    }


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time agent updates
    
    - **session_id**: The session ID from /api/analyze
    """
    await websocket.accept()
    active_websockets[session_id] = websocket
    
    try:
        # Send initial connection message
        await websocket.send_json({
            "agent": "system",
            "message": "Connected to Day One pipeline",
            "timestamp": datetime.utcnow().isoformat(),
            "type": "info"
        })
        
        # Keep connection alive
        while True:
            # Wait for any client messages (ping/pong)
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
            except asyncio.TimeoutError:
                # Send ping to keep connection alive
                await websocket.send_json({"type": "ping"})
                
    except WebSocketDisconnect:
        print(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if session_id in active_websockets:
            del active_websockets[session_id]


@app.get("/api/result/{session_id}")
async def get_result(session_id: str):
    """
    Get the final analysis result
    
    - **session_id**: The session ID from /api/analyze
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    return {
        "session_id": session_id,
        "status": session.status,
        "dossier": session.dossier,
        "messages": session.messages,
        "created_at": session.created_at
    }


@app.get("/api/sessions")
async def list_sessions():
    """List all active sessions"""
    return {
        "sessions": [
            {
                "session_id": sid,
                "status": session.status,
                "created_at": session.created_at,
                "has_result": session.dossier is not None
            }
            for sid, session in sessions.items()
        ]
    }


async def run_pipeline(session_id: str, idea: str):
    """Background task to run the agent pipeline"""
    session = sessions[session_id]
    
    # Callback to send WebSocket updates
    async def ws_callback(event: dict):
        # Store message in session
        session.messages.append(AgentMessage(**event))
        
        # Send via WebSocket if connected
        if session_id in active_websockets:
            try:
                await active_websockets[session_id].send_json(event)
            except Exception as e:
                print(f"Failed to send WebSocket message: {e}")
    
    try:
        # Get API key from environment
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY not set in environment")
        
        # Get model name (default to free router)
        model_name = os.getenv("MODEL_NAME", "openrouter/free")
        
        # Run the pipeline
        pipeline = CompanyPipeline(
            api_key=api_key,
            model_name=model_name,
            websocket_callback=ws_callback
        )
        
        dossier = await pipeline.run(idea)
        
        # Update session
        session.dossier = dossier
        session.status = "completed"
        
        # Send completion event
        await ws_callback({
            "agent": "system",
            "message": "Analysis complete!",
            "timestamp": datetime.utcnow().isoformat(),
            "type": "info"
        })
        
    except Exception as e:
        session.status = "error"
        error_msg = f"Pipeline error: {str(e)}"
        print(error_msg)
        
        # Send error event
        await ws_callback({
            "agent": "system",
            "message": error_msg,
            "timestamp": datetime.utcnow().isoformat(),
            "type": "error"
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

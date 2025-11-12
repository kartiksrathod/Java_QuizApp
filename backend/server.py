from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routes import auth_routes, admin_routes, user_routes, ai_routes

app = FastAPI(
    title="Java Quiz App API",
    description="Backend API for Java Quiz Application with Question Management and AI Features",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(auth_routes.router, prefix="/api")
app.include_router(admin_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/api")
app.include_router(ai_routes.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Java Quiz App API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback

from agent import MeetingAgent
from schemas.response import MeetingRequest


app = FastAPI(
    title="BoardRoom AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

meeting_agent = MeetingAgent()


@app.get("/")
async def health():
    return {
        "status": "running",
        "service": "BoardRoom AI"
    }


@app.post("/meeting")
async def meeting(request: MeetingRequest):
    try:
        return await meeting_agent.handle(request)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
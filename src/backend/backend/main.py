import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, heartbeat, judge

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(heartbeat.router)
app.include_router(judge.router)


def main():
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, workers=2)

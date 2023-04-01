import uvicorn
import multiprocessing
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, heartbeat, judge, sandbox, problem

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
app.include_router(sandbox.router)
app.include_router(problem.router)


def main():
    multiprocessing.freeze_support()
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, workers=10)

import re
import hashlib

import requests

from typing import Union

from fastapi import APIRouter, Request
from pydantic import BaseModel

from backend.logger import Logger
from backend.base import Response

router = APIRouter()
logger = Logger(__name__, log_file="heartbeat.log")


class JudgerHeartbeatRequest(BaseModel):
    judger_version: str
    hostname: str
    running_task_number: Union[int, None]
    cpu_core: int
    memory: float
    action: str
    cpu: float
    service_url: Union[str, None]


class JudgerHeartbeatResponse(BaseModel):
    data: str
    error: Union[str, None]


@router.post("/api/v1/judger_heartbeat", response_model=JudgerHeartbeatResponse)
async def judger_heartbeat(req: JudgerHeartbeatRequest):
    return {"data": "success", "error": None}

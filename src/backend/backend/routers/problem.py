import re
import hashlib

import requests

from typing import List, Union

from fastapi import APIRouter
from pydantic import BaseModel

from backend.logger import Logger
from backend.base import Response

router = APIRouter()
clientID = "1"
clientSecret = "2"
logger = Logger(__name__, log_file="auth.log")


class ProblemSummary(BaseModel):
    id: int
    name: str


class ProblemInfo(BaseModel):
    id: int
    name: str
    describe: str
    time_limit: int
    memory_limit: int
    tags: List[str]


class TotalPagesResponse(BaseModel):
    total: int


class ProblemListResponse(BaseModel):
    problems: List[ProblemSummary]


@router.get("/api/v1/problem_list", response_model=Response[ProblemListResponse])
async def get_problem_list(page: int = None) -> Response[ProblemListResponse]:
    if page is None:
        page = 1

    # TODO: db

    data = {
        "problems": [
            {"id": 1001, "name": "A + B Problem"},
            {"id": 1002, "name": "A - B Problem"},
        ]
    }
    return Response[ProblemListResponse](data=data)


@router.get("/api/v1/total_pages", response_model=Response[TotalPagesResponse])
async def get_total_pages() -> Response[TotalPagesResponse]:
    # TODO: db

    data = {"total": 100}
    return Response[TotalPagesResponse](data=data)

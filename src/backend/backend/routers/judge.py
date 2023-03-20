import requests
import hashlib

import requests

from typing import List, Union

from fastapi import APIRouter
from pydantic import BaseModel

from backend.logger import Logger
from backend.base import Response
from backend.utils.language_config import LANGUAGE_CONFIG

logger = Logger(__name__, log_file="judge.log")


class JudgeRequest(BaseModel):
    src: str
    language: str
    time_limit: int
    memory_limit: int
    problem_id: int


class TestCaseResponse(BaseModel):
    cpu_time: int
    result: int
    memory: int
    real_time: int
    signal: int
    error: int
    exit_code: int
    output_md5: Union[str, None]
    test_case: str


class JudgeResponse(BaseModel):
    result: List[TestCaseResponse]


router = APIRouter()


@router.post("/api/v1/judge", response_model=Response[JudgeResponse])
async def judge(req: JudgeRequest):
    src, language, time_limit, memory_limit, problem_id = (
        req.src,
        req.language,
        req.time_limit,
        req.memory_limit,
        req.problem_id,
    )
    lang_config = LANGUAGE_CONFIG.get(language)
    if lang_config is None:  # ERROR: No such language
        logger.error(f"No such language {language}")
        return Response[JudgeResponse](code=1)
    res = requests.post(
        url="http://127.0.0.1:8080/judge",
        headers={
            "X-Judge-Server-Token": "8c5f41dc348dd34dcc58cceaad2947c29619ac770cf83fdbbbdd321cd87172a3",
            "Content-Type": "application/json",
        },
        json={
            "src": src,
            "language_config": lang_config,
            "max_cpu_time": time_limit,
            "max_memory": memory_limit,
            "test_case_id": str(problem_id),
        },
    )
    res_dict = res.json()
    err = res_dict.get("err")
    print(res_dict)
    if err is not None:
        return Response[JudgeResponse](code=1, data={"result": []})  # Compile Error

    return Response[JudgeResponse](data={"result": res_dict.get("data")})


cpp_src = r"""
    #include <iostream>
    using namespace std;
    int main()
    {
        int a,b;
        cin >> a >> b;
        cout << a+b << endl;
        return 0;
    }
"""

if __name__ == "__main__":
    res = requests.post(
        url="http://127.0.0.1:8080/judge",
        headers={
            "X-Judge-Server-Token": "8c5f41dc348dd34dcc58cceaad2947c29619ac770cf83fdbbbdd321cd87172a3",
            "Content-Type": "application/json",
        },
        json={
            "src": cpp_src,
            "language_config": LANGUAGE_CONFIG.get("cpp"),
            "max_cpu_time": 1000,
            "max_memory": 1024 * 1024 * 128,
            "test_case_id": "1001",
        },
    )
    res_dict = res.json()
    print(res_dict.get("data"))

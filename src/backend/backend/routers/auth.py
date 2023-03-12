import re
import requests

from fastapi import APIRouter
from pydantic import BaseModel

from backend.logger import Logger
from backend.base import Response

router = APIRouter()
clientID = "1"
clientSecret = "2"
logger = Logger(__name__, log_file="auth.log")

class UserInfo(BaseModel):
    name: str
    avatar_url: str
    bio: str


@router.get("/api/user_info", response_model=Response[UserInfo])
async def get_user_info(code: str = None) -> Response[UserInfo]:
    if code is None:
        return Response[UserInfo](data={"user_name": ""}, code=1)
    
    url = f"https://github.com/login/oauth/access_token?client_id={clientID}&client_secret={clientSecret}&code={code}"
    token_resp = requests.get(url, headers={
      "Content-Type": "application/json",
    })
    resp_list = token_resp.text.split("&")
    access_token = ""
    for resp in resp_list:
        if resp.startswith("access_token"):
            access_token = resp.split('=')[1]

    user_resp = requests.get("https://api.github.com/user", headers={
      "Content-Type": "application/json",
      "Authorization": f"token {access_token}",
    })
    return Response[UserInfo](data=user_resp.json())


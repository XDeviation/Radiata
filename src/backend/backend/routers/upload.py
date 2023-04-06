import os
from fastapi import APIRouter, File, UploadFile
from backend.logger import Logger

router = APIRouter()
logger = Logger(__name__, log_file="heartbeat.log")

@router.post("/api/v1/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    print(file.filename)
    file_location = f"../data/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
        file_object.flush()
    return {"filename": file.filename}

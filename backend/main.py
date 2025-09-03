import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

from services.auto_update import ensure_latest 
from toolboxes.run_stimpyper import run_stimpyper
from electrode import setup_app
from helpers import get_stimparams

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Toggle via env var to be safe in prod: AUTO_UPDATE=1
    if os.getenv("AUTO_UPDATE", "0") == "1":
        # Tries to update StimPyPer to latest main, restarts on success
        _ = ensure_latest(
            repo_url="https://github.com/Calvinwhow/StimPyPer.git",
            branch="main",
        )
    yield
    # (optional) shutdown hooks

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's URL
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

class StimPyPerRequest(BaseModel):
    electrode_data_path: str
    nifti_path: str
    output_path: str

class RetrieveElectrodeDataRequest(BaseModel):
    file_path: str

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/update-message")
def update_message(msg: Message):
    return {"message": f"Received: {msg.message}"}

@app.post("/api/run-stimpyper")
def execute_stimpyper(request: StimPyPerRequest):
    print(f"Running StimPyPer with electrode_data_path: {request.electrode_data_path}, nifti_path: {request.nifti_path}, output_path: {request.output_path}")
    run_stimpyper(request.electrode_data_path, request.nifti_path, request.output_path)
    v = get_stimparams(request.output_path)
    return {"message": "StimPyPer run completed", "v": v}

@app.post("/api/retrieve-electrode-data")
def retrieve_electrode_data(request: RetrieveElectrodeDataRequest):
    print(f"Retrieving electrode data with file path: {request.file_path}")
    elmodels, patient_id = setup_app(request.file_path)
    return {"elmodels": elmodels, "patient_id": patient_id}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    return {"filepath": file.filename, "message": "File processed successfully"}

if __name__ == "__main__":
    # Note: for auto-update + restart to work cleanly, avoid --reload here.
    # Use a supervisor (Electron spawns the process; or systemd/PM2/Docker).
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

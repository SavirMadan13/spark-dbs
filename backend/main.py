from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/update-message")
def update_message(msg: Message):
    # Here you can process the message as needed
    return {"message": f"Received: {msg.message}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)
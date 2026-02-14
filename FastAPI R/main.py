from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, HTTPException, Header, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRECT_KEY = "2c3d785289370c07f8779294ac3f44b7c248bec7adaa5f3abb001f22d9f3f7c8"
ALGORITHM = "HS256"


class LoginRequest(BaseModel):
    username: str
    password: str


def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(minutes=30)
    return jwt.encode(to_encode, SECRECT_KEY, algorithm=ALGORITHM)


@app.post("/login", status_code=status.HTTP_201_CREATED)
async def login_for_react(data: LoginRequest):
    if data.username != "admin" or data.password != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials"
        )

    token = create_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/protected")
async def protected_route(authorization:str=Header(...)):
    token =authorization.split(" ")[1]
    try:
        payload=jwt.decode(token,SECRECT_KEY,ALGORITHM)
        return{"message":f"Hello {payload["sub"]}"}
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="invalid token")
    

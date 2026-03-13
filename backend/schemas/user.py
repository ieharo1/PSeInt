from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models.user import RolEnum


class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    rol: RolEnum = RolEnum.OPERADOR


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    rol: Optional[RolEnum] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str

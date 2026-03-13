from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BodegaBase(BaseModel):
    nombre: str
    codigo: str
    direccion: Optional[str] = None
    responsable: Optional[str] = None
    telefono: Optional[str] = None


class BodegaCreate(BodegaBase):
    pass


class BodegaUpdate(BaseModel):
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    responsable: Optional[str] = None
    telefono: Optional[str] = None
    is_active: Optional[bool] = None


class BodegaResponse(BodegaBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

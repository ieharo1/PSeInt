from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.producto import CategoriaEnum


class ProductoBase(BaseModel):
    nombre: str
    sku: str
    descripcion: Optional[str] = None
    categoria: CategoriaEnum = CategoriaEnum.OTROS
    precio_unitario: float = 0.0
    unidad_medida: str = "UNIDAD"
    peso_kg: float = 0.0


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    categoria: Optional[CategoriaEnum] = None
    precio_unitario: Optional[float] = None
    unidad_medida: Optional[str] = None
    peso_kg: Optional[float] = None
    is_active: Optional[bool] = None


class ProductoResponse(ProductoBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InventarioBase(BaseModel):
    bodega_id: int
    producto_id: int
    cantidad_disponible: float = 0.0
    cantidad_reservada: float = 0.0
    ubicacion_estante: Optional[str] = None
    stock_minimo: float = 0.0


class InventarioCreate(InventarioBase):
    pass


class InventarioUpdate(BaseModel):
    cantidad_disponible: Optional[float] = None
    cantidad_reservada: Optional[float] = None
    ubicacion_estante: Optional[str] = None
    stock_minimo: Optional[float] = None


class InventarioResponse(InventarioBase):
    id: int
    updated_at: datetime
    bodega_nombre: Optional[str] = None
    producto_nombre: Optional[str] = None
    producto_sku: Optional[str] = None

    class Config:
        from_attributes = True


class MovimientoCreate(BaseModel):
    inventario_id: int
    tipo: str  # ENTRADA, SALIDA, AJUSTE
    cantidad: float
    motivo: Optional[str] = None


class MovimientoResponse(BaseModel):
    id: int
    inventario_id: int
    tipo: str
    cantidad: float
    motivo: Optional[str]
    usuario_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class AjusteStockRequest(BaseModel):
    bodega_id: int
    producto_id: int
    nueva_cantidad: float
    motivo: str

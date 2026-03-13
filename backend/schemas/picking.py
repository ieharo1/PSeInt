from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.picking import EstadoPickingEnum, PrioridadEnum


class PickingItemBase(BaseModel):
    producto_id: int
    cantidad_solicitada: float
    ubicacion: Optional[str] = None


class PickingItemCreate(PickingItemBase):
    pass


class PickingItemUpdate(BaseModel):
    cantidad_recogida: Optional[float] = None
    completado: Optional[str] = None


class PickingItemResponse(PickingItemBase):
    id: int
    orden_id: int
    cantidad_recogida: float
    completado: str
    producto_nombre: Optional[str] = None
    producto_sku: Optional[str] = None

    class Config:
        from_attributes = True


class PickingOrderBase(BaseModel):
    bodega_origen_id: int
    bodega_destino_id: Optional[int] = None
    prioridad: PrioridadEnum = PrioridadEnum.MEDIA
    notas: Optional[str] = None
    fecha_requerida: Optional[datetime] = None


class PickingOrderCreate(PickingOrderBase):
    items: List[PickingItemCreate]


class PickingOrderUpdate(BaseModel):
    estado: Optional[EstadoPickingEnum] = None
    prioridad: Optional[PrioridadEnum] = None
    asignado_a_id: Optional[int] = None
    notas: Optional[str] = None
    fecha_requerida: Optional[datetime] = None


class PickingOrderResponse(PickingOrderBase):
    id: int
    numero_orden: str
    estado: EstadoPickingEnum
    asignado_a_id: Optional[int]
    creado_por_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    fecha_completado: Optional[datetime]
    items: List[PickingItemResponse] = []
    bodega_origen_nombre: Optional[str] = None
    bodega_destino_nombre: Optional[str] = None

    class Config:
        from_attributes = True

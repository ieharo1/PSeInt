from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base
import enum


class EstadoPickingEnum(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    EN_PROCESO = "EN_PROCESO"
    COMPLETADO = "COMPLETADO"
    CANCELADO = "CANCELADO"


class PrioridadEnum(str, enum.Enum):
    BAJA = "BAJA"
    MEDIA = "MEDIA"
    ALTA = "ALTA"
    URGENTE = "URGENTE"


class PickingOrder(Base):
    __tablename__ = "picking_orders"

    id = Column(Integer, primary_key=True, index=True)
    numero_orden = Column(String(30), unique=True, nullable=False, index=True)
    estado = Column(Enum(EstadoPickingEnum), default=EstadoPickingEnum.PENDIENTE)
    prioridad = Column(Enum(PrioridadEnum), default=PrioridadEnum.MEDIA)
    bodega_origen_id = Column(Integer, ForeignKey("bodegas.id"), nullable=False)
    bodega_destino_id = Column(Integer, ForeignKey("bodegas.id"))
    asignado_a_id = Column(Integer, ForeignKey("usuarios.id"))
    creado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    notas = Column(Text)
    fecha_requerida = Column(DateTime(timezone=True))
    fecha_completado = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    bodega_origen = relationship("Bodega", foreign_keys=[bodega_origen_id], back_populates="pickings_origen")
    bodega_destino = relationship("Bodega", foreign_keys=[bodega_destino_id], back_populates="pickings_destino")
    items = relationship("PickingItem", back_populates="orden", cascade="all, delete-orphan")


class PickingItem(Base):
    __tablename__ = "picking_items"

    id = Column(Integer, primary_key=True, index=True)
    orden_id = Column(Integer, ForeignKey("picking_orders.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad_solicitada = Column(Float, nullable=False)
    cantidad_recogida = Column(Float, default=0.0)
    ubicacion = Column(String(50))
    completado = Column(String(10), default="NO")  # SI, NO, PARCIAL

    orden = relationship("PickingOrder", back_populates="items")
    producto = relationship("Producto", back_populates="picking_items")

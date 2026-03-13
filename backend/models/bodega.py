from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class Bodega(Base):
    __tablename__ = "bodegas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    codigo = Column(String(20), unique=True, nullable=False, index=True)
    direccion = Column(Text)
    responsable = Column(String(100))
    telefono = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    inventarios = relationship("Inventario", back_populates="bodega")
    pickings_origen = relationship("PickingOrder", foreign_keys="PickingOrder.bodega_origen_id", back_populates="bodega_origen")
    pickings_destino = relationship("PickingOrder", foreign_keys="PickingOrder.bodega_destino_id", back_populates="bodega_destino")

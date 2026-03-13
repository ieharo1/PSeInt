from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base
import enum


class CategoriaEnum(str, enum.Enum):
    ELECTRONICO = "ELECTRONICO"
    ROPA = "ROPA"
    ALIMENTOS = "ALIMENTOS"
    HERRAMIENTAS = "HERRAMIENTAS"
    OTROS = "OTROS"


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    descripcion = Column(Text)
    categoria = Column(Enum(CategoriaEnum), default=CategoriaEnum.OTROS)
    precio_unitario = Column(Float, default=0.0)
    unidad_medida = Column(String(20), default="UNIDAD")
    peso_kg = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    inventarios = relationship("Inventario", back_populates="producto")
    picking_items = relationship("PickingItem", back_populates="producto")

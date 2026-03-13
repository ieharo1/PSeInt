from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from core.database import Base
import enum


class RolEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    OPERADOR = "OPERADOR"
    SUPERVISOR = "SUPERVISOR"


class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(100))
    hashed_password = Column(String(255), nullable=False)
    rol = Column(Enum(RolEnum), default=RolEnum.OPERADOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

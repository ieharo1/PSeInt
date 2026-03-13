from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from core.database import get_db
from core.security import get_current_active_user
from models.producto import Producto
from schemas.producto import ProductoCreate, ProductoUpdate, ProductoResponse

router = APIRouter(prefix="/api/productos", tags=["Productos"])


@router.get("/", response_model=List[ProductoResponse])
def list_productos(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_active_user)
):
    q = db.query(Producto).filter(Producto.is_active == True)
    if search:
        q = q.filter(Producto.nombre.ilike(f"%{search}%") | Producto.sku.ilike(f"%{search}%"))
    return q.offset(skip).limit(limit).all()


@router.get("/{producto_id}", response_model=ProductoResponse)
def get_producto(producto_id: int, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.post("/", response_model=ProductoResponse, status_code=201)
def create_producto(data: ProductoCreate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    if db.query(Producto).filter(Producto.sku == data.sku).first():
        raise HTTPException(status_code=400, detail="El SKU ya existe")
    producto = Producto(**data.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


@router.put("/{producto_id}", response_model=ProductoResponse)
def update_producto(producto_id: int, data: ProductoUpdate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(producto, field, value)
    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/{producto_id}", status_code=204)
def delete_producto(producto_id: int, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    producto.is_active = False
    db.commit()

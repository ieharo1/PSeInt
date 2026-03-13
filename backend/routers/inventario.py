from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from core.database import get_db
from core.security import get_current_active_user
from models.inventario import Inventario, MovimientoInventario
from models.bodega import Bodega
from models.producto import Producto
from schemas.inventario import (
    InventarioCreate, InventarioUpdate, InventarioResponse,
    MovimientoCreate, MovimientoResponse, AjusteStockRequest
)

router = APIRouter(prefix="/api/inventario", tags=["Inventario"])


def build_response(inv: Inventario) -> dict:
    return {
        "id": inv.id,
        "bodega_id": inv.bodega_id,
        "producto_id": inv.producto_id,
        "cantidad_disponible": inv.cantidad_disponible,
        "cantidad_reservada": inv.cantidad_reservada,
        "ubicacion_estante": inv.ubicacion_estante,
        "stock_minimo": inv.stock_minimo,
        "updated_at": inv.updated_at,
        "bodega_nombre": inv.bodega.nombre if inv.bodega else None,
        "producto_nombre": inv.producto.nombre if inv.producto else None,
        "producto_sku": inv.producto.sku if inv.producto else None,
    }


@router.get("/", response_model=List[InventarioResponse])
def list_inventario(
    bodega_id: Optional[int] = None,
    producto_id: Optional[int] = None,
    bajo_stock: Optional[bool] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_active_user)
):
    q = db.query(Inventario).options(joinedload(Inventario.bodega), joinedload(Inventario.producto))
    if bodega_id:
        q = q.filter(Inventario.bodega_id == bodega_id)
    if producto_id:
        q = q.filter(Inventario.producto_id == producto_id)
    items = q.all()
    if bajo_stock:
        items = [i for i in items if i.cantidad_disponible <= i.stock_minimo]
    return [build_response(i) for i in items]


@router.get("/{inv_id}", response_model=InventarioResponse)
def get_inventario(inv_id: int, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    inv = db.query(Inventario).options(joinedload(Inventario.bodega), joinedload(Inventario.producto)).filter(Inventario.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Registro de inventario no encontrado")
    return build_response(inv)


@router.post("/", response_model=InventarioResponse, status_code=201)
def create_inventario(data: InventarioCreate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    existing = db.query(Inventario).filter(
        Inventario.bodega_id == data.bodega_id,
        Inventario.producto_id == data.producto_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe registro de este producto en esta bodega")
    inv = Inventario(**data.model_dump())
    db.add(inv)
    db.commit()
    db.refresh(inv)
    inv = db.query(Inventario).options(joinedload(Inventario.bodega), joinedload(Inventario.producto)).filter(Inventario.id == inv.id).first()
    return build_response(inv)


@router.put("/{inv_id}", response_model=InventarioResponse)
def update_inventario(inv_id: int, data: InventarioUpdate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    inv = db.query(Inventario).filter(Inventario.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(inv, field, value)
    db.commit()
    db.refresh(inv)
    inv = db.query(Inventario).options(joinedload(Inventario.bodega), joinedload(Inventario.producto)).filter(Inventario.id == inv.id).first()
    return build_response(inv)


@router.post("/ajustar", response_model=InventarioResponse)
def ajustar_stock(data: AjusteStockRequest, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    inv = db.query(Inventario).filter(
        Inventario.bodega_id == data.bodega_id,
        Inventario.producto_id == data.producto_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Registro de inventario no encontrado")

    diferencia = data.nueva_cantidad - inv.cantidad_disponible
    tipo = "ENTRADA" if diferencia >= 0 else "SALIDA"
    inv.cantidad_disponible = data.nueva_cantidad

    movimiento = MovimientoInventario(
        inventario_id=inv.id,
        tipo=tipo,
        cantidad=abs(diferencia),
        motivo=data.motivo,
        usuario_id=current_user.id,
    )
    db.add(movimiento)
    db.commit()
    db.refresh(inv)
    inv = db.query(Inventario).options(joinedload(Inventario.bodega), joinedload(Inventario.producto)).filter(Inventario.id == inv.id).first()
    return build_response(inv)


@router.get("/movimientos/lista", response_model=List[MovimientoResponse])
def list_movimientos(
    inventario_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_active_user)
):
    q = db.query(MovimientoInventario)
    if inventario_id:
        q = q.filter(MovimientoInventario.inventario_id == inventario_id)
    return q.order_by(MovimientoInventario.created_at.desc()).limit(100).all()

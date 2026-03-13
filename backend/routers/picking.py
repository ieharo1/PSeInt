from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
import random, string
from core.database import get_db
from core.security import get_current_active_user
from models.picking import PickingOrder, PickingItem, EstadoPickingEnum
from models.inventario import Inventario
from schemas.picking import (
    PickingOrderCreate, PickingOrderUpdate, PickingOrderResponse,
    PickingItemUpdate, PickingItemResponse
)

router = APIRouter(prefix="/api/picking", tags=["Picking"])


def generate_order_number():
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{datetime.now().strftime('%Y%m%d')}-{suffix}"


def build_order_response(order: PickingOrder) -> dict:
    items = []
    for item in order.items:
        items.append({
            "id": item.id,
            "orden_id": item.orden_id,
            "producto_id": item.producto_id,
            "cantidad_solicitada": item.cantidad_solicitada,
            "cantidad_recogida": item.cantidad_recogida,
            "ubicacion": item.ubicacion,
            "completado": item.completado,
            "producto_nombre": item.producto.nombre if item.producto else None,
            "producto_sku": item.producto.sku if item.producto else None,
        })
    return {
        "id": order.id,
        "numero_orden": order.numero_orden,
        "estado": order.estado,
        "prioridad": order.prioridad,
        "bodega_origen_id": order.bodega_origen_id,
        "bodega_destino_id": order.bodega_destino_id,
        "asignado_a_id": order.asignado_a_id,
        "creado_por_id": order.creado_por_id,
        "notas": order.notas,
        "fecha_requerida": order.fecha_requerida,
        "fecha_completado": order.fecha_completado,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "items": items,
        "bodega_origen_nombre": order.bodega_origen.nombre if order.bodega_origen else None,
        "bodega_destino_nombre": order.bodega_destino.nombre if order.bodega_destino else None,
    }


@router.get("/", response_model=List[PickingOrderResponse])
def list_orders(
    estado: Optional[str] = None,
    bodega_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_active_user)
):
    q = db.query(PickingOrder).options(
        joinedload(PickingOrder.items).joinedload(PickingItem.producto),
        joinedload(PickingOrder.bodega_origen),
        joinedload(PickingOrder.bodega_destino),
    )
    if estado:
        q = q.filter(PickingOrder.estado == estado)
    if bodega_id:
        q = q.filter(PickingOrder.bodega_origen_id == bodega_id)
    orders = q.order_by(PickingOrder.created_at.desc()).all()
    return [build_order_response(o) for o in orders]


@router.get("/{order_id}", response_model=PickingOrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    order = db.query(PickingOrder).options(
        joinedload(PickingOrder.items).joinedload(PickingItem.producto),
        joinedload(PickingOrder.bodega_origen),
        joinedload(PickingOrder.bodega_destino),
    ).filter(PickingOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return build_order_response(order)


@router.post("/", response_model=PickingOrderResponse, status_code=201)
def create_order(data: PickingOrderCreate, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    if not data.items:
        raise HTTPException(status_code=400, detail="La orden debe tener al menos un ítem")

    order = PickingOrder(
        numero_orden=generate_order_number(),
        bodega_origen_id=data.bodega_origen_id,
        bodega_destino_id=data.bodega_destino_id,
        prioridad=data.prioridad,
        notas=data.notas,
        fecha_requerida=data.fecha_requerida,
        creado_por_id=current_user.id,
    )
    db.add(order)
    db.flush()

    for item_data in data.items:
        inv = db.query(Inventario).filter(
            Inventario.bodega_id == data.bodega_origen_id,
            Inventario.producto_id == item_data.producto_id
        ).first()
        ubicacion = inv.ubicacion_estante if inv else item_data.ubicacion

        item = PickingItem(
            orden_id=order.id,
            producto_id=item_data.producto_id,
            cantidad_solicitada=item_data.cantidad_solicitada,
            ubicacion=ubicacion or item_data.ubicacion,
        )
        db.add(item)

    db.commit()
    db.refresh(order)
    order = db.query(PickingOrder).options(
        joinedload(PickingOrder.items).joinedload(PickingItem.producto),
        joinedload(PickingOrder.bodega_origen),
        joinedload(PickingOrder.bodega_destino),
    ).filter(PickingOrder.id == order.id).first()
    return build_order_response(order)


@router.put("/{order_id}", response_model=PickingOrderResponse)
def update_order(order_id: int, data: PickingOrderUpdate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    order = db.query(PickingOrder).filter(PickingOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(order, field, value)

    if data.estado == EstadoPickingEnum.COMPLETADO:
        order.fecha_completado = datetime.utcnow()

    db.commit()
    db.refresh(order)
    order = db.query(PickingOrder).options(
        joinedload(PickingOrder.items).joinedload(PickingItem.producto),
        joinedload(PickingOrder.bodega_origen),
        joinedload(PickingOrder.bodega_destino),
    ).filter(PickingOrder.id == order.id).first()
    return build_order_response(order)


@router.put("/{order_id}/items/{item_id}", response_model=PickingItemResponse)
def update_item(
    order_id: int, item_id: int, data: PickingItemUpdate,
    db: Session = Depends(get_db), _=Depends(get_current_active_user)
):
    item = db.query(PickingItem).filter(PickingItem.id == item_id, PickingItem.orden_id == order_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Ítem no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return {
        "id": item.id,
        "orden_id": item.orden_id,
        "producto_id": item.producto_id,
        "cantidad_solicitada": item.cantidad_solicitada,
        "cantidad_recogida": item.cantidad_recogida,
        "ubicacion": item.ubicacion,
        "completado": item.completado,
        "producto_nombre": item.producto.nombre if item.producto else None,
        "producto_sku": item.producto.sku if item.producto else None,
    }


@router.get("/stats/resumen")
def get_stats(db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    from sqlalchemy import func
    total = db.query(func.count(PickingOrder.id)).scalar()
    pendientes = db.query(func.count(PickingOrder.id)).filter(PickingOrder.estado == "PENDIENTE").scalar()
    en_proceso = db.query(func.count(PickingOrder.id)).filter(PickingOrder.estado == "EN_PROCESO").scalar()
    completados = db.query(func.count(PickingOrder.id)).filter(PickingOrder.estado == "COMPLETADO").scalar()
    cancelados = db.query(func.count(PickingOrder.id)).filter(PickingOrder.estado == "CANCELADO").scalar()

    from models.bodega import Bodega
    from models.producto import Producto
    total_bodegas = db.query(func.count(Bodega.id)).filter(Bodega.is_active == True).scalar()
    total_productos = db.query(func.count(Producto.id)).filter(Producto.is_active == True).scalar()

    return {
        "ordenes": {
            "total": total,
            "pendientes": pendientes,
            "en_proceso": en_proceso,
            "completados": completados,
            "cancelados": cancelados,
        },
        "bodegas": total_bodegas,
        "productos": total_productos,
    }

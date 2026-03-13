from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.security import get_current_active_user
from models.bodega import Bodega
from schemas.bodega import BodegaCreate, BodegaUpdate, BodegaResponse

router = APIRouter(prefix="/api/bodegas", tags=["Bodegas"])


@router.get("/", response_model=List[BodegaResponse])
def list_bodegas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    return db.query(Bodega).filter(Bodega.is_active == True).offset(skip).limit(limit).all()


@router.get("/{bodega_id}", response_model=BodegaResponse)
def get_bodega(bodega_id: int, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    bodega = db.query(Bodega).filter(Bodega.id == bodega_id).first()
    if not bodega:
        raise HTTPException(status_code=404, detail="Bodega no encontrada")
    return bodega


@router.post("/", response_model=BodegaResponse, status_code=201)
def create_bodega(data: BodegaCreate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    if db.query(Bodega).filter(Bodega.codigo == data.codigo).first():
        raise HTTPException(status_code=400, detail="El código de bodega ya existe")
    bodega = Bodega(**data.model_dump())
    db.add(bodega)
    db.commit()
    db.refresh(bodega)
    return bodega


@router.put("/{bodega_id}", response_model=BodegaResponse)
def update_bodega(bodega_id: int, data: BodegaUpdate, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    bodega = db.query(Bodega).filter(Bodega.id == bodega_id).first()
    if not bodega:
        raise HTTPException(status_code=404, detail="Bodega no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(bodega, field, value)
    db.commit()
    db.refresh(bodega)
    return bodega


@router.delete("/{bodega_id}", status_code=204)
def delete_bodega(bodega_id: int, db: Session = Depends(get_db), _=Depends(get_current_active_user)):
    bodega = db.query(Bodega).filter(Bodega.id == bodega_id).first()
    if not bodega:
        raise HTTPException(status_code=404, detail="Bodega no encontrada")
    bodega.is_active = False
    db.commit()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
from sqlalchemy import text
from core.database import engine, init_db, SessionLocal
from core.security import get_password_hash
from routers import auth, bodegas, productos, inventario, picking

app = FastAPI(
    title="Sistema de Picking de Bodegas",
    description="API REST para gestión de picking y control de inventario multi-bodega",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(bodegas.router)
app.include_router(productos.router)
app.include_router(inventario.router)
app.include_router(picking.router)


def wait_for_db(retries=10, delay=3):
    for i in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Base de datos lista")
            return True
        except Exception as e:
            print(f"⏳ Esperando DB ({i+1}/{retries}): {e}")
            time.sleep(delay)
    return False


def seed_data():
    db = SessionLocal()
    try:
        from models.user import User, RolEnum
        from models.bodega import Bodega
        from models.producto import Producto, CategoriaEnum
        from models.inventario import Inventario

        if db.query(User).count() > 0:
            return

        print("🌱 Insertando datos de ejemplo...")

        admin = User(username="admin", email="admin@picking.com", full_name="Administrador", rol=RolEnum.ADMIN, hashed_password=get_password_hash("admin123"))
        op1 = User(username="operador1", email="op1@picking.com", full_name="Juan Pérez", rol=RolEnum.OPERADOR, hashed_password=get_password_hash("op123"))
        db.add_all([admin, op1])
        db.flush()

        b1 = Bodega(nombre="Bodega Central", codigo="BOD-001", direccion="Av. Principal 123", responsable="María García", telefono="022-555-001")
        b2 = Bodega(nombre="Bodega Norte", codigo="BOD-002", direccion="Calle Norte 456", responsable="Carlos López", telefono="022-555-002")
        b3 = Bodega(nombre="Bodega Sur", codigo="BOD-003", direccion="Av. Sur 789", responsable="Ana Martínez", telefono="022-555-003")
        db.add_all([b1, b2, b3])
        db.flush()

        p1 = Producto(nombre="Laptop Dell XPS 15", sku="TECH-001", categoria=CategoriaEnum.ELECTRONICO, precio_unitario=1299.99, unidad_medida="UNIDAD", peso_kg=1.8)
        p2 = Producto(nombre="Mouse Inalámbrico Logitech", sku="TECH-002", categoria=CategoriaEnum.ELECTRONICO, precio_unitario=45.99, unidad_medida="UNIDAD", peso_kg=0.1)
        p3 = Producto(nombre="Camiseta Polo Azul M", sku="ROPA-001", categoria=CategoriaEnum.ROPA, precio_unitario=25.00, unidad_medida="UNIDAD", peso_kg=0.2)
        p4 = Producto(nombre="Caja Herramientas Stanley", sku="TOOL-001", categoria=CategoriaEnum.HERRAMIENTAS, precio_unitario=89.99, unidad_medida="UNIDAD", peso_kg=3.5)
        p5 = Producto(nombre="Arroz Extra 50kg", sku="ALIM-001", categoria=CategoriaEnum.ALIMENTOS, precio_unitario=42.00, unidad_medida="SACO", peso_kg=50.0)
        db.add_all([p1, p2, p3, p4, p5])
        db.flush()

        inv_data = [
            (b1.id, p1.id, 50, 5, "A-01-01"), (b1.id, p2.id, 200, 20, "A-01-02"),
            (b1.id, p3.id, 150, 30, "B-02-01"), (b2.id, p1.id, 25, 5, "A-01-01"),
            (b2.id, p4.id, 80, 10, "C-03-01"), (b3.id, p5.id, 300, 50, "D-04-01"),
            (b3.id, p2.id, 10, 20, "A-02-01"),  # bajo stock
        ]
        for bid, pid, cant, minstk, ubi in inv_data:
            db.add(Inventario(bodega_id=bid, producto_id=pid, cantidad_disponible=cant, stock_minimo=minstk, ubicacion_estante=ubi))

        db.commit()
        print("✅ Datos de ejemplo insertados")
    except Exception as e:
        db.rollback()
        print(f"⚠️ Error en seed: {e}")
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    if wait_for_db():
        init_db()
        seed_data()


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Picking System API", "version": "1.0.0"}

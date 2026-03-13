# Sistema de Picking de Bodegas (FastAPI + React)
Sistema completo de gestión de picking con API REST segura, dashboard interactivo y módulos operativos.

---

## ✅ Descripción
Plataforma web con backend Python 3.11 + FastAPI, autenticación JWT, base de datos PostgreSQL y frontend React 18 con diseño moderno y responsivo.

---

## ✨ Características Principales

| Característica | Descripción |
|----------------|-------------|
| **picking** | Módulo operativo para órdenes de recogida |
| **inventario** | Control de stock por bodega con alertas |
| **bodegas** | Gestión multi-bodega |
| **productos** | Catálogo de productos con SKU |

---

## 📦 Módulos

- **picking** — Creación, asignación y seguimiento de órdenes de picking
- **inventario** — Stock por bodega, ajustes y movimientos
- **bodegas** — Alta, edición y control de bodegas
- **productos** — Catálogo con categorías, SKU y precios

---

## 📑 Entidades

- **Usuario**
- **Bodega**
- **Producto**
- **Inventario**
- **MovimientoInventario**
- **PickingOrder**
- **PickingItem**

---

## ⚙️ Funciones

- **Autenticación JWT** con roles (ADMIN, SUPERVISOR, OPERADOR)
- **Órdenes de picking** con estados (Pendiente → En Proceso → Completado)
- **Prioridades** (Baja, Media, Alta, Urgente)
- **Control de stock** por bodega con alertas de bajo inventario
- **Ajuste de stock** con trazabilidad de movimientos
- **Dashboard** con gráficos de estado y productos críticos
- **Datos semilla** automáticos al iniciar
- **API documentada** con Swagger UI

---

## 🧰 Stack Tecnológico

- Python 3.11 + FastAPI
- JWT (python-jose) + Passlib bcrypt
- SQLAlchemy 2.0 + PostgreSQL
- React 18 + React Router 6
- Recharts (gráficos)
- React Icons + React Hot Toast
- Docker + Docker Compose
- Nginx (servidor frontend)

---

## 🏗️ Arquitectura

Separación por capas y módulos:
1. **Backend:** routers, models, schemas, core (config, database, security)
2. **Frontend:** pages, components, services, hooks, styles
3. **Infra:** Docker y Docker Compose con PostgreSQL

---

## ✅ Instalación y Uso

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs

---

## 🔐 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | ADMIN |
| `operador1` | `op123` | OPERADOR |

---

## 🔌 API REST

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/bodegas/`
- `POST /api/bodegas/`
- `PUT /api/bodegas/{id}`
- `DELETE /api/bodegas/{id}`
- `GET /api/productos/`
- `POST /api/productos/`
- `PUT /api/productos/{id}`
- `GET /api/inventario/`
- `POST /api/inventario/`
- `POST /api/inventario/ajustar`
- `GET /api/inventario/movimientos/lista`
- `GET /api/picking/`
- `POST /api/picking/`
- `PUT /api/picking/{id}`
- `PUT /api/picking/{id}/items/{item_id}`
- `GET /api/picking/stats/resumen`

---

## 📁 Estructura del Proyecto

```
picking-system/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/
│   │   ├── user.py
│   │   ├── bodega.py
│   │   ├── producto.py
│   │   ├── inventario.py
│   │   └── picking.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── bodega.py
│   │   ├── producto.py
│   │   ├── inventario.py
│   │   └── picking.py
│   └── routers/
│       ├── auth.py
│       ├── bodegas.py
│       ├── productos.py
│       ├── inventario.py
│       └── picking.py
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── App.js
        ├── index.js
        ├── styles/globals.css
        ├── services/api.js
        ├── hooks/useAuth.js
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.jsx
        │   │   └── Sidebar.jsx
        │   └── common/
        │       └── PrivateRoute.jsx
        └── pages/
            ├── auth/Login.jsx
            ├── dashboard/Dashboard.jsx
            ├── bodegas/Bodegas.jsx
            ├── productos/Productos.jsx
            ├── inventario/Inventario.jsx
            └── picking/Picking.jsx
```

---

## 👨‍💻 Desarrollado por Isaac Esteban Haro Torres
Ingeniero en Sistemas - Full Stack - Automatización - Data

- Email: zackharo1@gmail.com
- WhatsApp: 098805517
- GitHub: https://github.com/ieharo1
- Portafolio: https://ieharo1.github.io/portafolio-isaac.haro/

---

© 2026 Isaac Esteban Haro Torres - Todos los derechos reservados.

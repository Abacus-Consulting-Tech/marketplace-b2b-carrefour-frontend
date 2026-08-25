# Módulo 1: Auth (Autenticación)

## 📋 Descripción

Sistema de autenticación y autorización con soporte para 3 roles:
- **Franchisee** (Franquiciado)
- **Supplier** (Proveedor)
- **Admin** (Administrador)

## 📄 Documentos para Backend

### AUTH_API_SPEC.md
- **Contenido**: Especificaciones completas de API con mock data
- **Incluye**:
  - Endpoints de autenticación (login, register, logout)
  - Endpoints de recuperación de contraseña
  - Gestión de sesiones
  - Datos mock de usuarios de prueba
- **Estado**: ✅ Enviado al backend
- **Ubicación Original**: `docs/technical/auth/AUTH_API_SPEC.md`

## 🔗 Endpoints Principales

```
POST /auth/customer/login
POST /auth/admin/login  
POST /auth/supplier/login
POST /auth/register
POST /auth/forgot-password
POST /auth/reset-password
GET /auth/me
POST /auth/logout
```

## 📊 Mock Data

- 3 usuarios de prueba (1 por rol)
- Contraseñas hasheadas
- Tokens JWT simulados

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: Enviado
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026

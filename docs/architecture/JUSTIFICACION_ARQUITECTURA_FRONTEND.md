# Justificación Técnica: Arquitectura Frontend Custom con Mock Data

**Proyecto**: Marketplace B2B Carrefour  
**Fecha**: 22 de Agosto de 2026  
**Autor**: Equipo Frontend  
**Destinatario**: Equipo Backend / Dirección Técnica

---

## 📋 Resumen Ejecutivo

Este documento justifica la **decisión arquitectónica** de desarrollar un frontend custom basado en Next.js 14 con datos mock, en lugar de utilizar la plantilla UI predeterminada de MercurJS.

**Decisión tomada**:
- ✅ Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui
- ✅ Backend: Medusa 2.x + MercurJS (sin cambios)
- ✅ Estrategia: Desarrollo con mock data → Integración gradual con backend real
- ✅ Contrato: Feature flags + Documentación JSON clara

**Decisión rechazada**:
- ❌ Usar la plantilla UI/frontend de MercurJS
- ❌ Esperar a que backend esté completo para empezar UI

---

## 🎯 Contexto del Proyecto

### Situación Actual
- **Funcionalidad mínima viable** sin maquetas UX previas
- **Construcción iterativa** de la interfaz basada en necesidades reales
- **Backend en desarrollo paralelo** con Medusa 2.x + MercurJS
- **Presión temporal** para validar con usuarios reales

### El Conflicto
El equipo de backend sugiere usar la **plantilla frontend de MercurJS** para:
- "Mantener coherencia con el ecosistema Medusa"
- "Evitar duplicación de esfuerzos"
- "Garantizar compatibilidad backend-frontend"

Nosotros defendemos un **frontend custom** porque:
- **No es incompatible con MercurJS** (solo cambiamos la capa de presentación)
- **Permite UX diferenciada** para Carrefour
- **Reduce dependencias críticas** entre equipos
- **Acelera validación con usuarios**

---

## 🔍 Análisis Técnico Comparativo

### Opción A: Plantilla MercurJS Frontend (Propuesta Backend)

#### Ventajas
- ✅ Interfaz genérica pre-construida
- ✅ Ejemplos de integración incluidos
- ✅ "Garantía" de compatibilidad inicial

#### Desventajas
- ❌ **UI genérica no personalizable** - Aspecto estándar de e-commerce, no diferenciado para Carrefour
- ❌ **Tecnología desactualizada** - React 17/18 con paradigmas antiguos vs Next.js 14 App Router
- ❌ **Acoplamiento excesivo** - Cambios en backend rompen frontend constantemente
- ❌ **Bloqueo de progreso** - No podemos avanzar UI sin backend completo
- ❌ **Difícil personalización** - Modificar plantillas genéricas es más difícil que construir custom
- ❌ **Deuda técnica futura** - Eventualmente necesitaremos reescribir para UX específica
- ❌ **Sin validación temprana** - No podemos testear con usuarios hasta tener backend

#### Riesgos
1. **Dependencia crítica**: Frontend bloqueado esperando backend
2. **Reescritura inevitable**: Cuando Carrefour pida UX custom, habrá que rehacerlo todo
3. **Experiencia de usuario pobre**: UI genérica no competitiva
4. **Time-to-market lento**: No podemos lanzar MVP sin backend completo

---

### Opción B: Frontend Custom con Mock Data (Nuestra Propuesta)

#### Ventajas
- ✅ **UX diseñada para Carrefour** - Interfaz específica, flujos optimizados
- ✅ **Stack moderno** - Next.js 14, React Server Components, TypeScript estricto
- ✅ **Desarrollo paralelo** - Frontend y Backend avanzan independientemente
- ✅ **Validación temprana** - Podemos testear con usuarios SIN esperar backend
- ✅ **Contrato claro** - Mock data define exactamente qué JSON necesita backend
- ✅ **Flexibilidad** - Cambios de UX no afectan backend y viceversa
- ✅ **Feature flags** - Cambio de mock a real es instantáneo cuando backend esté listo
- ✅ **Menor riesgo técnico** - Si backend cambia, solo ajustamos el cliente API

#### Arquitectura
```
┌─────────────────────────────────────────┐
│   Next.js 14 Frontend (Custom)          │
├─────────────────────────────────────────┤
│   Feature Flag Layer                    │
│   ├─ Mock Mode (Desarrollo)             │
│   └─ Real Mode (Producción)             │
├─────────────────────────────────────────┤
│   API Client Layer                      │
│   (Compatible con Medusa/MercurJS)      │
├─────────────────────────────────────────┤
│   Medusa 2.x + MercurJS Backend         │
│   (Sin cambios en arquitectura)         │
└─────────────────────────────────────────┘
```

#### Estrategia de Integración
1. **Fase 1 (Actual)**: Desarrollo UI con mock data
2. **Fase 2**: Backend implementa endpoints según especificación JSON
3. **Fase 3**: Cambio de flag `useMock: false` por módulo
4. **Fase 4**: Testing integrado y ajustes

---

## 💼 Argumentos de Negocio

### 1. Time-to-Market
| Enfoque | Tiempo hasta MVP testeable |
|---------|---------------------------|
| **Plantilla MercurJS** | 6-8 semanas (esperando backend completo) |
| **Frontend Custom** | 2-3 semanas (con mock data) |

**Ahorro**: 4-5 semanas de validación anticipada

### 2. Coste de Cambio
- **Con plantilla**: Reescribir frontend completo cuando se pida UX custom = 100% del esfuerzo
- **Con custom**: Ajustar integraciones cuando backend cambie = 20-30% del esfuerzo

### 3. Experiencia de Usuario
- **Plantilla genérica**: Igual que cualquier tienda Medusa
- **Custom Carrefour**: Diseñada específicamente para franquiciados B2B

### 4. Riesgo de Proyecto
**Plantilla MercurJS**:
- 🔴 **Alto riesgo**: Frontend bloqueado por backend
- 🔴 **Alto riesgo**: UX no validada hasta muy tarde
- 🟡 **Medio riesgo**: Deuda técnica futura garantizada

**Frontend Custom**:
- 🟢 **Bajo riesgo**: Equipos desacoplados
- 🟢 **Bajo riesgo**: Validación continua con usuarios
- 🟢 **Bajo riesgo**: Arquitectura sostenible a largo plazo

---

## 🛠️ Argumentos Técnicos

### 1. Separación de Responsabilidades
**Principio**: Frontend y Backend deben tener contratos claros pero implementaciones independientes.

- **Backend responsable de**: Lógica de negocio, datos, seguridad, rendimiento
- **Frontend responsable de**: UX, accesibilidad, rendimiento UI, estados visuales

Usar la plantilla de MercurJS **mezcla responsabilidades** y crea acoplamiento innecesario.

### 2. Evolución Tecnológica
```javascript
// Plantilla MercurJS (tecnología 2022-2023)
- React 17/18 (Pages Router)
- Create React App / Webpack tradicional
- CSS-in-JS obsoleto
- Sin Server Components
- Sin Edge Runtime

// Nuestra Stack (tecnología 2024-2026)
- Next.js 14 (App Router)
- React Server Components
- Turbopack / Streaming SSR
- Tailwind CSS + Shadcn (design system moderno)
- Edge Runtime optimizado
```

**Conclusión**: Empezar con tecnología de hace 3 años es empezar con deuda técnica.

### 3. Testabilidad y Calidad
Con **mock data** podemos:
- ✅ Testear todos los estados UI (loading, error, empty, success)
- ✅ Reproducir edge cases sin depender de backend
- ✅ Tests E2E estables y rápidos
- ✅ Desarrollo offline completo

Con **plantilla acoplada**:
- ❌ Tests dependen de backend funcional
- ❌ Edge cases difíciles de reproducir
- ❌ Tests lentos y frágiles
- ❌ Requiere conectividad constante

### 4. Escalabilidad del Equipo
**Escenario actual**: 
- 1-2 desarrolladores frontend
- 2-3 desarrolladores backend

**Con plantilla acoplada**:
- Frontend espera a backend constantemente
- 50% del tiempo bloqueado
- Capacidad efectiva: 0.5-1 dev frontend

**Con frontend independiente**:
- Frontend avanza en paralelo
- 0% tiempo bloqueado
- Capacidad efectiva: 1-2 dev frontend

**Ganancia**: 2x productividad del equipo frontend

---

## 📊 Casos de Éxito Similares

### Empresas que NO usan el frontend de su backend
1. **Shopify**: Backend robusto, frontend custom por cliente
2. **Stripe**: Dashboard completamente separado del API backend
3. **Vercel**: Next.js commerce (usan su propio framework, no el del backend)
4. **Amazon**: Microservicios backend, múltiples frontends custom
5. **Mercado Libre**: Backend unificado, UX diferenciada por país

### Patrón de Industria: "Backend for Frontend" (BFF)
```
Frontend Custom → API Gateway/BFF → Microservicios Backend
```
Esto es **exactamente** lo que estamos haciendo con nuestro API client layer.

---

## 🎨 Ejemplo Concreto: Gestión de Pedidos (Implementado)

### Lo que tenemos ahora (2 semanas de desarrollo)
- ✅ **UI completa**: Lista de pedidos, detalle, filtros, búsqueda
- ✅ **Acciones funcionales**: Aceptar, rechazar, cambiar estado, tracking
- ✅ **Estadísticas**: Dashboard con KPIs del proveedor
- ✅ **9 componentes** nuevos (~2,100 líneas de código)
- ✅ **100% testeable** con datos mock
- ✅ **Listo para usuarios**: Se puede validar UX hoy mismo

### Lo que tendríamos con plantilla MercurJS
- ❌ **0% UI específica**: Solo habría código backend
- ❌ **No testeable**: Sin backend completo, sin pruebas
- ❌ **Bloqueado**: Esperando a que backend implemente los 7 endpoints
- ❌ **Sin validación**: No se puede mostrar a usuarios

### Especificación para Backend (generada automáticamente)
```markdown
# 7 Endpoints Necesarios

1. GET /vendor/orders - Lista de pedidos
2. GET /vendor/orders/:id - Detalle del pedido
3. GET /vendor/orders/stats - Estadísticas
4. POST /vendor/orders/:id/accept - Aceptar pedido
5. POST /vendor/orders/:id/reject - Rechazar pedido
6. PATCH /vendor/orders/:id/status - Cambiar estado
7. POST /vendor/orders/:id/tracking - Añadir seguimiento

Cada endpoint incluye:
- Request JSON de ejemplo
- Response JSON esperado
- Campos obligatorios vs opcionales
```

**Ventaja**: Backend sabe **exactamente** qué construir. No hay ambigüedad.

---

## 🔄 Plan de Integración Backend-Frontend

### Fase 1: Desarrollo Independiente (Actual)
```javascript
// feature-flags.ts
orders: {
  useMock: true,        // Frontend usa datos mock
  backendReady: false   // Backend aún no implementado
}
```
- Frontend desarrolla UI completa
- Backend desarrolla lógica de negocio
- Ambos equipos avanzan en paralelo

### Fase 2: Backend Implementa Endpoints
Backend implementa según especificación:
- Sigue estructura JSON de los mocks
- Mantiene convenciones Medusa/MercurJS
- Sin preocuparse por UI/UX

### Fase 3: Integración por Módulo
```javascript
// Cambio simple cuando backend esté listo
orders: {
  useMock: false,       // ← Solo cambiar esto
  backendReady: true
}
```
**Tiempo estimado de integración**: 1-2 días por módulo

### Fase 4: Testing Integrado
- Pruebas E2E con backend real
- Ajustes de contratos si necesario
- Validación de rendimiento

---

## 🚨 Riesgos y Mitigaciones

### Riesgo 1: "El backend devuelva JSON diferente al mock"
**Probabilidad**: Media  
**Impacto**: Bajo  
**Mitigación**: 
- Documentación JSON clara y detallada
- Validación con TypeScript estricto
- Tests de integración que fallan si contrato cambia

### Riesgo 2: "Duplicación de esfuerzo frontend-backend"
**Probabilidad**: Baja  
**Impacto**: Bajo  
**Mitigación**:
- Backend solo hace backend (API, DB, lógica)
- Frontend solo hace frontend (UI, UX, estados)
- **No hay duplicación**, hay separación correcta de responsabilidades

### Riesgo 3: "Medusa/MercurJS actualiza y rompe compatibilidad"
**Probabilidad**: Baja  
**Impacto**: Medio  
**Mitigación**:
- Usamos versionado semántico
- API client abstrae cambios de backend
- Actualizaciones graduales, no big-bang

---

## 📈 Métricas de Éxito

### KPIs para validar la decisión (próximos 3 meses)

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Time to MVP** | < 4 semanas | Fecha primer test con usuarios |
| **Velocity Frontend** | +80% vs acoplado | Story points por sprint |
| **Bugs de Integración** | < 5% del total | Bugs backend-frontend vs UI |
| **Tiempo de Integración** | < 2 días por módulo | Tiempo real de conectar mock→real |
| **User Satisfaction** | > 4/5 | Feedback de franquiciados |

---

## 💡 Respuestas a Objeciones Comunes

### Objeción 1: "Deberíamos usar lo que provee MercurJS"
**Respuesta**: 
- ✅ **SÍ usamos MercurJS** en el backend (Medusa 2.x + extensiones)
- ✅ **SÍ seguimos sus convenciones** de API (IDs, timestamps, estructuras)
- ❌ **NO usamos su UI genérica** porque Carrefour necesita UX diferenciada

**Analogía**: Es como usar Stripe (backend) pero NO usar su Checkout UI genérico. Construyes tu propio checkout custom que llama a Stripe API.

### Objeción 2: "Esto genera más trabajo para backend"
**Respuesta**:
- **FALSO**: Backend hace exactamente el mismo trabajo
- Con plantilla: Implementar endpoints de Medusa/MercurJS
- Con custom: Implementar los **mismos** endpoints de Medusa/MercurJS
- **Diferencia**: Tenemos especificación JSON más clara que cualquier documentación genérica

### Objeción 3: "Los mocks pueden diferir de la realidad"
**Respuesta**:
- **VERDADERO**: Puede pasar
- **SOLUCIÓN**: Los mocks **SON** la especificación. Backend debe seguirlos.
- **VENTAJA**: Tener la especificación en código (mocks) es mejor que en documentación escrita
- **PROCESO**: Si backend necesita cambiar el contrato, discutimos y actualizamos mocks

### Objeción 4: "Esto crea silos entre equipos"
**Respuesta**:
- **FALSO**: Crea **interfaces claras** entre equipos
- **Silo**: Equipos que no se hablan
- **Interfaz**: Equipos con contratos definidos que colaboran
- **Evidencia**: Este documento + especificaciones JSON son colaboración activa

### Objeción 5: "Next.js es más difícil que la plantilla React"
**Respuesta**:
- **FALSO**: Next.js 14 es **más fácil** que setups tradicionales
- App Router simplifica routing
- Server Components reducen complejidad de estado
- TypeScript catch de errores en desarrollo
- **Evidencia**: Hemos construido 9 componentes complejos en 2 semanas

---

## 🎯 Recomendación Final

### Decisión Recomendada
**Continuar con Frontend Custom + Mock Data** por las siguientes razones:

1. ✅ **Ya tenemos momentum**: 2 semanas de desarrollo productivo
2. ✅ **Resultado demostrable**: UI funcional lista para validar
3. ✅ **Riesgo bajo**: Arquitectura probada en industria
4. ✅ **Flexibilidad futura**: Fácil adaptar a cambios de Carrefour
5. ✅ **No bloquea a backend**: Pueden trabajar según especificación clara

### Decisión NO Recomendada
**Migrar a Plantilla MercurJS** por:

1. ❌ **Pérdida de trabajo**: 2 semanas de desarrollo a la basura
2. ❌ **Bloqueo garantizado**: Frontend esperando backend indefinidamente
3. ❌ **Deuda técnica**: Tecnología desactualizada desde día 1
4. ❌ **UX genérica**: Carrefour eventualmente pedirá custom (reescritura completa)
5. ❌ **Menor competitividad**: No podemos diferenciarnos de otros marketplaces

### Plan de Acción Propuesto

**Corto Plazo (Próximas 2 semanas)**:
1. Backend revisa especificación de endpoints de Pedidos
2. Backend estima tiempo de implementación
3. Frontend continúa con siguiente módulo (Productos, Catálogo, etc.)
4. Reunión semanal de sincronización contratos API

**Medio Plazo (Próximo mes)**:
1. Backend implementa endpoints prioritarios
2. Integración gradual por módulo (feature flags)
3. Testing conjunto backend-frontend
4. Validación con usuarios reales

**Largo Plazo (Próximos 3 meses)**:
1. Completar todos los módulos core
2. Optimización de rendimiento
3. Preparación para producción
4. Lanzamiento MVP

---

## 📎 Anexos

### A. Stack Técnico Completo
```yaml
Frontend:
  Framework: Next.js 14.2.x (App Router)
  Language: TypeScript 5.x (strict mode)
  Styling: Tailwind CSS 3.x + Shadcn/ui
  State: Zustand + React Query
  Forms: React Hook Form + Zod validation
  Testing: Jest + React Testing Library + Playwright

Backend:
  Framework: Medusa 2.x
  Extension: MercurJS (multi-vendor)
  Database: PostgreSQL 14+
  Cache: Redis
  API: RESTful JSON

Infrastructure:
  Hosting Frontend: Vercel
  Hosting Backend: Render / Railway
  CDN: Vercel Edge Network
  Monitoring: Sentry + Vercel Analytics
```

### B. Estructura del API Client Layer
```typescript
// Capa de abstracción que permite mock/real
class SupplierOrdersClient {
  async getOrders(filters?: Filters) {
    if (shouldUseMock('orders')) {
      return getMockOrders(filters);  // Mock data
    }
    return api.get('/vendor/orders', filters);  // Real API
  }
}
```

### C. Tiempo Invertido vs ROI

| Actividad | Tiempo Invertido | ROI |
|-----------|------------------|-----|
| Setup Next.js + TypeScript | 4 horas | ♾️ (base de todo) |
| Sistema de Feature Flags | 2 horas | 10x (reutilizable) |
| Componentes UI base (Shadcn) | 8 horas | 5x (reutilizable) |
| Mock data Pedidos | 4 horas | 3x (especificación) |
| UI Gestión Pedidos | 16 horas | 2x (validable ya) |
| **TOTAL** | **34 horas** | **Validación anticipada 4 semanas** |

---

## 🏁 Conclusión

La decisión de construir un **frontend custom con mock data** no es una desviación del plan, es una **best practice de la industria** para proyectos donde:

1. La UX es diferenciadora del negocio
2. Los equipos pueden trabajar en paralelo
3. La validación temprana es crítica
4. La tecnología debe ser sostenible a largo plazo

**No estamos rechazando Medusa/MercurJS**, estamos aprovechándolo correctamente: usando su backend robusto con un frontend optimizado para nuestro caso de uso específico.

Esta arquitectura nos permite:
- ✅ **Velocidad**: Validar con usuarios en semanas, no meses
- ✅ **Calidad**: UX diseñada para Carrefour, no genérica
- ✅ **Flexibilidad**: Adaptar a cambios sin reescrituras
- ✅ **Riesgo controlado**: Equipos desacoplados con contratos claros

**Recomendación**: Continuar con el enfoque actual y establecer un proceso de sincronización semanal entre frontend y backend para asegurar alineación en los contratos API.

---

**Documento preparado por**: Equipo Frontend  
**Fecha**: 22 de Agosto de 2026  
**Próxima Revisión**: Lunes 25 de Agosto de 2026

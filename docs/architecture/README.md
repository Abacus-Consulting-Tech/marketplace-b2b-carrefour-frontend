# Decisiones de Arquitectura

Esta carpeta contiene documentos sobre decisiones técnicas clave, alineación con backend y notas de reuniones técnicas.

## 🏗️ Documentos Disponibles

### [JUSTIFICACION_ARQUITECTURA_FRONTEND.md](./JUSTIFICACION_ARQUITECTURA_FRONTEND.md)
**Defensa de la Arquitectura Custom**

Documento que justifica la decisión de usar una arquitectura custom de Next.js en lugar de las plantillas estándar de MercurJS.

**Contenido:**
- Comparativa: Custom vs Plantilla MercurJS
- Ventajas de la arquitectura custom
- Desventajas y mitigaciones
- Decisión final y recomendaciones

**Conclusión**: Arquitectura custom Next.js aprobada para mayor flexibilidad, control y experiencia de usuario.

### [BACKEND_ROADMAP.md](./BACKEND_ROADMAP.md)
**Roadmap de Integración con Backend**

Plan detallado de integración con el backend Medusa/MercurJS.

**Contenido:**
- Fases de integración
- Módulos priorizados
- Estrategia de migración mock→real
- Feature flags y deployment
- Timeline estimado

**Estado**: Documento de planificación activo

### [MEETING_NOTES_BACKEND_ALIGNMENT.md](./MEETING_NOTES_BACKEND_ALIGNMENT.md)
**Notas de Reuniones Técnicas**

Registro de reuniones de alineación entre frontend (Abacus) y backend (Infocus).

**Contenido:**
- Decisiones tomadas en reuniones
- Acuerdos sobre contratos API
- Issues identificados
- Próximos pasos acordados
- Responsables y fechas

**Uso**: Referencia histórica de decisiones técnicas

---

## 🎯 Decisiones Clave Registradas

### 1. Arquitectura Frontend
**Decisión**: Custom Next.js architecture  
**Razón**: Flexibilidad, control total, mejor UX  
**Documento**: JUSTIFICACION_ARQUITECTURA_FRONTEND.md  
**Fecha**: Estimado Semana 1-2

### 2. Stack Técnico
**Frontend**: Next.js 14 + TypeScript + Tailwind + Shadcn/ui  
**Backend**: MercurJS 2.x / Medusa  
**Pagos**: Stripe Billing + Payment Intents + Connect  
**Contabilidad**: Odoo de la gestoría  
**Documento**: Especificación Técnica v1.0 (en specs/)

### 3. Estrategia de Integración
**Decisión**: Feature flags + migración gradual  
**Razón**: Permite desarrollo paralelo frontend/backend  
**Documento**: BACKEND_ROADMAP.md  
**Estado**: En ejecución

### 4. Modelo de Datos
**Decisión**: Alineado con Medusa 2.x  
**Razón**: Compatibilidad con backend  
**Documento**: Types en src/types/  
**Referencias**: Especificación Técnica v1.0

---

## 📝 Próximas Decisiones (Pendientes)

### Sprint 0 - 6 Decisiones Bloqueantes
Según Especificación Técnica v1.0, estas decisiones deben tomarse **ANTES** de desarrollar conector Odoo y motor de liquidaciones:

1. **D-01**: ¿Versión exacta de Odoo? (Community/Enterprise, hosting)
2. **D-02**: ¿Quién emite facturas? (Bloqueante fiscal)
3. **D-03**: ¿Infocus como intermediario o revendedor?
4. **D-04**: ¿Cómo se registra cobro en Odoo?
5. **D-05**: ¿Quién soporta costes Stripe y chargebacks?
6. **D-06**: ¿Periodicidad de liquidaciones?

**Responsable**: Infocus + Gestoría + Asesoría  
**Deadline**: Sprint 0 (antes de Fase 5 del spec)

---

## 🔍 Para Nuevos Desarrolladores

**Si necesitas entender decisiones pasadas:**
1. Lee JUSTIFICACION_ARQUITECTURA_FRONTEND.md
2. Revisa MEETING_NOTES_BACKEND_ALIGNMENT.md
3. Consulta Especificación Técnica v1.0 (en specs/)

**Si necesitas proponer cambios:**
1. Documenta la propuesta
2. Añádela a MEETING_NOTES_BACKEND_ALIGNMENT.md
3. Discute en reunión técnica
4. Actualiza documentos según decisión

---

Volver al [índice principal](../README.md)

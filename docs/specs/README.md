# Especificaciones y Requisitos

Esta carpeta contiene documentos de especificación funcional y técnica del proyecto.

## 📄 Documentos Disponibles

### [FEATURES.md](./FEATURES.md)
Lista completa de features del marketplace B2B Carrefour, organizadas por módulo y rol de usuario.

### [MODULES_ORGANIZATION.md](./MODULES_ORGANIZATION.md)
Organización lógica de módulos, estructura de carpetas y convenciones de documentación.

### [ADMIN_ORDERS_SPEC.md](./ADMIN_ORDERS_SPEC.md)
Especificación técnica detallada del módulo de Admin Orders (vista global de pedidos).

### Especificación Técnica v1.0 (PDF - 23 páginas)
**Documento oficial Infocus/Abacus** con:
- 18 módulos funcionales (M01-M18)
- Arquitectura lógica y física
- Stack tecnológico (MercurJS, Medusa, Stripe, Odoo)
- 7 fases de implementación + Sprint 0
- 6 decisiones bloqueantes (D-01 a D-06)
- 15 decisiones totales (D-01 a D-15)
- Integración Stripe Billing + Connect
- Integración Odoo para contabilidad
- Motor de liquidaciones
- Seguridad, privacidad y cumplimiento
- Modelo de datos completo
- APIs y eventos

**Decisiones Bloqueantes Sprint 0:**
- D-01: Versión exacta de Odoo
- D-02: Quién emite facturas (bloqueante fiscal)
- D-03: Infocus intermediario o revendedor
- D-04: Registro contable de cobros en Odoo
- D-05: Costes Stripe y chargebacks
- D-06: Periodicidad de liquidaciones

---

## 🎯 Para qué usar estos documentos

**Durante desarrollo:**
- Consultar FEATURES.md para saber qué debe hacer cada módulo
- Revisar la Especificación Técnica para arquitectura y decisiones
- Usar MODULES_ORGANIZATION para saber dónde documentar

**Para demos y presentaciones:**
- FEATURES.md como referencia de funcionalidades
- Especificación Técnica v1.0 para alineación con cliente

**Para planificación:**
- Especificación Técnica v1.0 para roadmap (7 fases)
- ADMIN_ORDERS_SPEC.md como ejemplo de documentación de módulo

---

Volver al [índice principal](../README.md)

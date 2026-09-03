/**
 * Dev Tools Page
 * 
 * Comprehensive documentation of all Medusa API endpoints used in the application.
 * 
 * 🌐 BACKEND INTEGRATION STATUS (Updated 2026-09-03):
 * ✅ Auth: REAL API - VALIDATED
 * ✅ Admin Orders: REAL API - VALIDATED
 * ✅ Supplier/Vendor Orders: REAL API - VALIDATED
 * ✅ Pricing Module: REAL API - VALIDATED (seller catalog endpoints fixed 2026-09-01)
 * ✅ Excel Import: REAL API - INTEGRATED
 * ✅ Sellers: REAL API - VALIDATED
 * ✅ Quotes: REAL API - VALIDATED
 * ⚠️ Franchisees: admin customers still hit RBAC `403`, but invitations and public registration now call real backend by default
 * ⚠️ Openings: backend route `/openings/projects` responds `404`; frontend kept in mock for DEV
 * ⚠️ Products/Catalog: real endpoints respond but are currently empty in DEV; frontend kept in mock for DEV catalog/product UI
 * ⚠️ Checkout: kept in mock because Store API catalog is empty and cart flow cannot be validated end-to-end
 * 
 * 🎯 CURRENT DEV DECISION (2026-09-03):
 * - Keep REAL in `auth`, `suppliers`, `pricing`, `orders`, `quotes`
 * - Keep HYBRID in `franchisees` (real onboarding, mock admin list/detail while `/admin/customers` stays blocked)
 * - Keep MOCK in `openings`, `products`, `catalog`, `checkout`, `categories`
 * 
 * Endpoint Summary (Total: 148 endpoints):
 * - Auth: 5 endpoints (login unificado, fallbacks legacy, sesión) ✅ REAL
 * - Admin: 1 endpoint (usuario actual) ✅ REAL
 * - Suppliers: 3 endpoints (sellers admin + vendor actual) ✅ REAL
 * - Franchisees: 17 endpoints (customers admin + onboarding + stores/invoices surfaces) ⚠️ HÍBRIDO EN DEV
 * - Openings: 24 endpoints (projects, categories, documents, invitations, quotes, financing, status) ⚠️ MOCK EN DEV
 * - Pricing + Excel Import: 20 endpoints (pending products, markups, seller catalog, imports) ✅ REAL CON FALLBACK TEMPORAL
 * - Products: 8 endpoints (CRUD admin, stats, bulk operations, inventory) ⚠️ MOCK EN DEV
 * - Catalog: 2 endpoints (listado y detalle marketplace) ⚠️ MOCK EN DEV
 * - Store: 1 endpoint (regions) ⚠️ SIN VALIDAR
 * - Cart: 6 endpoints (cart operations + shipping options) ⚠️ SIN VALIDAR
 * - Checkout: 24 endpoints (address, shipping, payment, complete, order) ⚠️ MOCK EN DEV
 * - Orders: 22 endpoints (admin, franchisee y supplier/vendor) ✅ REAL
 * - Quotes: 14 endpoints (franchisee + supplier) ✅ REAL
 * - Franchisee Management: 6 endpoints (CRUD, status, stats) ⚠️ SIN VALIDAR
 * 
 * Backend: https://marketplace-b2b-backend-dev.onrender.com
 * Status: ⚠️ HYBRID DEV MODE (real where validated, mock where backend remains broken/incomplete)
 * Confidence: 🟡 MEDIUM-HIGH (targeted real smoke validation completed 2026-08-31)
 * 
 * Features:
 * - Filter by module
 * - Status tracking (working/broken/untested)
 * - Mock vs Real API indicator (✅ = Real, 🎭 = Mock)
 * - Feature flags configuration
 * - Environment variables
 * - Test credentials
 * - Current session info
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertCircle, Database, Cloud, Settings, Code } from 'lucide-react';
import { featureFlags } from '@/config/feature-flags';
import {
  shouldUseMockFranchiseeInvitations,
  shouldUseMockFranchiseeRegistration,
} from '@/lib/config/franchisee-onboarding';
import { useAuthStore } from '@/lib/store/auth';

interface EndpointInfo {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  module: string;
  description: string;
  usesRealAPI: boolean;
  status: 'working' | 'broken' | 'untested';
  requiresAuth: boolean;
  medusaEndpoint?: string;
}

export default function DevToolsPage() {
  const { user, token } = useAuthStore();
  const [endpoints, setEndpoints] = useState<EndpointInfo[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    // Definir todos los endpoints de Medusa que usa la aplicación
    const allEndpoints: EndpointInfo[] = [
      // ========================================================================
      // AUTH MODULE
      // ========================================================================
      {
        path: '/auth/login',
        method: 'POST',
        module: 'auth',
        description: 'Login unificado MVP para admin, franchisee y supplier',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'working',
        requiresAuth: false,
        medusaEndpoint: '/auth/login'
      },
      {
        path: '/auth/user/emailpass',
        method: 'POST',
        module: 'auth',
        description: 'Login legacy de admin/franchisee (fallback)',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'working',
        requiresAuth: false,
        medusaEndpoint: '/auth/user/emailpass'
      },
      {
        path: '/auth/member/emailpass',
        method: 'POST',
        module: 'auth',
        description: 'Login legacy de proveedor/supplier (fallback)',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'working',
        requiresAuth: false,
        medusaEndpoint: '/auth/member/emailpass'
      },
      {
        path: '/auth/session',
        method: 'GET',
        module: 'auth',
        description: 'Obtener sesión actual',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/auth/session'
      },
      {
        path: '/auth/session',
        method: 'DELETE',
        module: 'auth',
        description: 'Cerrar sesión',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/auth/session'
      },
      
      // ========================================================================
      // ADMIN MODULE - Standard Medusa
      // ========================================================================
      {
        path: '/admin/users/me',
        method: 'GET',
        module: 'admin',
        description: 'Obtener usuario actual (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/users/me'
      },
      {
        path: '/admin/sellers',
        method: 'GET',
        module: 'suppliers',
        description: 'Listar sellers (MercurJS)',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/sellers'
      },
      {
        path: '/admin/sellers/:id',
        method: 'GET',
        module: 'suppliers',
        description: 'Detalle de seller / proveedor para el directorio admin',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/sellers/:id'
      },
      {
        path: '/admin/sellers/:id',
        method: 'PATCH',
        module: 'suppliers',
        description: 'Editar datos del proveedor desde el directorio admin (consumido por UI, no revalidado en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/sellers/:id'
      },
      {
        path: '/admin/sellers/:id',
        method: 'DELETE',
        module: 'suppliers',
        description: 'Eliminar proveedor desde el directorio admin (consumido por UI, no revalidado en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/sellers/:id'
      },
      {
        path: '/admin/suppliers/invitations',
        method: 'POST',
        module: 'suppliers',
        description: 'Invitar proveedor al flujo de onboarding (frontend mock validado en UI, contrato pendiente)',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/suppliers/invitations'
      },
      {
        path: '/supplier/register',
        method: 'POST',
        module: 'suppliers',
        description: 'Autorregistro público del proveedor sin password inicial; crea solicitud pending_approval',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/supplier/register'
      },
      {
        path: '/admin/suppliers/:id/status',
        method: 'PATCH',
        module: 'suppliers',
        description: 'Acción de workflow para aprobar/rechazar onboarding de proveedor y mover onboarding_status (cola de pendientes admin)',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/suppliers/:id/status'
      },
      
      // ========================================================================
      // FRANCHISEES MODULE (Medusa Customers) - RBAC ISSUE
      // Note: Returns 403 Forbidden - permission issue in backend
      // ========================================================================
      {
        path: '/admin/customers',
        method: 'GET',
        module: 'franchisees',
        description: 'Listar franquiciados (403 - RBAC)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'broken',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers'
      },
      {
        path: '/admin/customers/:id',
        method: 'GET',
        module: 'franchisees',
        description: 'Detalle de franquiciado (403 - RBAC)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'broken',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id'
      },
      {
        path: '/admin/customers',
        method: 'POST',
        module: 'franchisees',
        description: 'Crear franquiciado (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers'
      },
      {
        path: '/admin/customers/:id',
        method: 'POST',
        module: 'franchisees',
        description: 'Actualizar franquiciado (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id'
      },
      {
        path: '/admin/customers/:id',
        method: 'DELETE',
        module: 'franchisees',
        description: 'Eliminar franquiciado (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id'
      },
      {
        path: '/admin/customers/:id/addresses',
        method: 'GET',
        module: 'franchisees',
        description: 'Listar direcciones de franquiciado (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id/addresses'
      },
      {
        path: '/admin/customers/:id/addresses',
        method: 'POST',
        module: 'franchisees',
        description: 'Añadir dirección a franquiciado (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id/addresses'
      },
      {
        path: '/admin/customers/:id/addresses/:addressId',
        method: 'PATCH',
        module: 'franchisees',
        description: 'Actualizar dirección (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id/addresses/:addressId'
      },
      {
        path: '/admin/customers/:id/addresses/:addressId',
        method: 'DELETE',
        module: 'franchisees',
        description: 'Eliminar dirección (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/customers/:id/addresses/:addressId'
      },

      // ========================================================================
      // FRANCHISEE SELF-SERVICE (Contract received 2026-09-03 — still not revalidated end-to-end in DEV)
      // See docs/modules/12-franchisee-management/FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md
      // ========================================================================
      {
        path: '/admin/franchisees/invitations',
        method: 'POST',
        module: 'franchisees',
        description: 'Invitar franquiciado (nombre + email, devuelve registrationUrl con token de un solo uso para /franchisee/register)',
        usesRealAPI: !shouldUseMockFranchiseeInvitations,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees/invitations'
      },
      {
        path: '/franchisee/register',
        method: 'POST',
        module: 'franchisees',
        description: 'Autoregistro público con invitationToken + password; crea pending_approval y solo acepta stripePaymentMethodId si billing está habilitado; puede devolver billing.client_secret',
        usesRealAPI: !shouldUseMockFranchiseeRegistration,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/franchisee/register'
      },
      {
        path: '/webhooks/stripe',
        method: 'POST',
        module: 'franchisees',
        description: 'Webhook Stripe para altas, renovaciones y fallos de suscripción; actualiza subscription_status, stripe ids y current_period_end',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/webhooks/stripe'
      },
      {
        path: '/franchisee/:id/invoices',
        method: 'GET',
        module: 'franchisees',
        description: 'Listar facturas del franquiciado para su perfil (UI ya preparada; backend pendiente)',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/:id/invoices'
      },
      {
        path: '/franchisee/stores',
        method: 'GET',
        module: 'franchisees',
        description: 'Listar tiendas del franquiciado autenticado (mock, persistido en localStorage)',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/stores'
      },
      {
        path: '/franchisee/stores',
        method: 'POST',
        module: 'franchisees',
        description: 'Añadir tienda del franquiciado (mock, persistido en localStorage)',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/stores'
      },
      {
        path: '/franchisee/stores/:id',
        method: 'DELETE',
        module: 'franchisees',
        description: 'Eliminar tienda del franquiciado (mock, persistido en localStorage)',
        usesRealAPI: false,
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/stores/:id'
      },

      // ========================================================================
      // OPENINGS MODULE (Custom)
      // ========================================================================
      {
        path: '/admin/openings/projects',
        method: 'GET',
        module: 'openings',
        description: 'Listar proyectos de aperturas (frontend mantenido en mock; backend no validado en esta ronda)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'broken',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects'
      },
      {
        path: '/admin/openings/projects/:id',
        method: 'GET',
        module: 'openings',
        description: 'Detalle de proyecto de apertura (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id'
      },
      {
        path: '/admin/openings/projects',
        method: 'POST',
        module: 'openings',
        description: 'Crear proyecto de apertura (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects'
      },
      {
        path: '/admin/openings/projects/:id',
        method: 'PATCH',
        module: 'openings',
        description: 'Actualizar proyecto de apertura (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id'
      },
      {
        path: '/admin/openings/projects/:id',
        method: 'DELETE',
        module: 'openings',
        description: 'Eliminar proyecto (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id'
      },
      {
        path: '/admin/openings/projects/:id/categories',
        method: 'GET',
        module: 'openings',
        description: 'Categorías del proyecto (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/categories'
      },
      {
        path: '/admin/openings/projects/:id/categories',
        method: 'POST',
        module: 'openings',
        description: 'Añadir categoría al proyecto (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/categories'
      },
      {
        path: '/admin/openings/projects/:id/quotes',
        method: 'GET',
        module: 'openings',
        description: 'Presupuestos del proyecto (no validado en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/quotes'
      },
      
      // Document Management (NEW - 4 endpoints)
      {
        path: '/admin/openings/projects/:id/documents',
        method: 'POST',
        module: 'openings',
        description: 'Subir documento/plano técnico al proyecto',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/documents'
      },
      {
        path: '/admin/openings/projects/:id/documents',
        method: 'GET',
        module: 'openings',
        description: 'Listar documentos técnicos del proyecto',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/documents'
      },
      {
        path: '/admin/openings/projects/:id/documents/:documentId',
        method: 'GET',
        module: 'openings',
        description: 'Obtener URL de descarga firmada para documento',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/documents/:documentId'
      },
      {
        path: '/admin/openings/projects/:id/documents/:documentId',
        method: 'DELETE',
        module: 'openings',
        description: 'Eliminar documento del proyecto',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/documents/:documentId'
      },
      
      // Supplier Invitations (NEW - 4 endpoints)
      {
        path: '/admin/openings/projects/:id/invitations',
        method: 'POST',
        module: 'openings',
        description: 'Invitar proveedores a proyecto (multiple)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/invitations'
      },
      {
        path: '/admin/openings/projects/:id/invitations',
        method: 'GET',
        module: 'openings',
        description: 'Listar invitaciones de un proyecto',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/invitations'
      },
      {
        path: '/api/openings/my-invitations',
        method: 'GET',
        module: 'openings',
        description: 'Obtener invitaciones del proveedor actual (con project_id)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/api/openings/my-invitations'
      },
      {
        path: '/admin/openings/invitations/:id',
        method: 'DELETE',
        module: 'openings',
        description: 'Eliminar invitación',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/invitations/:id'
      },
      
      // Quote Operations (NEW - 4 endpoints)
      {
        path: '/admin/openings/quotes/:id/award',
        method: 'PATCH',
        module: 'openings',
        description: 'Adjudicar presupuesto a proveedor',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/quotes/:id/award'
      },
      {
        path: '/admin/openings/quotes/:id/revert',
        method: 'PATCH',
        module: 'openings',
        description: 'Revertir adjudicación de presupuesto',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/quotes/:id/revert'
      },
      {
        path: '/api/openings/quotes/:id/sign',
        method: 'POST',
        module: 'openings',
        description: 'Firmar presupuesto digitalmente',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/api/openings/quotes/:id/sign'
      },
      {
        path: '/api/openings/categories/:id/quotes/comparison',
        method: 'GET',
        module: 'openings',
        description: 'Obtener comparación de presupuestos por categoría',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/api/openings/categories/:id/quotes/comparison'
      },
      
      // Project Status & Financing (NEW - 4 endpoints)
      {
        path: '/admin/openings/projects/:id/status',
        method: 'PATCH',
        module: 'openings',
        description: 'Actualizar estado del proyecto',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/status'
      },
      {
        path: '/admin/openings/projects/:id/status-history',
        method: 'GET',
        module: 'openings',
        description: 'Obtener historial de cambios de estado',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/status-history'
      },
      {
        path: '/admin/openings/projects/:id/financing',
        method: 'POST',
        module: 'openings',
        description: 'Solicitar revisión de financiamiento',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/financing'
      },
      {
        path: '/admin/openings/projects/:id/financing/:approvalId',
        method: 'PATCH',
        module: 'openings',
        description: 'Revisar solicitud de financiamiento (approve/reject)',
        usesRealAPI: !featureFlags.shouldUseMock('openings'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/openings/projects/:id/financing/:approvalId'
      },
      
      // ========================================================================
      // PRICING MODULE (Custom) - ✅ REAL API (Render DEV)
      // ========================================================================
      {
        path: '/admin/custom/products/pending',
        method: 'GET',
        module: 'pricing',
        description: 'Productos pendientes de tarificación',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/pending'
      },
      {
        path: '/admin/custom/products/:id/pricing-approval',
        method: 'PATCH',
        module: 'pricing',
        description: 'Aprobar/rechazar tarificación',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/:id/pricing-approval'
      },
      {
        path: '/admin/custom/products',
        method: 'GET',
        module: 'pricing',
        description: 'Listar productos tarificados para revisar markup',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products'
      },
      {
        path: '/admin/custom/products/:id/markup',
        method: 'PATCH',
        module: 'pricing',
        description: 'Actualizar markup específico de producto aprobado',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/:id/markup'
      },
      {
        path: '/admin/custom/sellers',
        method: 'GET',
        module: 'pricing',
        description: 'Listar sellers con markup info',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers'
      },
      {
        path: '/admin/custom/sellers/:id/markup',
        method: 'GET',
        module: 'pricing',
        description: 'Obtener markup global de seller',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers/:id/markup'
      },
      {
        path: '/admin/custom/sellers/:id/markup',
        method: 'PATCH',
        module: 'pricing',
        description: 'Actualizar markup global de seller',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers/:id/markup'
      },
      {
        path: '/admin/custom/sellers/:id/markup/history',
        method: 'GET',
        module: 'pricing',
        description: 'Historial de cambios de markup',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers/:id/markup/history'
      },
      
      // ========================================================================
      // PRODUCTS MODULE (Admin - Catalog Management)
      // ========================================================================
      {
        path: '/admin/custom/catalog-products',
        method: 'GET',
        module: 'products',
        description: 'Listar productos (admin) con filtros',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products'
      },
      {
        path: '/admin/custom/catalog-products/:id',
        method: 'GET',
        module: 'products',
        description: 'Detalle de producto (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products/:id'
      },
      {
        path: '/admin/custom/catalog-products',
        method: 'POST',
        module: 'products',
        description: 'Crear producto',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products'
      },
      {
        path: '/admin/custom/catalog-products/:id',
        method: 'PATCH',
        module: 'products',
        description: 'Actualizar producto',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products/:id'
      },
      {
        path: '/admin/custom/catalog-products/:id',
        method: 'DELETE',
        module: 'products',
        description: 'Eliminar producto',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products/:id'
      },
      {
        path: '/admin/custom/catalog-products/stats',
        method: 'GET',
        module: 'products',
        description: 'Estadísticas de productos',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products/stats'
      },
      {
        path: '/admin/custom/catalog-products/bulk-update-status',
        method: 'POST',
        module: 'products',
        description: 'Actualización masiva de estado',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/catalog-products/bulk-update-status'
      },
      {
        path: '/admin/variants/:id/inventory',
        method: 'POST',
        module: 'products',
        description: 'Ajustar inventario de opción',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/variants/:id/inventory'
      },
      
      // ========================================================================
      // CATALOG MODULE (Franchisee Marketplace)
      // ========================================================================
      {
        path: '/store/products',
        method: 'GET',
        module: 'catalog',
        description: 'Listar productos del catálogo (franchisee) - 200 en DEV pero sin productos',
        usesRealAPI: !featureFlags.shouldUseMock('catalog'),
        status: 'broken',
        requiresAuth: false,
        medusaEndpoint: '/store/products'
      },
      {
        path: '/store/products/:id',
        method: 'GET',
        module: 'catalog',
        description: 'Detalle de producto (franchisee)',
        usesRealAPI: !featureFlags.shouldUseMock('catalog'),
        status: 'working',
        requiresAuth: false,
        medusaEndpoint: '/store/products/:id'
      },
      
      // ========================================================================
      // STORE MODULE (Public/Franchisee)
      // ========================================================================
      {
        path: '/store/regions',
        method: 'GET',
        module: 'store',
        description: 'Listar regiones disponibles',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/regions'
      },
      {
        path: '/store/carts',
        method: 'POST',
        module: 'cart',
        description: 'Crear carrito de compra',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts'
      },
      {
        path: '/store/carts/:id',
        method: 'GET',
        module: 'cart',
        description: 'Obtener carrito',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id'
      },
      {
        path: '/store/carts/:id/line-items',
        method: 'POST',
        module: 'cart',
        description: 'Añadir producto al carrito',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/line-items'
      },
      {
        path: '/store/carts/:id/line-items/:itemId',
        method: 'POST',
        module: 'cart',
        description: 'Actualizar cantidad en carrito',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/line-items/:itemId'
      },
      {
        path: '/store/carts/:id/line-items/:itemId',
        method: 'DELETE',
        module: 'cart',
        description: 'Eliminar producto del carrito',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/line-items/:itemId'
      },
      {
        path: '/store/shipping-options',
        method: 'GET',
        module: 'cart',
        description: 'Opciones de envío',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/shipping-options'
      },
      
      // ========================================================================
      // CHECKOUT MODULE (Store - Checkout Flow)
      // ========================================================================
      {
        path: '/store/carts/:id',
        method: 'POST',
        module: 'checkout',
        description: 'Actualizar carrito con dirección de envío/facturación (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id'
      },
      {
        path: '/store/carts/:id/shipping-methods',
        method: 'POST',
        module: 'checkout',
        description: 'Añadir método de envío al carrito (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/shipping-methods'
      },
      {
        path: '/store/carts/:id/payment-collections',
        method: 'POST',
        module: 'checkout',
        description: 'Crear colección de pago (Stripe) (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/payment-collections'
      },
      {
        path: '/store/checkout/payment-intent',
        method: 'POST',
        module: 'checkout',
        description: 'Crear PaymentIntent custom para checkout; hoy devuelve client_secret simulado y sigue pendiente la integración Stripe real',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/store/checkout/payment-intent'
      },
      {
        path: '/store/checkout/complete',
        method: 'POST',
        module: 'checkout',
        description: 'Completar checkout custom; crea pedido en pending_payment y la confirmación final depende del webhook Stripe',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/store/checkout/complete'
      },
      {
        path: '/store/carts/:id/complete',
        method: 'POST',
        module: 'checkout',
        description: 'Completar carrito y crear pedido (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/complete'
      },
      {
        path: '/store/orders/:id',
        method: 'GET',
        module: 'checkout',
        description: 'Obtener detalles del pedido creado (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/orders/:id'
      },
      {
        path: '/store/customers/me',
        method: 'GET',
        module: 'franchisees',
        description: 'Obtener perfil de cliente actual',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/store/customers/me'
      },
      
      // ========================================================================
      // VENDOR MODULE (MercurJS + Custom)
      // ========================================================================
      {
        path: '/vendor/sellers/me',
        method: 'GET',
        module: 'suppliers',
        description: 'Obtener seller actual (vendor)',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/sellers/me'
      },
      {
        path: '/seller/catalog-products',
        method: 'GET',
        module: 'pricing',
        description: 'Mis productos propuestos',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/catalog-products'
      },
      {
        path: '/seller/catalog-products',
        method: 'POST',
        module: 'pricing',
        description: 'Proponer nuevo producto',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/seller/catalog-products'
      },
      {
        path: '/seller/catalog-products/bulk',
        method: 'POST',
        module: 'pricing',
        description: 'Carga masiva de productos (CSV)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/seller/catalog-products/bulk'
      },
      {
        path: '/vendor/custom/sellers/me/markup',
        method: 'GET',
        module: 'pricing',
        description: 'Obtener mi markup global',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/sellers/me/markup'
      },
      
      // ========================================================================
      // EXCEL IMPORT MODULE - ✅ REAL API (Render DEV)
      // Bulk product import via Excel spreadsheet
      // ========================================================================
      {
        path: '/admin/custom/products/import/template',
        method: 'GET',
        module: 'pricing',
        description: 'Descargar plantilla Excel (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/import/template'
      },
      {
        path: '/admin/custom/products/import',
        method: 'POST',
        module: 'pricing',
        description: 'Subir Excel para carga masiva (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/import'
      },
      {
        path: '/admin/custom/products/import',
        method: 'GET',
        module: 'pricing',
        description: 'Listar jobs de importación (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/import'
      },
      {
        path: '/admin/custom/products/import/:id',
        method: 'GET',
        module: 'pricing',
        description: 'Detalle de job de importación (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/import/:id'
      },
      {
        path: '/vendor/custom/products/import/template',
        method: 'GET',
        module: 'pricing',
        description: 'Descargar plantilla Excel (vendor)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/products/import/template'
      },
      {
        path: '/vendor/custom/products/import',
        method: 'POST',
        module: 'pricing',
        description: 'Subir Excel para carga masiva (vendor)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/products/import'
      },
      {
        path: '/vendor/custom/products/import',
        method: 'GET',
        module: 'pricing',
        description: 'Listar mis jobs de importación (vendor)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/products/import'
      },
      {
        path: '/vendor/custom/products/import/:id',
        method: 'GET',
        module: 'pricing',
        description: 'Detalle de job de importación (vendor)',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/products/import/:id'
      },
      
      // ========================================================================
      // SUPPLIER ORDERS MODULE - ✅ REAL API (Render DEV)
      // Requires: Authorization + x-seller-id headers
      // ========================================================================
      {
        path: '/vendor/orders',
        method: 'GET',
        module: 'orders',
        description: 'Listar pedidos del proveedor',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders'
      },
      {
        path: '/vendor/orders/:id',
        method: 'GET',
        module: 'orders',
        description: 'Detalle de pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id'
      },
      {
        path: '/vendor/orders/stats',
        method: 'GET',
        module: 'orders',
        description: 'Estadísticas de pedidos',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/stats'
      },
      {
        path: '/vendor/orders/:id/accept',
        method: 'POST',
        module: 'orders',
        description: 'Aceptar pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id/accept'
      },
      {
        path: '/vendor/orders/:id/reject',
        method: 'POST',
        module: 'orders',
        description: 'Rechazar pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id/reject'
      },
      {
        path: '/vendor/orders/:id/status',
        method: 'PATCH',
        module: 'orders',
        description: 'Actualizar estado del pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id/status'
      },
      {
        path: '/vendor/orders/:id/tracking',
        method: 'POST',
        module: 'orders',
        description: 'Añadir información de seguimiento',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id/tracking'
      },
      {
        path: '/vendor/orders/:id/incidents',
        method: 'GET',
        module: 'orders',
        description: 'Listar incidencias del pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id/incidents'
      },
      {
        path: '/vendor/orders/:id/incidents',
        method: 'POST',
        module: 'orders',
        description: 'Reportar incidencia',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/orders/:id/incidents'
      },
      
      // ========================================================================
      // FRANCHISEE ORDERS MODULE (My Orders) - ✅ REAL API (Render DEV)
      // Backend Report 2026-08-26: Using /franchisee/orders endpoints
      // ========================================================================
      {
        path: '/franchisee/orders',
        method: 'GET',
        module: 'orders',
        description: 'Listar mis pedidos (franquiciado)',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/orders'
      },
      {
        path: '/franchisee/orders/:id',
        method: 'GET',
        module: 'orders',
        description: 'Detalle de mi pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/orders/:id'
      },
      {
        path: '/franchisee/orders/stats',
        method: 'GET',
        module: 'orders',
        description: 'Estadísticas de mis pedidos',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/orders/stats'
      },
      {
        path: '/franchisee/orders/:id/cancel',
        method: 'POST',
        module: 'orders',
        description: 'Cancelar mi pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/franchisee/orders/:id/cancel'
      },

      // ========================================================================
      // ADMIN ORDERS MODULE (Global Order Management) - ✅ REAL API (Render DEV)
      // ========================================================================
      {
        path: '/admin/orders',
        method: 'GET',
        module: 'orders',
        description: 'Listar todos los pedidos (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders'
      },
      {
        path: '/admin/orders/:id',
        method: 'GET',
        module: 'orders',
        description: 'Detalle de pedido (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/:id'
      },
      {
        path: '/admin/custom/orders/stats',
        method: 'GET',
        module: 'orders',
        description: 'Estadísticas globales de pedidos (USAR ESTA)',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/orders/stats'
      },
      {
        path: '/admin/orders/stats',
        method: 'GET',
        module: 'orders',
        description: 'Estadísticas (legacy - puede dar 403)',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'broken',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/stats'
      },
      {
        path: '/admin/orders/:id/status',
        method: 'PATCH',
        module: 'orders',
        description: 'Actualizar estado de pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/:id/status'
      },
      {
        path: '/admin/orders/:id/priority',
        method: 'PATCH',
        module: 'orders',
        description: 'Actualizar prioridad de pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/:id/priority'
      },
      {
        path: '/admin/orders/:id/refund',
        method: 'POST',
        module: 'orders',
        description: 'Procesar reembolso',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/:id/refund'
      },
      {
        path: '/admin/orders/:id/incidents',
        method: 'GET',
        module: 'orders',
        description: 'Obtener incidencias del pedido',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/:id/incidents'
      },
      {
        path: '/admin/orders/:id/notes',
        method: 'POST',
        module: 'orders',
        description: 'Añadir nota de administrador',
        usesRealAPI: !featureFlags.shouldUseMock('orders'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders/:id/notes'
      },

      // ========================================================================
      // QUOTES MODULE - FRANCHISEE (Opening Projects) - ✅ REAL API (Render DEV)
      // MVP-aligned store quote endpoints with publishable key + bearer auth
      // ========================================================================
      {
        path: '/store/quotes',
        method: 'GET',
        module: 'quotes',
        description: 'Listar presupuestos del franquiciado',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/store/quotes'
      },
      {
        path: '/store/quotes/:id',
        method: 'GET',
        module: 'quotes',
        description: 'Detalle de presupuesto',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/store/quotes/:id'
      },
      {
        path: '/store/quotes/:id/award',
        method: 'POST',
        module: 'quotes',
        description: 'Adjudicar presupuesto a proveedor',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/store/quotes/:id/award'
      },
      {
        path: '/store/quotes/:id/reject',
        method: 'POST',
        module: 'quotes',
        description: 'Rechazar presupuesto',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/store/quotes/:id/reject'
      },
      {
        path: '/store/quotes/:id/sign',
        method: 'POST',
        module: 'quotes',
        description: 'Firmar presupuesto adjudicado',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/store/quotes/:id/sign'
      },
      
      // Admin Quotes
      {
        path: '/admin/quotes',
        method: 'GET',
        module: 'quotes',
        description: 'Listar todos los presupuestos (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/quotes'
      },
      {
        path: '/admin/quotes/stats',
        method: 'GET',
        module: 'quotes',
        description: 'Estadísticas de presupuestos (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/quotes/stats'
      },

      // ========================================================================
      // QUOTES MODULE - SUPPLIER (Vendor Panel) - ✅ REAL API (Render DEV)
      // ========================================================================
      {
        path: '/seller/invitations',
        method: 'GET',
        module: 'quotes',
        description: 'Listar invitaciones recibidas',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/invitations'
      },
      {
        path: '/seller/quotes',
        method: 'GET',
        module: 'quotes',
        description: 'Listar presupuestos del proveedor',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/quotes'
      },
      {
        path: '/seller/quotes',
        method: 'POST',
        module: 'quotes',
        description: 'Crear presupuesto (borrador)',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/quotes'
      },
      {
        path: '/seller/quotes/:id',
        method: 'PATCH',
        module: 'quotes',
        description: 'Actualizar presupuesto borrador',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/quotes/:id'
      },
      {
        path: '/seller/quotes/:id/respond',
        method: 'POST',
        module: 'quotes',
        description: 'Responder invitación con presupuesto (draft → submitted)',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/quotes/:id/respond'
      },
      {
        path: '/seller/invitations/:id/decline',
        method: 'POST',
        module: 'quotes',
        description: 'Declinar invitación',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/seller/invitations/:id/decline'
      },
      {
        path: '/admin/quotes',
        method: 'GET',
        module: 'quotes',
        description: 'Listar todos los presupuestos (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('quotes'),
        status: 'working',
        requiresAuth: true,
        medusaEndpoint: '/admin/quotes'
      },

      // ========================================================================
      // FRANCHISEE MANAGEMENT MODULE (Admin Franchisee CRUD)
      // ========================================================================
      {
        path: '/admin/franchisees',
        method: 'GET',
        module: 'franchisee-management',
        description: 'Listar franquiciados (ruta legacy/no validada en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees'
      },
      {
        path: '/admin/franchisees/:id',
        method: 'GET',
        module: 'franchisee-management',
        description: 'Detalle de franquiciado (ruta legacy/no validada en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees/:id'
      },
      {
        path: '/admin/franchisees',
        method: 'POST',
        module: 'franchisee-management',
        description: 'Crear franquiciado (ruta legacy/no validada en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees'
      },
      {
        path: '/admin/franchisees/:id',
        method: 'PATCH',
        module: 'franchisee-management',
        description: 'Actualizar franquiciado (ruta legacy/no validada en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees/:id'
      },
      {
        path: '/admin/franchisees/:id/status',
        method: 'PATCH',
        module: 'franchisee-management',
        description: 'Cambiar estado del franquiciado; al activar debe exigir subscription_status=active y disparar email/outbox (ruta legacy/no validada en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees/:id/status'
      },
      {
        path: '/admin/franchisees/:id/stats',
        method: 'GET',
        module: 'franchisee-management',
        description: 'Estadísticas del franquiciado (ruta legacy/no validada en la ronda 2026-08-31)',
        usesRealAPI: !featureFlags.shouldUseMock('franchisees'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/franchisees/:id/stats'
      },

      // ========================================================================
      // CHECKOUT MODULE - ADDITIONAL ENDPOINTS
      // ========================================================================
      {
        path: '/store/carts/:id/shipping-address',
        method: 'POST',
        module: 'checkout',
        description: 'Actualizar dirección de envío (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/shipping-address'
      },
      {
        path: '/store/carts/:id/billing-address',
        method: 'POST',
        module: 'checkout',
        description: 'Actualizar dirección de facturación (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/billing-address'
      },
      {
        path: '/store/carts/:id/payment-sessions',
        method: 'POST',
        module: 'checkout',
        description: 'Iniciar sesión de pago (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/payment-sessions'
      },
      {
        path: '/store/carts/:id/payment-session',
        method: 'POST',
        module: 'checkout',
        description: 'Seleccionar método de pago (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/payment-session'
      },
      {
        path: '/store/shipping-options/:cartId',
        method: 'GET',
        module: 'checkout',
        description: 'Obtener opciones de envío disponibles (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/shipping-options/:cartId'
      },
      {
        path: '/store/payment-collections/:id',
        method: 'GET',
        module: 'checkout',
        description: 'Obtener estado de pago (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/payment-collections/:id'
      },
      {
        path: '/store/carts/:id/line-items',
        method: 'POST',
        module: 'checkout',
        description: 'Añadir item al carrito (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/line-items'
      },
      {
        path: '/store/carts/:id/line-items/:lineId',
        method: 'PATCH',
        module: 'checkout',
        description: 'Actualizar cantidad de item (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/line-items/:lineId'
      },
      {
        path: '/store/carts/:id/line-items/:lineId',
        method: 'DELETE',
        module: 'checkout',
        description: 'Eliminar item del carrito (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/line-items/:lineId'
      },
      {
        path: '/store/carts/:id/discounts/:code',
        method: 'POST',
        module: 'checkout',
        description: 'Aplicar código de descuento (no validado end-to-end en DEV)',
        usesRealAPI: !featureFlags.shouldUseMock('checkout'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts/:id/discounts/:code'
      },
    ];

    setEndpoints(allEndpoints);
  }, []);

  const modules = [
    'all',
    'auth',
    'admin',
    'franchisees',
    'franchisee-management',
    'openings',
    'pricing',
    'products',
    'catalog',
    'checkout',
    'suppliers',
    'cart',
    'store',
    'orders',
    'quotes'
  ];
  
  const filteredEndpoints = selectedModule === 'all' 
    ? endpoints 
    : endpoints.filter(e => e.module === selectedModule);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'broken':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'untested':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      working: 'default',
      broken: 'destructive',
      untested: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const stats = {
    total: endpoints.length,
    realAPI: endpoints.filter(e => e.usesRealAPI).length,
    mock: endpoints.filter(e => !e.usesRealAPI).length,
    working: endpoints.filter(e => e.status === 'working').length,
    broken: endpoints.filter(e => e.status === 'broken').length,
    untested: endpoints.filter(e => e.status === 'untested').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dev Tools</h1>
          <p className="text-muted-foreground">
            Documentación de endpoints de Medusa API y estado de feature flags
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {process.env.NEXT_PUBLIC_API_URL || 'localhost'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Endpoints</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Medusa + MercurJS</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Configurados en Real API</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.realAPI}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Cloud className="h-4 w-4" />
              <span>Apuntan al backend por feature flag</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Mock Data</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.mock}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Code className="h-4 w-4" />
              <span>Datos simulados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-xl flex gap-2">
              <span className="text-green-600">{stats.working}</span>
              <span className="text-red-600">{stats.broken}</span>
              <span className="text-yellow-600">{stats.untested}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>working / broken / untested</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cómo leer esta página</CardTitle>
          <CardDescription>
            `Real API` no significa que el endpoint esté validado o sano.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>
            `Real API` solo indica que el frontend está configurado para llamar al backend real mediante feature flags.
          </p>
          <p>
            El estado real del endpoint se refleja en `working`, `broken` o `untested`.
          </p>
          <p>
            En el modo híbrido actual de DEV, varios módulos siguen en real pero algunos endpoints están vacíos o rotos en backend.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="credentials">Credenciales</TabsTrigger>
          <TabsTrigger value="session">Sesión Actual</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {/* Module Filter */}
          <div className="flex gap-2">
            {modules.map((module) => (
              <Button
                key={module}
                variant={selectedModule === module ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedModule(module)}
              >
                {module}
              </Button>
            ))}
          </div>

          {/* Endpoints Table */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoints de Medusa API</CardTitle>
              <CardDescription>
                {filteredEndpoints.length} endpoints en el módulo &quot;{selectedModule}&quot;. Revisa `status` para saber si funcionan realmente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEndpoints.map((endpoint, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        {endpoint.requiresAuth && (
                          <Badge variant="secondary" className="text-xs">
                            Auth Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      {endpoint.medusaEndpoint && (
                        <p className="text-xs text-muted-foreground font-mono">
                          Medusa: {endpoint.medusaEndpoint}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {endpoint.usesRealAPI ? (
                        <Badge className="bg-green-500">
                          <Cloud className="h-3 w-3 mr-1" />
                          Real API Config
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500">
                          <Code className="h-3 w-3 mr-1" />
                          Mock
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(endpoint.status)}
                        {getStatusBadge(endpoint.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags Configuration</CardTitle>
              <CardDescription>
                Estado actual de los módulos de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(featureFlags.modules).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold capitalize">{key}</h3>
                      <p className="text-sm text-muted-foreground">{config.notes}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          Backend: {config.backendReady ? '✅ Ready' : '⏳ Pending'}
                        </Badge>
                        <Badge variant="outline">
                          MOCK: {featureFlags.shouldUseMock(key as any) ? '✅ Enabled' : '❌ Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      {featureFlags.shouldUseMock(key as any) ? (
                        <Badge className="bg-blue-500">Mock Data</Badge>
                      ) : (
                        <Badge className="bg-green-500">Real API</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Variables de entorno NEXT_PUBLIC_*
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">API_URL:</span>
                  <span>{process.env.NEXT_PUBLIC_API_URL || 'Not set'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_AUTH:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_AUTH || 'false'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_PRICING:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_PRICING || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_PRODUCTS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_PRODUCTS || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_OPENINGS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_OPENINGS || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_SUPPLIERS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_SUPPLIERS || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_CATEGORIES:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_CATEGORIES || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_QUOTES:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_QUOTES || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_ORDERS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_ORDERS || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_FRANCHISEES:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_FRANCHISEES || 'true'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_FRANCHISEE_INVITATIONS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_FRANCHISEE_INVITATIONS || 'false'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_FRANCHISEE_REGISTRATION:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_FRANCHISEE_REGISTRATION || 'false'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">FRANCHISEE_BILLING_ENABLED:</span>
                  <span>{process.env.NEXT_PUBLIC_FRANCHISEE_BILLING_ENABLED || 'false'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credenciales de Prueba (DEV)</CardTitle>
              <CardDescription>
                Usuarios de prueba para testing en desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Admin</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div>Email: <span className="text-blue-600">admin@carrefour.dev</span></div>
                    <div>Password: <span className="text-blue-600">supersecret</span></div>
                    <div>Role: <Badge>admin</Badge></div>
                    <div>Dashboard: <code>/admin/dashboard</code></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Franchisee</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div>Email: <span className="text-green-600">franchisee@carrefour.dev</span></div>
                    <div>Password: <span className="text-green-600">supersecret</span></div>
                    <div>Role: <Badge variant="secondary">franchisee</Badge></div>
                    <div>Dashboard: <code>/marketplace/dashboard</code></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Supplier (Seller)</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div>Email: <span className="text-purple-600">seller@mercur.dev</span></div>
                    <div>Password: <span className="text-purple-600">supersecret</span></div>
                    <div>Role: <Badge variant="outline">supplier</Badge></div>
                    <div>Seller ID: <code>sel_01M0A89ET1F5NBDER95X09ZPES</code></div>
                    <div>Dashboard: <code>/supplier/dashboard</code></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sesión Actual</CardTitle>
              <CardDescription>
                Información de autenticación del usuario actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user ? (
                  <>
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">Autenticado</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-mono">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="font-mono">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Role:</span>
                          <Badge>{user.role}</Badge>
                        </div>
                        {user.name && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span>{user.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">JWT Token</h3>
                      <div className="bg-muted p-3 rounded font-mono text-xs break-all">
                        {token ? (
                          <>{token.substring(0, 50)}...{token.substring(token.length - 20)}</>
                        ) : (
                          <span className="text-muted-foreground">No token</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">LocalStorage</h3>
                      <div className="bg-muted p-3 rounded font-mono text-xs">
                        <pre className="overflow-auto">
                          {JSON.stringify(
                            JSON.parse(localStorage.getItem('auth-storage') || '{}'),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold">No autenticado</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Por favor, inicia sesión para ver la información de la sesión.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

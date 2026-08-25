#!/usr/bin/env node

/**
 * Script para crear pedidos de prueba en Medusa
 * 
 * Uso:
 *   node scripts/seed-orders.mjs
 * 
 * Variables de entorno requeridas:
 *   MEDUSA_BACKEND_URL (default: http://localhost:9000)
 *   MEDUSA_ADMIN_EMAIL (default: admin@carrefour.dev)
 *   MEDUSA_ADMIN_PASSWORD (default: supersecret)
 */

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || 'admin@carrefour.dev'
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || 'supersecret'
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY || process.env.MEDUSA_PUBLISHABLE_KEY
const REGION_ID = process.env.NEXT_PUBLIC_MERCUR_REGION_ID || 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE'

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}▸${colors.reset} ${msg}`),
}

// Helper para hacer requests autenticados
let authToken = null

async function request(path, init = {}) {
  const url = `${BACKEND_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...init.headers,
  }

  // Use JWT token for admin endpoints
  if (authToken && path.startsWith('/admin')) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  // Use publishable API key for store endpoints
  if (path.startsWith('/store') && PUBLISHABLE_API_KEY) {
    headers['x-publishable-api-key'] = PUBLISHABLE_API_KEY
  }

  const response = await fetch(url, {
    ...init,
    headers,
  })

  let body
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    body = await response.json()
  } else {
    body = await response.text()
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`)
  }

  return body
}

// 1. Autenticación admin
async function authenticateAdmin() {
  log.step('Autenticando como admin...')
  
  try {
    const response = await request('/auth/user/emailpass', {
      method: 'POST',
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    authToken = response.token || response.access_token || response.jwt
    
    if (!authToken) {
      throw new Error('No se recibió token de autenticación')
    }

    log.success(`Autenticado como ${ADMIN_EMAIL}`)
    return authToken
  } catch (error) {
    log.error(`Error en autenticación: ${error.message}`)
    throw error
  }
}

// 2. Obtener productos existentes (con offer_id desde store API)
async function getProducts(regionId) {
  log.step('Obteniendo productos existentes...')
  
  try {
    const response = await request(`/store/products?limit=100&region_id=${regionId}`)
    const products = response.products || []
    
    log.success(`Encontrados ${products.length} productos`)
    
    if (products.length === 0) {
      log.warning('No hay productos en la base de datos. Ejecuta primero el seed de productos.')
      return []
    }

    // Mostrar primeros productos
    products.slice(0, 5).forEach(p => {
      log.info(`  - ${p.title} (${p.id})`)
    })
    
    if (products.length > 5) {
      log.info(`  ... y ${products.length - 5} más`)
    }

    return products
  } catch (error) {
    log.error(`Error obteniendo productos: ${error.message}`)
    throw error
  }
}

// 3. Obtener o crear región España
async function ensureRegion() {
  log.step('Usando región configurada...')
  
  try {
    log.success(`Región ID: ${REGION_ID}`)
    return { id: REGION_ID, name: 'España', currency_code: 'eur' }
  } catch (error) {
    log.error(`Error con región: ${error.message}`)
    throw error
  }
}

// 4. Crear pedido de ejemplo
async function createOrder(orderData, products, region) {
  log.step(`Creando pedido ${orderData.orderNumber}...`)

  try {
    // Paso 1: Crear un carrito
    log.info('  1. Creando carrito...')
    const cartResponse = await request('/store/carts', {
      method: 'POST',
      body: JSON.stringify({
        region_id: region.id,
        email: orderData.email,
        shipping_address: {
          first_name: orderData.shipping.firstName,
          last_name: orderData.shipping.lastName,
          address_1: orderData.shipping.address,
          city: orderData.shipping.city,
          postal_code: orderData.shipping.postalCode,
          country_code: 'es',
          phone: orderData.shipping.phone,
        },
      }),
    })

    const cartId = cartResponse.cart.id
    log.success(`  Carrito creado: ${cartId}`)

    // Paso 2: Agregar items al carrito
    log.info('  2. Agregando productos al carrito...')
    for (const item of orderData.items) {
      // Buscar el producto por SKU o título
      const product = products.find(p => 
        p.title?.includes(item.productName) ||
        p.handle?.includes(item.productName.toLowerCase().replace(/\s+/g, '-')) ||
        p.variants?.some(v => v.sku === item.productName.match(/[A-Z]{3}-\d{3}/)?.[0])
      )

      if (!product) {
        log.warning(`  ⚠ Producto no encontrado: ${item.productName}`)
        continue
      }

      const variant = product.variants?.[0]
      if (!variant) {
        log.warning(`  ⚠ No hay variantes para: ${item.productName}`)
        continue
      }

      const offerId = variant.offer_id
      if (!offerId) {
        log.warning(`  ⚠ No hay offer_id para: ${item.productName}`)
        continue
      }

      await request(`/store/carts/${cartId}/line-items`, {
        method: 'POST',
        body: JSON.stringify({
          offer_id: offerId,
          quantity: item.quantity,
        }),
      })

      log.success(`  ✓ Agregado: ${item.quantity}x ${item.productName}`)
    }

    // Paso 2.5: Iniciar payment collection
    log.info('  2.5. Iniciando payment collection...')
    try {
      await request(`/store/payment-collections`, {
        method: 'POST',
        body: JSON.stringify({
          cart_id: cartId,
        }),
      })
      log.success(`  ✓ Payment collection iniciada`)
    } catch (error) {
      log.warning(`  ⚠ Error iniciando payment collection: ${error.message}`)
      // Continue anyway, maybe it's not required in all setups
    }

    // Paso 3: Completar el carrito (crear la orden)
    log.info('  3. Completando carrito (creando orden)...')
    const orderResponse = await request(`/store/carts/${cartId}/complete`, {
      method: 'POST',
    })

    const order = orderResponse.order
    log.success(`✓ Orden creada: ${order.id} (${order.status})`)
    
    return order
  } catch (error) {
    log.error(`Error creando pedido: ${error.message}`)
    return null
  }
}

// Datos de pedidos de ejemplo
const sampleOrders = [
  {
    orderNumber: 'CF-10001',
    email: 'franchisee@test.com',
    shipping: {
      firstName: 'Juan',
      lastName: 'Pérez',
      address: 'Calle Mayor 123, 2º A',
      city: 'Madrid',
      postalCode: '28001',
      phone: '+34 666 123 456',
    },
    items: [
      {
        productName: 'Chaqueta de Trabajo Unisex',
        quantity: 20,
      },
      {
        productName: 'Cartel de Precios PVC',
        quantity: 3,
      },
    ],
  },
  {
    orderNumber: 'CF-10002',
    email: 'franchisee@test.com',
    shipping: {
      firstName: 'Juan',
      lastName: 'Pérez',
      address: 'Calle Mayor 123, 2º A',
      city: 'Madrid',
      postalCode: '28001',
      phone: '+34 666 123 456',
    },
    items: [
      {
        productName: 'Bolsa Reutilizable Carrefour',
        quantity: 5,
      },
    ],
  },
  {
    orderNumber: 'CF-10003',
    email: 'admin@carrefour.dev',
    shipping: {
      firstName: 'Admin',
      lastName: 'Carrefour',
      address: 'Avenida Diagonal 123',
      city: 'Barcelona',
      postalCode: '08001',
      phone: '+34 666 999 888',
    },
    items: [
      {
        productName: 'Balanza Digital de Mostrador',
        quantity: 2,
      },
      {
        productName: 'Totem Expositivo de Pie',
        quantity: 1,
      },
    ],
  },
  {
    orderNumber: 'CF-10004',
    email: 'franchisee@test.com',
    shipping: {
      firstName: 'María',
      lastName: 'González',
      address: 'Calle del Sol 45',
      city: 'Valencia',
      postalCode: '46001',
      phone: '+34 666 777 555',
    },
    items: [
      {
        productName: 'Chaqueta de Trabajo Unisex',
        quantity: 10,
      },
      {
        productName: 'Delantal de Trabajo',
        quantity: 15,
      },
      {
        productName: 'Boligrafo Corporativo',
        quantity: 2,
      },
    ],
  },
  {
    orderNumber: 'CF-10005',
    email: 'admin@carrefour.dev',
    shipping: {
      firstName: 'Carlos',
      lastName: 'Martínez',
      address: 'Plaza Mayor 10',
      city: 'Sevilla',
      postalCode: '41001',
      phone: '+34 666 444 333',
    },
    items: [
      {
        productName: 'Folleto Promocional A5',
        quantity: 3,
      },
      {
        productName: 'Catalogo de Productos A4',
        quantity: 2,
      },
    ],
  },
]

// Main
async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('  SEED DE PEDIDOS - MARKETPLACE B2B CARREFOUR')
  console.log('='.repeat(60) + '\n')

  log.info(`Backend URL: ${BACKEND_URL}`)
  log.info(`Admin Email: ${ADMIN_EMAIL}`)
  
  if (!PUBLISHABLE_API_KEY) {
    log.warning('NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY no configurada - las operaciones de carrito pueden fallar')
  }

  try {
    // 1. Autenticar
    await authenticateAdmin()

    // 2. Verificar región
    const region = await ensureRegion()

    // 3. Obtener productos (con offer_id para la región)
    const products = await getProducts(region.id)
    if (products.length === 0) {
      log.error('No se pueden crear pedidos sin productos.')
      process.exit(1)
    }

    // 4. Crear pedidos
    log.step('Creando pedidos de ejemplo...')
    console.log('')

    let created = 0
    let failed = 0

    for (const orderData of sampleOrders) {
      const order = await createOrder(orderData, products, region)
      if (order) {
        created++
      } else {
        failed++
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(60))
    console.log('  RESUMEN')
    console.log('='.repeat(60))
    log.success(`Pedidos creados: ${created}`)
    if (failed > 0) {
      log.warning(`Pedidos fallidos: ${failed}`)
    }
    log.info(`Total intentados: ${sampleOrders.length}`)
    console.log('')

    if (created > 0) {
      log.success('✓ Datos de ejemplo insertados correctamente')
      log.info('Puedes ver los pedidos en: http://localhost:3000/admin/dashboard')
    }

  } catch (error) {
    log.error(`Error fatal: ${error.message}`)
    process.exit(1)
  }
}

main()

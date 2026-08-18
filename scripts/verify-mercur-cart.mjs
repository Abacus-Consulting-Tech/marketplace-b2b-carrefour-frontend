const storeApi = process.env.NEXT_PUBLIC_MERCUR_STORE_API || 'http://localhost:9000/store'
const publishableApiKey = process.env.NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY
const regionId = process.env.NEXT_PUBLIC_MERCUR_REGION_ID

if (!publishableApiKey) {
  throw new Error('NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY is required')
}

if (!regionId) {
  throw new Error('NEXT_PUBLIC_MERCUR_REGION_ID is required')
}

const request = async (path, init = {}) => {
  const response = await fetch(`${storeApi}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': publishableApiKey,
      ...init.headers,
    },
  })

  const body = await response.json()

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`)
  }

  return body
}

const productResponse = await request(`/products?limit=1&region_id=${regionId}`)
const offerId = productResponse.products?.[0]?.variants?.[0]?.offer_id

if (!offerId) {
  throw new Error('No offer_id found on first Store API product variant')
}

const created = await request('/carts', {
  method: 'POST',
  body: JSON.stringify({ region_id: regionId }),
})

const retrieved = await request(`/carts/${created.cart.id}`)
const updated = await request(`/carts/${created.cart.id}/line-items`, {
  method: 'POST',
  body: JSON.stringify({ offer_id: offerId, quantity: 1 }),
})

const lineItemId = updated.cart.items[0]?.id

if (!lineItemId) {
  throw new Error('No line item id found after adding product to cart')
}

const quantityUpdated = await request(`/carts/${created.cart.id}/line-items/${lineItemId}`, {
  method: 'POST',
  body: JSON.stringify({ quantity: 4 }),
})

const removed = await request(`/carts/${created.cart.id}/line-items/${lineItemId}`, {
  method: 'DELETE',
})

const mapped = {
  cartId: quantityUpdated.cart.id,
  items: quantityUpdated.cart.items.map((item) => ({
    productId: item.product_id ?? item.variant_id ?? item.id,
    name: item.product_title ?? item.title,
    quantity: item.quantity,
    price: item.unit_price,
    image: item.thumbnail ?? undefined,
    backendLineItemId: item.id,
    offerId: item.metadata?.offer_id,
    variantId: item.variant_id ?? undefined,
  })),
  summary: {
    subtotal: quantityUpdated.cart.subtotal,
    tax: quantityUpdated.cart.tax_total,
    shipping: quantityUpdated.cart.shipping_total,
    discount: quantityUpdated.cart.discount_total,
    total: quantityUpdated.cart.total,
    currency: quantityUpdated.cart.currency_code.toUpperCase(),
  },
}

console.log(JSON.stringify({
  cartId: created.cart.id,
  retrieved: retrieved.cart.id === created.cart.id,
  items: quantityUpdated.cart.items.length,
  quantity: quantityUpdated.cart.items[0]?.quantity,
  total: quantityUpdated.cart.total,
  currency: quantityUpdated.cart.currency_code,
  mappedItems: mapped.items.length,
  mappedLineItemId: mapped.items[0]?.backendLineItemId,
  mappedOfferId: mapped.items[0]?.offerId,
  removedItems: removed.parent.items.length,
}))
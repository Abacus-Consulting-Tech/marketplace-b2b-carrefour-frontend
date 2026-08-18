import axios from 'axios'

const mercurStoreClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MERCUR_STORE_API || 'http://localhost:9000/store',
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

mercurStoreClient.interceptors.request.use(config => {
  const publishableApiKey = process.env.NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY

  if (publishableApiKey) {
    config.headers['x-publishable-api-key'] = publishableApiKey
  }

  return config
})

mercurStoreClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export interface MercurCartLineItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total?: number
  subtotal?: number
  thumbnail?: string | null
  variant_id?: string | null
  product_id?: string | null
  product_title?: string | null
  variant_sku?: string | null
  metadata?: {
    offer_id?: string
    [key: string]: unknown
  } | null
}

export interface MercurCartAddress {
  id?: string
  first_name?: string | null
  last_name?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
  phone?: string | null
}

export interface MercurShippingMethod {
  id: string
  amount: number
  shipping_option_id: string
}

export interface MercurCart {
  id: string
  currency_code: string
  region_id: string
  total: number
  subtotal: number
  item_subtotal?: number
  tax_total: number
  discount_total: number
  shipping_total: number
  items: MercurCartLineItem[]
  shipping_methods?: MercurShippingMethod[]
  shipping_address?: MercurCartAddress | null
  created_at: string
  updated_at: string
}

interface MercurCartResponse {
  cart: MercurCart
}

export interface CreateMercurCartInput {
  region_id?: string
}

export interface AddMercurLineItemInput {
  offer_id: string
  quantity: number
}

export interface UpdateMercurLineItemInput {
  quantity: number
}

export interface UpdateMercurCartInput {
  shipping_address?: MercurCartAddress
  email?: string
}

export interface MercurShippingOption {
  id: string
  name: string
  calculated_price?: {
    calculated_amount?: number | null
    currency_code?: string | null
  } | null
}

export interface MercurShippingOptionsResponse {
  shipping_options: Record<string, MercurShippingOption[]>
}

export const createCart = async (input: CreateMercurCartInput = {}) => {
  const response = await mercurStoreClient.post<unknown, MercurCartResponse>('/carts', {
    region_id: input.region_id ?? process.env.NEXT_PUBLIC_MERCUR_REGION_ID,
  })

  return response.cart
}

export const retrieveCart = async (cartId: string) => {
  const response = await mercurStoreClient.get<unknown, MercurCartResponse>(`/carts/${cartId}`)

  return response.cart
}

export const addLineItem = async (cartId: string, input: AddMercurLineItemInput) => {
  const response = await mercurStoreClient.post<unknown, MercurCartResponse>(
    `/carts/${cartId}/line-items`,
    input
  )

  return response.cart
}

export const updateLineItem = async (
  cartId: string,
  lineItemId: string,
  input: UpdateMercurLineItemInput
) => {
  const response = await mercurStoreClient.post<unknown, MercurCartResponse>(
    `/carts/${cartId}/line-items/${lineItemId}`,
    input
  )

  return response.cart
}

export const removeLineItem = async (cartId: string, lineItemId: string) => {
  const response = await mercurStoreClient.delete<unknown, { parent: MercurCart }>(
    `/carts/${cartId}/line-items/${lineItemId}`
  )

  return response.parent
}

export const updateCart = async (cartId: string, input: UpdateMercurCartInput) => {
  const response = await mercurStoreClient.post<unknown, MercurCartResponse>(`/carts/${cartId}`, input)

  return response.cart
}

export const listShippingOptions = async (cartId: string) => {
  return mercurStoreClient.get<unknown, MercurShippingOptionsResponse>('/shipping-options', {
    params: {
      cart_id: cartId,
    },
  })
}

export const addShippingMethod = async (cartId: string, optionId: string) => {
  const response = await mercurStoreClient.post<unknown, MercurCartResponse>(
    `/carts/${cartId}/shipping-methods`,
    { option_id: optionId }
  )

  return response.cart
}

export { mercurStoreClient }
export default mercurStoreClient
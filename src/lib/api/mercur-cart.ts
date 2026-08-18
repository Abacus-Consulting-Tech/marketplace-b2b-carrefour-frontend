import type { Product } from '@/types'
import {
  addShippingMethod,
  addLineItem,
  createCart,
  listShippingOptions,
  removeLineItem,
  retrieveCart,
  updateCart,
  updateLineItem,
  type MercurCartAddress,
} from '@/lib/api/mercur-store-client'
import { mapMercurCartToCartState } from '@/lib/api/mercur-mappers'

export const isMercurCartEnabled = () => process.env.NEXT_PUBLIC_CART_SOURCE === 'mercur'

export const addProductToMercurCart = async ({
  product,
  quantity,
  cartId,
}: {
  product: Product
  quantity: number
  cartId?: string
}) => {
  if (!product.offerId) {
    throw new Error(`Product ${product.id} does not include a Mercur offer_id`)
  }

  const activeCart = cartId ? await retrieveCart(cartId) : await createCart()

  await addLineItem(activeCart.id, {
    offer_id: product.offerId,
    quantity,
  })

  const refreshedCart = await retrieveCart(activeCart.id)

  return mapMercurCartToCartState(refreshedCart)
}

export const updateMercurCartLineItem = async ({
  cartId,
  lineItemId,
  quantity,
}: {
  cartId: string
  lineItemId: string
  quantity: number
}) => {
  const cart = await updateLineItem(cartId, lineItemId, { quantity })

  return mapMercurCartToCartState(cart)
}

export const removeMercurCartLineItem = async ({
  cartId,
  lineItemId,
}: {
  cartId: string
  lineItemId: string
}) => {
  const cart = await removeLineItem(cartId, lineItemId)

  return mapMercurCartToCartState(cart)
}

export const updateMercurCartShippingAddress = async ({
  cartId,
  shippingAddress,
}: {
  cartId: string
  shippingAddress: MercurCartAddress
}) => {
  const cart = await updateCart(cartId, { shipping_address: shippingAddress })

  return mapMercurCartToCartState(cart)
}

export const applyFirstMercurShippingOption = async (cartId: string) => {
  const response = await listShippingOptions(cartId)
  const [firstOption] = Object.values(response.shipping_options).flat()

  if (!firstOption) {
    return undefined
  }

  const cart = await addShippingMethod(cartId, firstOption.id)

  return mapMercurCartToCartState(cart)
}
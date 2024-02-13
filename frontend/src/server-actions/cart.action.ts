'use server'

import { CartServiceFactory } from "@/services/cart.service";
import { redirect } from "next/navigation";

export async function addToCartAction(formData: FormData) {
  const cartService = CartServiceFactory.create()

  const productId = formData.get('product_id')!.toString()
  const quantity = formData.get('quantity')!.toString()
  
  await cartService.addToCart({ product_id: productId, quantity: parseInt(quantity) })

  redirect('/my-cart')
}

export async function removeItemFromCartAction(formData: FormData) {
  const cartService = CartServiceFactory.create()

  const index = parseInt(formData.get('index')!.toString())
  cartService.removeItemFromCart(index)
}
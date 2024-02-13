'use server'

import { redirect } from "next/navigation";
import { CartServiceFactory } from "@/services/cart.service";
import { OrderServiceFactory } from "@/services/order.service";
import { Order } from "@/models";

export async function checkoutAction(formData: FormData) {
  const cartService = CartServiceFactory.create()
  const orderService = OrderServiceFactory.create();
  const cart = cartService.getCart()
  let order: Order;

  try {
    order = await orderService.createOrder({
      card_hash: formData.get("card_hash")!.toString(),
      items: cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }))
    })

    cartService.clearCart()
  } catch (err) {
    console.log("🚀 ~ checkoutAction ~ err:", err)
    return { error: { message: "O pagamento não foi aprovado." } }
  }

  redirect(`/checkout/${order.id}/success`)
} 
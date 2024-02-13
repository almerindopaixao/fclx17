import { Order } from "../models";
import { AuthService, AuthServiceFactory } from "./auth.service";


interface OrderInput {
  card_hash: string;
  items: { 
    product_id: string; 
    quantity: number 
  }[];
}

export class OrderService {
  constructor(private authService: AuthService) {}

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${process.env.ORDER_API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
    return await response.json();
  }

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${process.env.ORDER_API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
    return await response.json();
  }

  async createOrder(input: OrderInput): Promise<Order> {
    const response = await fetch(`${process.env.ORDER_API_URL}/orders`, {
      method: "POST",
      body: JSON.stringify({
        card_hash: input.card_hash,
        items: input.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data;
      throw new Error(error.message);
    }

    return data;
  }
}

export class OrderServiceFactory {
  static create() {
    const authService = AuthServiceFactory.create()
    return new OrderService(authService);
  }
}
import { ProductService } from "./product.service";
import { Cart } from "@/models";
import { CookieProvider } from "@/providers/cookie.provider";

export class CartService {
  private emptyCart: Cart = { items: [], total: 0 }
  constructor(private productService: ProductService, private cookieProvider: CookieProvider) {}

  async addToCart(input: { product_id: string; quantity: number }) {
    const cart = this.cookieProvider.getJson('cart', this.emptyCart);
    const { product_id, quantity } = input;

    const product = await this.productService.getProduct(product_id);
    const productPrice = product.price * quantity;

    cart.items.push({
      product_id,
      quantity,
      total: productPrice,
    });

    cart.total += productPrice;

    this.cookieProvider.setJson('cart', cart);
  }

  removeItemFromCart(index: number) {
    const cart = this.cookieProvider.getJson('cart', this.emptyCart);
    const removedItem = cart.items[index];

    cart.items.splice(index, 1);
    cart.total -= removedItem.total

    this.cookieProvider.setJson('cart', cart);
  }

  getCart() {
    return this.cookieProvider.getJson('cart', this.emptyCart);
  }

  clearCart() {
    this.cookieProvider.clear("cart");
  }
}

export class CartServiceFactory {
  static create() {
    const cookieProvider = new CookieProvider();
    const productService = new ProductService();

    return new CartService(productService, cookieProvider);
  }
}
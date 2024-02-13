import { Product } from "@/models";
import { BaseService } from "./base.service";

export interface GetProductsInput {
  search?: string,
  categoryId?: string,
}

export class ProductService extends BaseService {
  private defaultUrl: string = `${process.env.CATALOG_API_URL}/product`

  async getProductByIds(productIds: string[]): Promise<Product[]> {
    return Promise.all(productIds.map((productId) => this.getProduct(productId)))
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.defaultUrl}/${id}`, {
      next: {
        revalidate: 10,
      },
    });
    
    return response.json();
  }

  async getProducts({ search, categoryId }: GetProductsInput): Promise<Product[]> {
    const url = categoryId ? `${this.defaultUrl}/category/${categoryId}` : this.defaultUrl
    
    const response = await fetch(url, {
      next: {
        revalidate: 10,
      },
    });
    
    const data = await this.handleJsonResponse<Product[]>(response, []);
    if (!search) return data;

    return data.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
  }
}
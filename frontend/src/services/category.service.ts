import { Category, Product } from "@/models";
import { BaseService } from "./base.service";

export interface GetProductsInput {
  search?: string
}

export class CategoryService extends BaseService {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${process.env.CATALOG_API_URL}/category`, {
      next: {
        revalidate: 10,
      },
    });
    
    return this.handleJsonResponse<Category[]>(response, []);
  }
}
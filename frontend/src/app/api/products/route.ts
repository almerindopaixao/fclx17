import { ProductService } from "@/services/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const productService = new ProductService();
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') ?? undefined
  const categoryId = searchParams.get('category_id') ?? undefined
  const products = await productService.getProducts({ search, categoryId })
  return NextResponse.json(products)
}
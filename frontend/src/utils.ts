import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function encodeJsonToBase64<T>(value: T): string {
  return Buffer.from(JSON.stringify(value)).toString('base64')
}

export function decodeJsonFromBase64<T>(value: string, defaultResult: T): T {
  try {
    const buffer = Buffer.from(value, 'base64');
    const jsonStr = buffer.toString('utf-8');
    return JSON.parse(jsonStr);
  } catch (err) {
    console.log("🚀 ~ err:", err)
    return defaultResult
  }
}

export function searchProducts(
  router: AppRouterInstance,
  search: string | undefined | null,
  category_id: string | undefined | null
) {
  let path = `/products`;

  const urlSearchParams = new URLSearchParams();

  if (search) {
    urlSearchParams.append("search", search);
  }

  if (category_id && category_id !== "0") {
    urlSearchParams.append("category_id", category_id);
  }

  if (urlSearchParams.toString()) {
    path += `?${urlSearchParams.toString()}`;
  }

  router.push(path);
}

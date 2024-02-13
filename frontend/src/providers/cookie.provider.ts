import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { decodeJsonFromBase64, encodeJsonToBase64 } from "@/utils";

export class CookieProvider {
  private cookieStore: ReadonlyRequestCookies;

  constructor() {
    this.cookieStore = cookies();
  }

  getJson<T>(key: string, defaultValue: T): T {
    const raw = this.cookieStore.get(key)?.value;
    return raw ? decodeJsonFromBase64(raw, defaultValue) : defaultValue
  }

  setJson<T>(key: string, value: T): void {
    this.cookieStore.set(key, encodeJsonToBase64(value), {
      httpOnly: true,
    })
  }

  clear(key: string) {
    this.cookieStore.delete(key);
  }

  set<T>(key: string, value: T): void {
    const rawValue = typeof value != 'string' ? JSON.stringify(value) : value

    this.cookieStore.set(key, rawValue, {
      httpOnly: true,
    })
  }

  get(key: string): string | undefined{
    return this.cookieStore.get(key)?.value;
  }

  setSecure<T>(key: string, value: T): void {
    const rawValue = typeof value != 'string' ? JSON.stringify(value) : value

    this.cookieStore.set(key, rawValue, {
      httpOnly: true,
    })
  }

  getSecure(key: string): string | undefined{
    return this.cookieStore.get(key)?.value;
  }
}
export class BaseService {
  protected async handleJsonResponse<T>(response: Response, valueDefault: T): Promise<T> {
    try {
      const data = await response.json()
      if (!data) return valueDefault;

      return data as T
    } catch (err) {
      console.log(`🚀 ~ ${this.constructor.name} ~ err:`, err)
      return valueDefault
    }
  }
}
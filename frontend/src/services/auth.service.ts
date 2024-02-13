import { CookieProvider } from "@/providers/cookie.provider";

interface LoginInput {
  email: string;
  password: string;
}

interface User {
  sub: number,
  username: string,
  iat: number,
  exp: number
}

export class AuthService {
  constructor(private cookieProvider: CookieProvider) {}

  async login(input: LoginInput) {
    const response = await fetch(`${process.env.ORDER_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: input.email,
        password: input.password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.status === 401) {
      return { error: "Credenciais inválidas" }
    }

    if (!response.ok) {
      const error = await response.json();
      return {error}
    }

    const data = await response.json();
    this.cookieProvider.set("token", data.accessToken)
  }

  logout() {
    this.cookieProvider.clear("token");
  }

  getUser(): User | null {
    const token = this.cookieProvider.get("token")

    if (!token) {
      return null;
    }

    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    return JSON.parse(payloadDecoded);
  }

  getToken() {
    return this.cookieProvider.get("token")
  }

  isTokenExpired(): boolean {
    const user = this.getUser();

    if (!user) {
      return true;
    }

    const now = new Date();
    const exp = new Date(user.exp * 1000);

    return now > exp;
  }
}

export class AuthServiceFactory {
  static create() {
    const cookieProvider = new CookieProvider();
    return new AuthService(cookieProvider);
  }
}
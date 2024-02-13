"use server"

import { redirect } from "next/navigation"
import { AuthServiceFactory } from "@/services/auth.service"

export async function loginAction(formData: FormData) {
  const email = formData.get('email')!.toString()
  const password = formData.get('password')!.toString()
  const redirectTo = formData.get("redirect_to")!.toString()

  const authService = AuthServiceFactory.create()
  const error = await authService.login({ email, password });

  if (error) {
    return error
  }

  redirect(redirectTo || "/products")
}

export async function logoutAction() {
  const authService = AuthServiceFactory.create()
  authService.logout()
  redirect("/login")
}
import type { Metadata } from "next";
import { LoginForm } from "@/app/admin/login/LoginForm";

export const metadata: Metadata = { title: "Operator sign in" };

export default function AdminLoginPage() {
  return (
    <article className="mx-auto max-w-sm">
      <h1 className="font-serif text-3xl">Operator sign in</h1>
      <LoginForm />
    </article>
  );
}

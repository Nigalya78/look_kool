import type { Metadata } from "next";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = {
  title: "Sign In — LookKool",
  description:
    "Sign in to your LookKool account. Access your orders, manage your profile, and unlock member-exclusive discounts up to 30% on women's fashion.",
};

export default function LoginPage() {
  return <LoginForm />;
}

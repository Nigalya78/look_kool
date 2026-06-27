import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "./_components/register-form";

export const metadata: Metadata = {
  title: "Create Account — Join LookKool",
  description:
    "Create your free LookKool account. Shop designer women's fashion with member-exclusive discounts up to 30% and fast delivery across India.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin h-8 w-8 text-primary" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}

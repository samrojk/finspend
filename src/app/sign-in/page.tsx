"use client";

import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <SignIn routing="hash" />
    </main>
  );
}

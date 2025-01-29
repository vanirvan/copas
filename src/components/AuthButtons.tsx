"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { theme } = useTheme();

  return (
    <>
      <SignedIn>
        <UserButton
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton
          mode="modal"
          fallbackRedirectUrl={process.env.NEXT_PUBLIC_APP_URL!}
          signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_APP_URL!}
        >
          <Button size={"sm"}>Signin</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

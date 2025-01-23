import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <>
      <SignedIn>
        <UserButton />
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

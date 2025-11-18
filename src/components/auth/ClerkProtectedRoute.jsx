import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export default function ClerkProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

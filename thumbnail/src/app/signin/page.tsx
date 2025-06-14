import { redirect } from "next/navigation";
import SignIn from "~/components/ui/signin";
import { auth } from "~/server/auth";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default async function SignInPage() {
  const session = await auth();

  // Redirect to dashboard if user is already logged in
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-10">
      <SignIn />
    </div>
  );
}
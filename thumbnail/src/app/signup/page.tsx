import { redirect } from "next/navigation";
import SignUp from "~/components/ui/signup";
import { auth } from "~/server/auth";

export const metadata = {
  title: "Sign Up",
  description: "Sign up for an account",
}

export default async function SignUpPage() {
  const session = await auth();

  // Redirect to dashboard if user is already logged in
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-10">
      <SignUp />
    </div>
  );
}
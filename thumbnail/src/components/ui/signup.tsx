"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { z } from "zod";
import { signInSchema } from "~/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "~/app/actions/auth";
import { toast } from "sonner";

type FormValues = z.infer<typeof signInSchema>;

const Signup = () => {
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: FormValues) => {
    const error = await signup(data.email, data.password);

    if (error) {
      toast.error("Sign up failed", {
        description: error,
      });
    } else {
      toast.success("Sign up successful", {
        description: "You can now sign in with your new account.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="flex flex-col gap-6 w-full max-w-md p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2">
          <IoMdArrowBack className="h-5 w-5" />
          <span className="leading-7 font-medium">Go back</span>
        </Link>
        <Card className="w-full max-w-sm border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>
              Enter your email and a password below to sign up.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="mail@gmail.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4">
              <Button type="submit" className="w-full">
                Sign up
              </Button>
              <Link href="/signin">
                <Button variant="link">Already have an account?</Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
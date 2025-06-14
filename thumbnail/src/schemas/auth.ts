import { z } from "zod"

export const signInSchema = z.object({
    email: z.string({required_error: "Email is required"}).min(1, "Email is required").email("Invalid email address"),
    password: z.string({required_error: "Password is required"}).min(1, "Password is required").min(8, "Password must be at least 8 characters long").max(32, "Password must be less than 100 characters long"),
});

export const signUpSchema = z.object({
    email: z.string({required_error: "Email is required"}).min(1, "Email is required").email("Invalid email address"),
    password: z.string({required_error: "Password is required"}).min(1, "Password is required").min(8, "Password must be at least 8 characters long").max(32, "Password must be less than 100 characters long"),
    confirmPassword: z.string({required_error: "Confirm Password is required"}).min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});
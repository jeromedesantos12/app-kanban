"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, KeySquare, Mail, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import { Public } from "../../routes/public";
import { useRouter } from "next/navigation";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/register";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: RegisterFormValues) {
    setIsSubmitting(true);
    const { full_name, email, password } = formData;
    const { error } = await supabase.auth.signUp({
      options: { data: { full_name, avatar_url: "" } },
      email,
      password,
    });
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      setIsSubmitting(false);
      throw new Error("Email ini sudah terdaftar. Silakan masuk.");
    }
    if (error) {
      setIsSubmitting(false);
      return toast.error(error.message);
    }
    toast.success("User registered successfully!");
    setIsSubmitting(false);
  }

  return (
    <Public>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="bg-white py-10 px-8 w-full max-w-sm rounded-lg flex flex-col gap-8 shadow-2xl justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-zinc-700">Hello, let&apos;s join with us!</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <div className="flex flex-col gap-1">
              <div className="relative">
                <User className="absolute top-3 left-3 text-zinc-500" />
                <input
                  className={`bg-zinc-300 rounded-lg pl-12 px-2 py-3 w-full ${
                    errors.full_name ? "border-2 border-red-500" : ""
                  }`}
                  type="text"
                  placeholder="Full Name"
                  {...register("full_name")}
                />
              </div>
              {errors.full_name && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.full_name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-zinc-500" />
                <input
                  className={`bg-zinc-300 rounded-lg pl-12 px-2 py-3 w-full ${
                    errors.email ? "border-2 border-red-500" : ""
                  }`}
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="relative">
                <KeyRound className="absolute top-3 left-3 text-zinc-500" />
                <input
                  className={`bg-zinc-300 rounded-lg pl-12 px-2 py-3 w-full ${
                    errors.password ? "border-2 border-red-500" : ""
                  }`}
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="relative">
                <KeySquare className="absolute top-3 left-3 text-zinc-500" />
                <input
                  className={`bg-zinc-300 rounded-lg pl-12 px-2 py-3 w-full ${
                    errors.confirmPassword ? "border-2 border-red-500" : ""
                  }`}
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center mt-2">
              <button
                type="submit"
                className="w-full auth-button text-white font-semibold py-2 px-6 rounded-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Register"}
              </button>
              <p>
                Already have account?{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="text-blue-500 font-medium hover:text-blue-700 duration-300 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Public>
  );
}

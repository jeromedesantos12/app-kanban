"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed, KeyRound, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Public } from "../../routes/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas/login";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hide, setHide] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: LoginFormValues) {
    setIsSubmitting(true);
    const { email, password } = formData;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setIsSubmitting(false);
      return toast.error(error.message);
    }
    toast.success("User login successfully!");
    setIsSubmitting(false);
  }

  return (
    <Public>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="bg-white py-10 px-8 w-full max-w-sm rounded-lg flex flex-col gap-8 shadow-2xl justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-3xl font-bold">Login</h1>
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
                <div
                  onClick={() => setHide(!hide)}
                  className="absolute top-3 right-3 z-10 cursor-pointer text-zinc-500 hover:text-zinc-700 duration-300"
                >
                  {hide ? <EyeClosed /> : <Eye />}
                </div>
                <KeyRound className="absolute top-3 left-3 text-zinc-500" />
                <input
                  placeholder="Password"
                  className={`bg-zinc-300 rounded-lg px-2 py-3 w-full pl-12 ${
                    errors.password ? "border-2 border-red-500" : ""
                  }`}
                  type={hide ? "password" : "text"}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center mt-2">
              <button
                type="submit"
                className="w-full auth-button text-white font-semibold py-2 px-6 rounded-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Login"}
              </button>
              <p>
                Have no account?{" "}
                <span
                  onClick={() => router.push("/register")}
                  className="text-blue-500 font-medium hover:text-blue-700 duration-300 cursor-pointer"
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Public>
  );
}

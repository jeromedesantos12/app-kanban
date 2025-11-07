"use client";

import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "../redux/store";
import { clearSession, fetchSession, setSession } from "../redux/slices";
import { supabase } from "../lib/supabase";
import { Loading } from "../components/ui/loading";

export function Public({ children }: { children: ReactNode }) {
  const { status, data } = useSelector((state: RootState) => state.session);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // Ambil session saat pertama kali render
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSession());
    }
  }, [dispatch, status]);

  // Dengarkan perubahan auth state
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("📡 Auth state changed:", event);
        if (session) {
          dispatch(setSession(session));
          router.replace("/dashboard"); // 👉 langsung arahkan ke halaman utama
        } else {
          dispatch(clearSession());
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch, router]);

  // Kalau sudah login, redirect ke halaman utama
  useEffect(() => {
    if (status === "succeeded" && data) {
      router.replace("/dashboard");
    }
  }, [status, data, router]);

  if (status === "loading" || status === "idle") {
    return <Loading size={30} className="mt-40" />;
  }

  // Kalau belum login, tampilkan halaman public (misalnya login / register)
  if (status === "succeeded" && !data) {
    return <>{children}</>;
  }
  return <>{children}</>;
}

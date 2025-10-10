"use client";

import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearSession, fetchSession, setSession } from "../redux/slices";
import type { AppDispatch, RootState } from "../redux/store";
import { supabase } from "../lib/supabase";
import { Loading } from "../components/ui/loading";

export function Protected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, data } = useSelector((state: RootState) => state.session);
  const dispatch: AppDispatch = useDispatch();

  // 🔁 Ambil session awal saat pertama kali render
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSession());
    }
  }, [dispatch, status]);

  // 👀 Reaksi terhadap perubahan auth state secara real-time
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("📡 Auth state changed:", event);
        if (session) {
          dispatch(setSession(session));
        } else {
          dispatch(clearSession());
          router.replace("/login");
        }
      }
    );
    // 🧹 Cleanup listener saat komponen unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch, router]);

  // 🔐 Redirect jika user tidak punya session
  useEffect(() => {
    if (status === "succeeded" && !data) {
      router.replace("/login");
    }
    if (status === "failed") {
      router.replace("/login");
    }
  }, [status, data, router]);

  if (status === "loading" || status === "idle") {
    return <Loading />;
  }
  if (status === "succeeded" && data) {
    return <>{children}</>;
  }
  return null;
}

// 📌 Penjelasan logika baru:

// 🔥 fetchSession() tetap dipakai sekali saat awal supaya Redux langsung punya session dari local storage (kalau ada).
// 👂 onAuthStateChange() akan jalan terus:
// Kalau user login / signUp / token refresh, kita panggil setSession(session).
// Kalau user logout / token expire, kita clearSession() dan langsung redirect ke /login.
// 🧹 Cleanup penting supaya listener gak nambah dua kali kalau komponen re-render.

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

  // 🔁 Get initial session on first render
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSession());
    }
  }, [dispatch, status]);

  // 👀 React to auth state changes in real-time
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
    // 🧹 Cleanup listener on component unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch, router]);

  // 🔐 Redirect if user has no session
  useEffect(() => {
    if (status === "succeeded" && !data) {
      router.replace("/login");
    }
    if (status === "failed") {
      router.replace("/login");
    }
  }, [status, data, router]);

  if (status === "loading" || status === "idle") {
    return <Loading size={30} className="mt-40" />;
  }
  if (status === "succeeded" && data) {
    return <>{children}</>;
  }
  return null;
}

// 📌 New logic explanation:

// 🔥 fetchSession() is still used once at the beginning so that Redux immediately has a session from local storage (if any).
// 👂 onAuthStateChange() will continue to run:
// If the user logs in / signs up / token refreshes, we call setSession(session).
// If the user logs out / token expires, we clearSession() and immediately redirect to /login.
// 🧹 Cleanup is important so that the listener doesn't get added twice if the component re-renders.

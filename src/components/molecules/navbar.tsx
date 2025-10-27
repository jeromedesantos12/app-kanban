"use client";

import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../lib/supabase";
import { fetchSession } from "../../redux/slices";
import { AppDispatch, RootState } from "../../redux/store";
import { AlignEndVertical, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileType } from "@/types/profile";
import defaultAvatar from "../../../public/default-avatar.jpg";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const { data: session } = useSelector((state: RootState) => state.session);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("User logged out successfully!");
      dispatch(fetchSession());
    }
  }

  useEffect(() => {
    async function fetchData(id: string) {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (profilesError) {
        return toast.error(profilesError.message);
      }
      if (profilesData) {
        setProfile(profilesData);
        if (profilesData.avatar_url) {
          setBase64Image(profilesData.avatar_url);
        }
      }
    }
    if (session?.user.id) {
      fetchData(session.user.id);
    }
  }, [session?.user.id]);

  return (
    <div
      className={cn(
        "sticky flex justify-center top-0 z-10",
        session ? "bg-black shadow-2xl backdrop-blur-2xl" : "bg-transparent"
      )}
    >
      <div className="flex justify-between gap-10 max-w-7xl items-center w-full py-5 px-10">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <AlignEndVertical className="text-white" />
          <h1 className="font-bold text-2xl text-white">Todo</h1>
        </div>
        <div className="flex gap-5 justify-center items-center">
          {session && (
            <Image
              onClick={() => router.push("/profile")}
              src={base64Image || defaultAvatar}
              alt={`Image of ${profile?.full_name || "user"}`}
              width={50}
              height={50}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          )}
          {session ? (
            <button
              onClick={handleLogout}
              className="bg-blue-400 border-2 border-blue-400  hover:bg-blue-300 duration-300 cursor-pointer text-black font-medium py-2 px-3 text-sm rounded-lg flex  justify-center not-only-of-type:items-center gap-2"
            >
              <LogOut />
              <p>Logout</p>
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-transparant border-2 border-white hover:bg-white duration-300 cursor-pointer text-white hover:text-black font-medium py-2 px-3 text-sm rounded-lg flex justify-center not-only-of-type:items-center gap-2"
            >
              <LogIn />
              <p>Login</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

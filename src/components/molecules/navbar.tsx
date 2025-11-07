"use client";

import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../lib/supabase";
import { fetchSession } from "../../redux/slices";
import { AppDispatch, RootState } from "../../redux/store";
import { KanbanSquare, LogIn, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileType } from "../../types/profile";
import defaultAvatar from "../../../public/default-avatar.jpg";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Feature", href: "/#feature" },
  { name: "Workflow", href: "/#workflow" },
];

export function Navbar({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const { data: session } = useSelector((state: RootState) => state.session);
  const [scrolled, setScrolled] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Error logging out: ${error?.message}`);
    } else {
      toast.success("Logged out successfully!");
      dispatch(fetchSession());
      router.push("/");
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    } else {
      setProfile(null);
      setBase64Image(null);
    }
  }, [session?.user.id]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled || isOpen
          ? "bg-gray-900/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent",
        session?.user.id && "bg-black shadow-lg"
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-white">
              <KanbanSquare className="h-7 w-7" />
              <span className="font-bold text-xl">Todo</span>
            </Link>
          </div>
          <div className="hidden md:block">
            {
              <nav className="ml-10 flex items-baseline space-x-4">
                {!session &&
                  navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  ))}
              </nav>
            }
          </div>
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Image
                  onClick={() => router.push("/profile")}
                  src={base64Image || defaultAvatar}
                  alt={`Image of ${profile?.full_name || "user"}`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-600 hover:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 duration-300 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 duration-300 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen?.(!isOpen);
              }}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen?.(false)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {session ? (
              <div className="flex flex-col gap-4 px-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen?.(false);
                      }}
                      src={base64Image || defaultAvatar}
                      alt={`Image of ${profile?.full_name || "user"}`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 duration-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="px-2">
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsOpen?.(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 duration-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

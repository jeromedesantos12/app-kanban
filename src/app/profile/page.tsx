"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Protected } from "@/routes/protected";
import { Navbar } from "@/components/molecules/navbar";
import { ProfileFormValues, profileSchema } from "@/schemas/profile";
import defaultAvatar from "../../../public/default-avatar.jpg";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { ProfileType } from "@/types/profile";
import { Loading } from "@/components/ui/loading";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [remove, setRemove] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSelector((state: RootState) => state.session);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
    },
  });

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.length ? e.target.files[0] : null;
    if (!file) return;
    setImage(file);
    setRemove(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBase64Image(reader.result);
      }
    };
  }

  useEffect(() => {
    if (session?.user.id) {
      (async function fetchData(id: string) {
        setIsLoading(true);
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
          reset({
            full_name: profilesData.full_name || "",
          });
          if (profilesData.avatar_url) {
            setBase64Image(profilesData.avatar_url);
          }
        }
        setIsLoading(false);
      })(session.user.id);
    }
  }, [reset, session?.user.id]);

  async function onSubmit(formData: ProfileFormValues) {
    setIsSubmitting(true);
    if (!session?.user?.id) {
      setIsSubmitting(false);
      return toast.error("You must be logged in to update your profile.");
    }
    setIsSubmitting(true);
    let avatar_url = profile?.avatar_url;
    if (image) {
      const urlParts = profile?.avatar_url?.split("/avatars/") || [];
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([filePath]);
        if (deleteError) {
          setIsSubmitting(false);
          return toast.error(deleteError.message);
        }
      }
      const fileExt = image.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) {
        setIsSubmitting(false);
        return toast.error(uploadError.message);
      }
      if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadData.path);
        avatar_url = publicUrlData.publicUrl;
      }
    } else if (remove) {
      avatar_url = "";
      if (profile?.avatar_url) {
        const urlParts = profile.avatar_url.split("/avatars/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove([filePath]);
          if (deleteError) {
            setIsSubmitting(false);
            return toast.error(deleteError.message);
          }
        }
      }
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        avatar_url: avatar_url,
      })
      .eq("id", session.user.id);
    if (updateError) {
      setIsSubmitting(false);
      return toast.error(updateError.message);
    }
    toast.success("Profile updated successfully!");
    setIsSubmitting(false);
    router.push("/");
  }

  return (
    <Protected>
      <Navbar />
      {isLoading ? (
        <Loading size={30} className="mt-40" />
      ) : (
        <div className="flex flex-col justify-center items-center mt-40 px-5">
          <div className="bg-white py-10 px-8 w-full max-w-sm rounded-lg flex flex-col gap-5 shadow-2xl justify-center items-center">
            <div className="relative">
              <div className="relative">
                <input
                  className="bg-transparent w-30 h-30 rounded-full absolute cursor-pointer text-transparent"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Image
                  src={base64Image || defaultAvatar}
                  alt={`Image of ${profile?.full_name || "user"}`}
                  width={50}
                  height={50}
                  className="w-30 h-30 rounded-full object-cover"
                />
              </div>
              <Trash
                onClick={() => {
                  setRemove("ok");
                  setBase64Image(null);
                  setImage(null);
                }}
                className="absolute bottom-0 -right-7 cursor-pointer text-red-500 hover:text-red-700"
              />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2 w-full max-w-xs"
            >
              <label
                htmlFor="full_name"
                className="text-2xl text-center font-bold mb-2"
              >
                My Profile
              </label>
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <User className="absolute top-3 left-3 text-zinc-500" />
                  <input
                    id="full_name"
                    className={`bg-zinc-300 rounded-lg pl-12 px-2 py-3 w-full ${
                      errors.full_name ? "border-2 border-red-500" : ""
                    }`}
                    type="text"
                    placeholder="Insert a full name.."
                    {...register("full_name")}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-red-500 text-sm font-medium">
                    {errors.full_name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-center mt-2">
                <button
                  type="submit"
                  className="w-full auth-button text-white font-semibold py-2 px-6 rounded-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Protected>
  );
}

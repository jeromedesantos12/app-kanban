"use client";

import { Loading } from "@/components/ui/loading";
import { Navbar } from "@/components/molecules/navbar";
import { supabase } from "@/lib/supabase";
import { Protected } from "@/routes/protected";
import { TaskType } from "@/types/task";
import { NotebookText, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTask] = useState<TaskType | null>(null);

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async function fetchData(id: string) {
      setIsLoading(true);
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();
      if (tasksError) {
        return toast.error(tasksError.message);
      }
      if (tasksData) {
        setTask(tasksData);
        // Inisialisasi state edit dengan data yang ada
        setEditedTitle(tasksData.title);
        setEditedContent(tasksData.content);
      }
      setIsLoading(false);
    })(taskId);
  }, [taskId]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.error("Judul dan konten tidak boleh kosong.");
      return;
    }
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("tasks")
      .update({ title: editedTitle, content: editedContent })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      setTask(data); // Update state lokal dengan data baru
      toast.success("Tugas berhasil diperbarui!");
      setIsEditing(false); // Kembali ke mode lihat
    }

    setIsSubmitting(false);
  }

  return (
    <Protected>
      <Navbar />
      {isLoading ? (
        <Loading size={30} className="mt-40" />
      ) : (
        task && (
          <div className="flex flex-col justify-center items-center mt-40 px-5">
            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="bg-white py-10 px-8 w-full max-w-sm rounded-lg flex flex-col gap-5 shadow-2xl"
              >
                <div className="flex flex-col gap-4">
                  <label htmlFor="title" className="font-semibold">
                    Judul Tugas
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="content" className="font-semibold">
                    Konten
                  </label>
                  <textarea
                    id="content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="border rounded-lg p-2 w-full h-32"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white py-10 px-8 w-full max-w-sm rounded-lg flex flex-col gap-5 shadow-2xl relative">
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <div className="flex gap-2 items-center flex-wrap">
                  <NotebookText />
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                </div>
                <p className="text-zinc-500">{task.content}</p>
              </div>
            )}
          </div>
        )
      )}
    </Protected>
  );
}

"use client";

import { Loading } from "@/components/ui/loading";
import { Navbar } from "@/components/molecules/navbar";
import { supabase } from "@/lib/supabase";
import { Protected } from "@/routes/protected";
import { TaskType } from "@/types/task";
import { NotebookText } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTasks] = useState<TaskType | null>(null);

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
        setTasks(tasksData);
      }
      setIsLoading(false);
    })(taskId);
  }, [taskId]);

  return (
    <Protected>
      <Navbar />
      {isLoading ? (
        <Loading size={30} className="mt-40" />
      ) : (
        task && (
          <div className="flex flex-col justify-center items-center mt-20 px-5">
            <div className="bg-white py-10 px-8 w-full max-w-sm rounded-lg flex flex-col gap-5 shadow-2xl">
              <div className="flex gap-2 items-center flex-wrap">
                <NotebookText />
                <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
              </div>
              <p className="text-zinc-500 text-justify">{task.content}</p>
            </div>
          </div>
        )
      )}
    </Protected>
  );
}

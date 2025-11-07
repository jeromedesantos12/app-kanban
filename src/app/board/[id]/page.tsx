"use client";

import toast from "react-hot-toast";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Protected } from "@/routes/protected";
import { Navbar } from "@/components/molecules/navbar";
import { Bot, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Kita akan ubah List menjadi child KanbanBoard
import type { ListType } from "@/types/list";
import type { TaskType } from "@/types/task"; // Impor TaskType
import type { DragEndEvent } from "@/components/ui/shadcn-io/kanban"; // Import dari lokasi yang sama dengan komponen kanban Anda
import {
  KanbanCard,
  KanbanBoard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban"; // Import komponen Kanban
import { useRouter, useParams } from "next/navigation";
import { Loading } from "@/components/ui/loading";

export default function BoardPage({ children }: { children: ReactNode }) {
  const params = useParams();
  const boardId = params.id as string;
  const [lists, setLists] = useState<ListType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listName, setListName] = useState("");
  const [hide, setHide] = useState(true);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!listName) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [listName]);

  // Fungsi untuk menangani drag and drop task
  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    const newColumnId = over.id; // over.id adalah id dari KanbanBoard (yaitu List id)
    const draggedTaskId = active.id; // active.id adalah id dari KanbanCard (yaitu Task id)
    const listTarget = lists.find(({ id }) => id === newColumnId);
    if (!listTarget) return;

    // 1. Update State Lokal
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === draggedTaskId) {
          return { ...task, list_id: newColumnId as string };
        } // update kolom list_id
        return task;
      })
    );

    // 2. Update di Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ list_id: newColumnId })
      .eq("id", draggedTaskId);

    if (error) {
      toast.error(`Gagal memindahkan task: ${error.message}`);
      // Opsional: Lakukan rollback state lokal jika update database gagal
      // Anda bisa memuat ulang data atau membalikkan state
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // ... (kode insert list yang sudah ada)
    const { data, error } = await supabase
      .from("lists")
      .insert([
        {
          list_name: listName,
          board_id: boardId,
        },
      ])
      .select();
    if (error) {
      return toast.error(error.message);
    }
    setLists([...lists, data[0] as ListType]);
    setListName("");
    setHide(true);
  }

  // Fungsi fetch digabung, ambil semua lists dan tasks
  async function fetchData(id?: string) {
    setIsLoading(true);
    const { data: listsData, error: listsError } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", id);
    if (listsError) {
      return toast.error(listsError.message);
    }
    setLists(listsData as ListType[]);
    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select("*");
    if (tasksError) {
      return toast.error(tasksError.message);
    }
    setTasks(tasksData as TaskType[]);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData(boardId);
  }, [boardId]);

  // Format lists agar sesuai dengan properti 'columns' yang diharapkan KanbanProvider
  const kanbanColumns = lists.map((list) => ({
    id: list.id,
    name: list.list_name,
    // Tambahkan properti color jika Anda ingin menggunakannya
    color: "#6B7280", // Default color
  }));

  // Format tasks agar sesuai dengan properti 'data' yang diharapkan KanbanProvider
  // Pastikan properti kolom task mengacu pada list_id
  const kanbanData = tasks.map((task) => ({
    id: task.id,
    name: task.title,
    column: task.list_id, // Ini adalah kunci: Kanban menggunakan 'column'
    taskData: task,
    // Tambahkan properti task lainnya
  }));

  return (
    <Protected>
      <Navbar />
      {isLoading ? (
        <Loading size={30} className="mt-40" />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 mt-40">
            {/* Kontrol Add List tetap di sini */}
            <div className="flex gap-4 flex-wrap">
              {hide ? (
                <div
                  onClick={() => setHide(false)}
                  className="bg-white py-4 px-4 w-fit h-fit rounded-lg flex shadow-2xl gap-2 justify-center items-center hover:bg-zinc-300 duration-300 cursor-pointer"
                >
                  <Plus className="text-black" size={20} />
                  <h1 className="text-black font-medium text-md">Add List</h1>
                </div>
              ) : (
                <div className="bg-black py-4 px-4 w-full max-w-xs rounded-lg flex flex-col shadow-2xl justify-center items-center">
                  <form
                    className="flex flex-col gap-2 w-full"
                    action="submit"
                    onSubmit={handleSubmit}
                  >
                    <input
                      className="bg-black text-white placeholder:text-white rounded-lg px-5 py-2 w-full outline-white focus:outline-blue-400 outline-2"
                      type="text"
                      value={listName}
                      placeholder="Enter List name.."
                      onChange={(e) => setListName(e.target.value)}
                    />
                    <div className="flex gap-2 items-center">
                      <button
                        disabled={disabled}
                        type="submit"
                        className={`${
                          disabled && "opacity-50"
                        } bg-blue-400 cursor-pointer text-black font-medium py-2 px-4 text-sm rounded-xl`}
                      >
                        Add List
                      </button>
                      <div
                        onClick={() => setHide(true)}
                        className="cursor-pointer hover:bg-zinc-800 p-1 rounded-lg duration-300"
                      >
                        <X className="text-white" />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Gunakan KanbanProvider di sini */}
            <div>
              <KanbanProvider
                className="flex gap-10 flex-wrap"
                columns={kanbanColumns}
                data={kanbanData}
                onDragEnd={handleDragEnd}
              >
                {(column) => (
                  <KanbanBoard
                    id={column.id}
                    key={column.id}
                    // Anda bisa menambahkan class untuk styling dari div List lama
                    className="w-full h-fit max-w-xs bg-black py-4 px-4 rounded-lg flex flex-col gap-2 shadow-2xl border-none"
                  >
                    <KanbanHeader className="border-none">
                      <h1 className="text-white font-medium text-lg">
                        {column.name}
                      </h1>
                    </KanbanHeader>
                    <KanbanCards className="px-0" id={column.id}>
                      {(feature) => {
                        console.log(feature);

                        return (
                          // Gunakan TaskCard sebagai wrapper untuk KanbanCard

                          <TaskCard
                            column={column.name}
                            id={feature.id}
                            key={feature.id}
                            name={feature.name}
                          />
                        );
                      }}
                    </KanbanCards>
                    {/* Sisipkan fitur Add Task di bawah KanbanCards */}
                    <AddTask
                      listId={column.id}
                      onTaskAdded={(newTask) =>
                        setTasks((prev) => [...prev, newTask])
                      }
                    />
                  </KanbanBoard>
                )}
              </KanbanProvider>
            </div>
          </div>
        </div>
      )}
      {children}
    </Protected>
  );
}
// TaskCard akan menggantikan komponen Task Anda dan menggunakan KanbanCard
function TaskCard({
  id,
  name,
  column,
}: {
  id: string;
  name: string;
  column: string;
}) {
  const router = useRouter();

  return (
    <div className="flex gap-2 items-center w-full relative">
      <KanbanCard
        column={column}
        id={id}
        key={id}
        name={name}
        className="bg-zinc-700 rounded-lg border-none text-white w-full"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/task/${id}`);
        }}
        style={{ pointerEvents: "auto", zIndex: 50 }}
        className="text-blue-400 hover:text-blue-300 duration-300 absolute right-4 font-bold cursor-pointer"
      >
        Detail
      </button>
    </div>
  );
}

// Buat komponen baru untuk Add Task, karena tidak bisa di dalam List lagi
function AddTask({
  listId,
  onTaskAdded,
}: {
  listId: string;
  onTaskAdded: (task: TaskType) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hide, setHide] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!title || !content) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [content, title]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          content,
          list_id: listId,
        },
      ])
      .select();
    if (error) {
      toast.error(error.message);
    } else {
      onTaskAdded(data[0] as TaskType);
      setTitle("");
      setHide(true);
    }
  }

  async function handleGenerate() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.description) {
        setContent(data.description);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {hide ? (
        <div
          onClick={() => setHide(false)}
          className="w-full text-black rounded-lg px-4 py-2 gap-2 flex items-center hover:bg-zinc-800 duration-300 cursor-pointer"
        >
          <Plus size={15} className="text-white" />
          <p className="text-white text-sm">Add Task</p>
        </div>
      ) : (
        <div className="w-full max-w-xs rounded-lg flex flex-col shadow-2xl justify-center items-center py-4">
          <form
            className="flex flex-col gap-4 w-full"
            action="submit"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-2 items-center w-full relative">
              <input
                className="bg-black text-white placeholder:text-white rounded-lg px-4 pr-10 py-2 w-full outline-white focus:outline-blue-400 outline-2"
                type="text"
                value={title}
                placeholder="Enter Task name.."
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                onClick={handleGenerate}
                className="cursor-pointer absolute right-1 hover:bg-zinc-800 p-1 rounded-lg duration-300"
              >
                <Bot className="text-white" />
              </div>
            </div>
            <textarea
              className={`${
                loading ? "placeholder:text-blue-400" : "placeholder:text-white"
              } bg-black text-white h-20  rounded-lg px-4 py-2 w-full outline-white focus:outline-blue-400 outline-2`}
              value={content}
              disabled={loading}
              placeholder={
                loading
                  ? "Generating AI for description.."
                  : "Enter Content descriptions.."
              }
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <button
                disabled={disabled}
                type="submit"
                className={`${
                  disabled && "opacity-50"
                } bg-blue-400 cursor-pointer text-black font-medium py-2 px-4 text-sm rounded-xl`}
              >
                Add Task
              </button>
              <div
                onClick={() => setHide(true)}
                className="cursor-pointer hover:bg-zinc-800 p-1 rounded-lg duration-300"
              >
                <X className="text-white" />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

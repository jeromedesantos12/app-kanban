"use client";

import toast from "react-hot-toast";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Protected } from "@/routes/protected";
import { Navbar } from "@/components/molecules/navbar"; // Pastikan path ini benar
import { Bot, Plus, X, Trash2, Eye, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ListType } from "@/types/list";
import type { TaskType } from "@/types/task"; // Impor TaskType
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
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
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState("");
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  useEffect(() => {
    if (!listName) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [listName]);

  useEffect(() => {
    if (!editingListName.trim()) {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
  }, [editingListName]);

  async function handleUpdateList(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingListId || !editingListName.trim()) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("lists")
      .update({ list_name: editingListName })
      .eq("id", editingListId)
      .select();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === editingListId
            ? { ...list, list_name: editingListName }
            : list
        )
      );
      toast.success("List updated successfully");
    }

    setEditingListId(null);
    setEditingListName("");
    setIsSubmitting(false);
  }

  function confirmDeleteList(id: string) {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2">
          <p className="font-semibold text-center">
            Are you sure you want to delete this list?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleDeleteList(id);
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-bold text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  }

  async function handleDeleteList(listId: string) {
    // Pertama, hapus semua task yang ada di dalam list ini
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("list_id", listId);

    if (tasksError) {
      toast.error(`Failed to delete tasks in the list: ${tasksError.message}`);
      return;
    }

    // Kedua, setelah task berhasil dihapus, hapus list-nya
    const { error: listError } = await supabase
      .from("lists")
      .delete()
      .eq("id", listId);
    if (listError) {
      toast.error(listError.message);
    } else {
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.list_id !== listId)
      );
      toast.success("List deleted successfully");
    }
  }

  async function handleDeleteTask(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      toast.error(error.message);
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;

    // Tentukan ID kolom tujuan, baik saat drop di atas kolom atau di atas task lain
    const newColumnId =
      over.data.current?.type === "Task"
        ? over.data.current.task.list_id
        : overId;

    // 1. Lakukan pembaruan state secara optimis untuk UI
    const originalTasks = [...tasks];
    setTasks((currentTasks) => {
      const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
      const overIndex = currentTasks.findIndex((t) => t.id === overId);

      if (currentTasks[activeIndex].list_id !== newColumnId) {
        currentTasks[activeIndex].list_id = newColumnId as string;
        return arrayMove(currentTasks, activeIndex, overIndex);
      }
      return arrayMove(currentTasks, activeIndex, overIndex);
    });

    // 2. Kirim pembaruan ke database
    const { error } = await supabase
      .from("tasks")
      .update({ list_id: newColumnId })
      .eq("id", activeId);

    if (error) {
      toast.error(`Failed to move task: ${error.message}`);
      // Jika gagal, kembalikan state ke posisi semula (rollback)
      setTasks(originalTasks);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAddingList(true);
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
    setIsAddingList(false);
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

  function confirmDeleteTask(id: string) {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2">
          <p className="font-semibold text-center">
            Are you sure you want to delete this task?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleDeleteTask(id);
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-bold text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  }

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
                        disabled={disabled || isAddingList}
                        type="submit"
                        className={`${
                          (disabled || isAddingList) && "opacity-50"
                        } bg-blue-400 cursor-pointer text-black font-medium py-2 px-4 text-sm rounded-xl`}
                      >
                        {isAddingList ? "Adding.." : "Add List"}
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
            <div className="flex gap-10 flex-wrap">
              <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                {lists.map((list) => (
                  <ColumnContainer
                    key={list.id}
                    list={list}
                    tasks={tasks.filter((task) => task.list_id === list.id)}
                    editingListId={editingListId}
                    editingListName={editingListName}
                    isUpdateDisabled={isUpdateDisabled}
                    isSubmitting={isSubmitting}
                    setEditingListId={setEditingListId}
                    setEditingListName={setEditingListName}
                    handleUpdateList={handleUpdateList}
                    confirmDeleteList={confirmDeleteList}
                    onTaskAdded={(newTask) =>
                      setTasks((prev) => [...prev, newTask])
                    }
                    onDeleteTask={confirmDeleteTask}
                  />
                ))}

                {typeof window !== "undefined" &&
                  createPortal(
                    <DragOverlay>
                      {activeTask && (
                        // Kartu di overlay tidak perlu fungsi interaktif
                        <TaskCard task={activeTask} onDelete={() => {}} />
                      )}
                    </DragOverlay>,
                    document.body
                  )}
              </DndContext>
            </div>
          </div>
        </div>
      )}
      {children}
    </Protected>
  );
}

function ColumnContainer({
  list,
  tasks,
  editingListId,
  editingListName,
  isUpdateDisabled,
  isSubmitting,
  setEditingListId,
  setEditingListName,
  handleUpdateList,
  confirmDeleteList,
  onTaskAdded,
  onDeleteTask,
}: {
  list: ListType;
  tasks: TaskType[];
  editingListId: string | null;
  editingListName: string;
  isUpdateDisabled: boolean;
  isSubmitting: boolean;
  setEditingListId: (id: string | null) => void;
  setEditingListName: (name: string) => void;
  handleUpdateList: (e: FormEvent<HTMLFormElement>) => void;
  confirmDeleteList: (id: string) => void;
  onTaskAdded: (task: TaskType) => void;
  onDeleteTask: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: list.id,
    data: {
      type: "Column",
      list,
    },
  });
  return (
    <div
      ref={setNodeRef}
      className="w-full h-fit max-w-xs bg-black py-4 px-4 rounded-lg flex flex-col gap-2 shadow-2xl border-none"
    >
      {/* Header */}
      <div className="border-none">
        {editingListId === list.id ? (
          <form
            onSubmit={handleUpdateList}
            className="flex flex-col gap-2 w-full"
          >
            <input
              className="bg-black text-white placeholder:text-white rounded-lg px-5 py-2 w-full outline-white focus:outline-blue-400 outline-2"
              type="text"
              value={editingListName}
              onChange={(e) => setEditingListName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 items-center">
              <button
                disabled={isUpdateDisabled || isSubmitting}
                type="submit"
                className={`flex items-center justify-center gap-2 relative ${
                  (isUpdateDisabled || isSubmitting) && "opacity-50"
                } bg-blue-400 cursor-pointer text-black font-medium py-2 px-4 text-sm rounded-xl`}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
              <div
                onClick={() => setEditingListId(null)}
                className="cursor-pointer hover:bg-zinc-800 p-1 rounded-lg duration-300"
              >
                <X className="text-white" />
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className="text-white font-medium text-lg">{list.list_name}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingListId(list.id);
                  setEditingListName(list.list_name);
                }}
                className="text-white"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => confirmDeleteList(list.id)}
                className="text-white"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div
        className={`flex flex-col gap-2 min-h-[100px] p-2 rounded-lg ${
          isOver ? "bg-zinc-800" : ""
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>

      {/* Add Task */}
      <AddTask listId={list.id} onTaskAdded={onTaskAdded} />
    </div>
  );
}

function TaskCard({
  task,
  onDelete,
}: {
  onDelete: (id: string) => void;
  task: TaskType;
}) {
  const router = useRouter();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-zinc-900 p-4 rounded-lg border-2 border-blue-500 opacity-50 h-[60px] w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center cursor-grab relative"
    >
      <p className="text-white">{task.title}</p>
      <div className="absolute right-2 flex gap-3 items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-red-400 hover:text-red-300 duration-300 cursor-pointer z-50"
        >
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/task/${task.id}`);
          }}
          className="text-green-400 hover:text-green-300 duration-300 cursor-pointer z-50"
        >
          <Eye size={16} />
        </button>
      </div>
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
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    if (!title || !content) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [content, title]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAddingTask(true);
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
      setIsAddingTask(false);
    } else {
      onTaskAdded(data[0] as TaskType);
      setTitle("");
      setContent(""); // Clear content after adding task
      setHide(true);
      setIsAddingTask(false);
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
                disabled={disabled || isAddingTask}
                type="submit"
                className={`${
                  (disabled || isAddingTask) && "opacity-50"
                } bg-blue-400 cursor-pointer text-black font-medium py-2 px-4 text-sm rounded-xl`}
              >
                {isAddingTask ? "Adding.." : "Add Task"}
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

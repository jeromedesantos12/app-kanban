"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Protected } from "@/routes/protected";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/molecules/navbar";
import { BoardType } from "@/types/board";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Loading } from "@/components/ui/loading";

export default function DashboardPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [hide, setHide] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardName, setEditingBoardName] = useState("");
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const { data: session } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (!boardName) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [boardName]);

  useEffect(() => {
    if (!editingBoardName) {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
  }, [editingBoardName]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("boards")
      .insert([
        {
          title: boardName,
          user_id: session?.user.id,
        },
      ])
      .select();
    if (error) {
      setIsSubmitting(false);
      return toast.error(error.message);
    }
    setBoards((prevBoards) => [...prevBoards, data[0] as BoardType]);
    setBoardName("");
    setHide(true);
    setIsSubmitting(false);
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setIsSubmitting(true);
    if (!editingBoardName.trim()) {
      return toast.error("Board name cannot be empty.");
    }

    const { error } = await supabase
      .from("boards")
      .update({ title: editingBoardName })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
    } else {
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === id ? { ...board, title: editingBoardName } : board
        )
      );
      toast.success("Board updated successfully!");
      setEditingBoardId(null);
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("boards").delete().eq("id", id);

    if (error) {
      console.error("Error deleting board:", error);
      toast.error(error.message);
    } else {
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
      toast.success("Board deleted successfully!");
    }
  }

  function confirmDelete(id: string) {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2">
          <p className="font-semibold text-center">
            Are you sure you want to delete this board?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleDelete(id);
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

  useEffect(() => {
    (async function fetchData() {
      if (!session?.user.id) return;

      setIsLoading(true);
      const { data: boardsData, error: boardsError } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", session.user.id);

      if (boardsError) {
        setIsLoading(false);
        return toast.error(boardsError.message);
      }
      setBoards(boardsData as BoardType[]);
      setIsLoading(false);
    })();
  }, [session?.user.id]);

  return (
    <Protected>
      <Navbar />
      {isLoading ? (
        <Loading size={30} className="mt-40" />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mt-40">
            <h1 className="font-bold text-2xl text-white drop-shadow-[2px_2px_4px_#a1a1aa]">
              Choose your Board..
            </h1>
            <div className="flex gap-2 w-full flex-wrap">
              {boards.map((board) => {
                if (editingBoardId === board.id) {
                  return (
                    <form
                      key={board.id}
                      onSubmit={(e) => handleUpdate(e, board.id)}
                      className="bg-zinc-800 p-4 w-fit h-fit rounded-lg flex shadow-2xl gap-2 text-white font-medium justify-center items-center"
                    >
                      <input
                        type="text"
                        value={editingBoardName}
                        onChange={(e) => setEditingBoardName(e.target.value)}
                        className="bg-transparent outline-none border-b-2 border-blue-500"
                        autoFocus
                      />
                      <button
                        disabled={isUpdateDisabled || isSubmitting}
                        type="submit"
                        className={`${
                          isUpdateDisabled && "opacity-50"
                        } hover:text-green-400`}
                      >
                        {isSubmitting ? (
                          <Loading size={18} />
                        ) : (
                          <Save size={18} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBoardId(null)}
                        className="hover:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    </form>
                  );
                }
                return (
                  <div
                    key={board.id}
                    className="bg-black p-4 w-fit h-fit rounded-lg flex shadow-2xl gap-2 text-white font-medium justify-center items-center hover:bg-zinc-800 duration-300 cursor-pointer"
                    onClick={() => {
                      router.push(`board/${String(board.id)}`);
                    }}
                  >
                    {board.title}
                    <div className="flex gap-1">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBoardId(board.id);
                          setEditingBoardName(board.title);
                        }}
                        className="cursor-pointer hover:bg-zinc-700 p-1 rounded-lg duration-300"
                      >
                        <Edit color="white" size={16} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(board.id);
                        }}
                        className="cursor-pointer hover:bg-zinc-700 p-1 rounded-lg duration-300"
                      >
                        <Trash2 color="white" size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {hide ? (
                <div
                  onClick={() => setHide(false)}
                  className="bg-white p-4 w-fit h-fit rounded-lg flex shadow-2xl gap-2 justify-center items-center hover:bg-zinc-300 duration-300 cursor-pointer"
                >
                  <Plus size={20} />
                  <h1 className="text-md font-medium">Add Board</h1>
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
                      value={boardName}
                      placeholder="Enter Board name.."
                      onChange={(e) => setBoardName(e.target.value)}
                    />
                    <div className="flex gap-2 items-center">
                      <button
                        disabled={disabled || isSubmitting}
                        type="submit"
                        className={`${
                          (disabled || isSubmitting) && "opacity-50"
                        } bg-blue-400 cursor-pointer text-black font-medium py-2 px-4 text-sm rounded-xl`}
                      >
                        {isSubmitting ? "Adding.." : "Add Board"}
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
          </div>
        </div>
      )}
    </Protected>
  );
}

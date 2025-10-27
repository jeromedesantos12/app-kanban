"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [hide, setHide] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const { data: session } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (!boardName) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [boardName]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      return toast.error(error.message);
    }
    setBoards([...boards, data[0] as BoardType]);
    setBoardName("");
    setHide(true);
  }

  useEffect(() => {
    (async function fetchData() {
      setIsLoading(true);
      const { data: boardsData, error: boardsError } = await supabase
        .from("boards")
        .select("*");
      if (boardsError) {
        return toast.error(boardsError.message);
      }
      setBoards(boardsData as BoardType[]);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Protected>
      <Navbar />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex gap-4 justify-center items-center mt-20 px-10">
          <div className="flex flex-col gap-4 w-full max-w-6xl">
            <h1 className="font-bold text-2xl text-white drop-shadow-[2px_2px_4px_#a1a1aa]">
              Choose your Board..
            </h1>
            <div className="flex gap-2 w-full flex-wrap">
              {boards.map((board) => {
                return (
                  <div
                    key={board.id}
                    className="bg-black p-4 w-fit h-fit rounded-lg flex shadow-2xl gap-2 text-white font-medium justify-center items-center hover:bg-zinc-800 duration-300 cursor-pointer"
                    onClick={() => {
                      router.push(`board/${board.id}`);
                    }}
                  >
                    {board.title}
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
          </div>
        </div>
      )}
    </Protected>
  );
}

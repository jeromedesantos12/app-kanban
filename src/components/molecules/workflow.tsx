import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListPlus,
  MessageCircleQuestionMark,
  TrendingUp,
} from "lucide-react";

export function Workflow() {
  return (
    <section id="workflow" className="py-20 gap-10 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl text-white font-bold flex gap-2 items-center text-center leading-tight tracking-tight"
      >
        <MessageCircleQuestionMark className="text-white" />
        Bagaimana Cara Kerjanya?
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl px-5 mt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col border-2 border-white items-center text-center gap-3 p-6 rounded-lg"
        >
          <LayoutDashboard size={52} className="text-white" />
          <h3 className="text-xl font-bold mt-2 text-white">
            1. Buat Board Proyek
          </h3>
          <p className="text-white">
            Mulai dengan membuat papan untuk setiap proyek atau inisiatif baru.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col border-2 border-white text-white items-center text-center gap-3 p-6 rounded-lg"
        >
          <ListPlus size={52} className="text-white" />
          <h3 className="text-xl font-bold mt-2">
            2. Tambah Tugas & Atur Kolom
          </h3>
          <p className="text-white">
            Isi papan dengan tugas, lalu kelompokkan dalam kolom sesuai status.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col border-2 border-white text-white items-center text-center gap-3 p-6 rounded-lg"
        >
          <TrendingUp size={52} className="text-white" />
          <h3 className="text-xl text-white font-bold mt-2">
            3. Pantau Progress Bersama Tim
          </h3>
          <p className="text-white">
            Pindahkan kartu dengan mudah dan lihat kemajuan proyek secara
            real-time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import {
  BarChart,
  Bell,
  MousePointerClick,
  Users,
  Waypoints,
} from "lucide-react";

export function Feature() {
  return (
    <section
      id="feature"
      className="bg-white py-20 gap-10 flex flex-col items-center scroll-mt-15 sm:scroll-mt-50 mx-auto"
    >
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold flex gap-3 items-center text-center leading-tight tracking-tight"
      >
        <Waypoints className="text-pink-500" />
        Fitur Utama
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mt-5 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center text-center gap-2"
        >
          <MousePointerClick size={48} className="text-pink-500" />
          <h2 className="text-xl font-bold">Drag & Drop Cepat</h2>
          <p className="text-zinc-600">
            Pindahkan tugas hanya dengan satu gerakan.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center text-center gap-2"
        >
          <Users size={48} className="text-pink-500" />
          <h2 className="text-xl font-bold">Kolaborasi Tim</h2>
          <p className="text-zinc-600">
            Lihat siapa mengerjakan apa secara real time.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center text-center gap-2"
        >
          <Bell size={48} className="text-pink-500" />
          <h2 className="text-xl font-bold">Notifikasi Pintar</h2>
          <p className="text-zinc-600">Jangan lewatkan deadline penting.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col items-center text-center gap-2"
        >
          <BarChart size={48} className="text-pink-500" />
          <h2 className="text-xl font-bold">Statistik & Laporan</h2>
          <p className="text-zinc-600">Lacak performa proyek dengan mudah.</p>
        </motion.div>
      </div>
    </section>
  );
}

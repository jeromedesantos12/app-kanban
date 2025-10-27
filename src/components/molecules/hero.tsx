import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col md:flex-row gap-8 flex-wrap justify-center py-40 px-5"
    >
      <div className="max-w-3xl flex flex-col items-center gap-6">
        <motion.h1
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl text-white font-extrabold text-center leading-tight tracking-tight duration-300"
        >
          Atur Proyekmu Lebih Mudah dengan Kanban Modern.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-white max-w-lg duration-300"
        >
          Visualisasi tugas, pantau progres tim, dan selesaikan lebih cepat.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, translateY: "100%" }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex gap-4"
        >
          <Link href="https://t.me/ngorderin_bot" target="_blank">
            <button className="bg-transparant border-2 border-white hover:bg-white duration-300 cursor-pointer text-white hover:text-black font-medium py-2 px-3 text-sm rounded-lg flex justify-center not-only-of-type:items-center gap-2">
              Coba Gratis
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

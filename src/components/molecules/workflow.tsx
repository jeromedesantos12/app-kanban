import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListPlus,
  MessageCircleQuestionMark,
  TrendingUp,
} from "lucide-react";

export function Workflow() {
  return (
    <section
      id="workflow"
      className="min-h-screen gap-10 flex flex-col justify-center items-center mx-auto"
    >
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl text-white font-bold flex gap-2 items-center text-center leading-tight tracking-tight"
      >
        <MessageCircleQuestionMark className="text-white" />
        How It Works?
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl px-4 sm:px-6 lg:px-8 mt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col bg-gray-900/30 border border-gray-700/50 items-center text-center gap-3 p-6 rounded-lg"
        >
          <LayoutDashboard size={52} className="text-white" />
          <h3 className="text-xl font-bold mt-2 text-white">
            1. Create Project Board
          </h3>
          <p className="text-gray-300">
            Start by creating a board for each new project or initiative.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex flex-col bg-gray-900/30 border border-gray-700/50 text-white items-center text-center gap-3 p-6 rounded-lg"
        >
          <ListPlus size={52} className="text-white" />
          <h3 className="text-xl font-bold mt-2">
            2. Add Tasks & Set Columns
          </h3>
          <p className="text-gray-300">
            Fill the board with tasks, then group them into columns according
            to status.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col bg-gray-900/30 border border-gray-700/50 text-white items-center text-center gap-3 p-6 rounded-lg"
        >
          <TrendingUp size={52} className="text-white" />
          <h3 className="text-xl text-white font-bold mt-2">
            3. Track Progress with Your Team
          </h3>
          <p className="text-gray-300">
            Easily move cards and see project progress in real-time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

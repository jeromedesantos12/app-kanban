import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full flex flex-col items-center justify-center min-h-screen gap-12 px-4 sm:px-6 lg:px-8 text-center scroll-mt-20"
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
        <div className="max-w-4xl flex flex-col items-center lg:items-start gap-6 lg:w-1/2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5"
          >
            <LayoutGrid className="w-5 h-5 text-white" />
            <span className="text-sm text-gray-300">
              More Organized Project Management
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl text-white font-extrabold leading-tight tracking-tighter"
          >
            Transform Team Productivity with Smart Kanban
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-white max-w-2xl"
          >
            Visualize workflows, automate tasks, and achieve your project goals
            faster than ever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
          >
            <Link href="/register">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 duration-300 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/#feature">
              <button className="w-full sm:w-auto bg-transparent border-2 border-gray-600 hover:bg-gray-800 duration-300 text-white font-medium py-3 px-6 rounded-lg text-lg">
                Learn Features
              </button>
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="hidden sm:block relative rounded-xl bg-gray-900/50 border border-gray-700/50 shadow-2xl p-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-semibold text-white">
                Website Redesign Project
              </h3>
              <div className="flex -space-x-2">
                <Image
                  width={32}
                  height={32}
                  className="inline-block rounded-full ring-2 ring-gray-800"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="User 1"
                />
                <Image
                  width={32}
                  height={32}
                  className="inline-block rounded-full ring-2 ring-gray-800"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704e"
                  alt="User 2"
                />
                <Image
                  width={32}
                  height={32}
                  className="inline-block rounded-full ring-2 ring-gray-800"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704f"
                  alt="User 3"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/60 rounded-lg p-3">
                <h4 className="font-semibold text-white mb-3">To Do</h4>
                <div className="space-y-3">
                  <div className="bg-gray-700/80 p-3 rounded-md shadow">
                    <p className="text-sm text-gray-200">Design main page</p>
                  </div>
                  <div className="bg-gray-700/80 p-3 rounded-md shadow">
                    <p className="text-sm text-gray-200">
                      Create wireframe for mobile
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3">
                <h4 className="font-semibold text-white mb-3">In Progress</h4>
                <div className="space-y-3">
                  <div className="bg-gray-700/80 p-3 rounded-md shadow">
                    <p className="text-sm text-gray-200">
                      Develop UI components
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        Due: 3 days left
                      </span>
                      <Image
                        width={32}
                        height={32}
                        className="h-6 w-6 rounded-full"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        alt="User 1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3">
                <h4 className="font-semibold text-white mb-3">Done</h4>
                <div className="space-y-3">
                  <div className="bg-gray-700/80 p-3 rounded-md shadow opacity-70">
                    <p className="text-sm text-gray-200 line-through">
                      Competitor research
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

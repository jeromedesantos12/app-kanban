import { AlignEndVertical, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 pt-10 pb-5">
      <div className="mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        {/* Left Side: Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3 cursor-pointer">
            <AlignEndVertical className="text-white" />
            <h1 className="font-bold text-2xl text-white">Todo</h1>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>

        {/* Right Side: Social Media Links */}
        <div className="flex items-center gap-6">
          <Link
            href="#"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Twitter size={24} />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Github size={24} />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Linkedin size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

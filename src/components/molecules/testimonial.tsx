import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import Image from "next/image";

export function Testimonial() {
  const testimonials = [
    {
      name: "Jerman Müller",
      title: "Manajer Proyek",
      quote:
        "Dengan Kanban ini, tim kami menyelesaikan proyek 30% lebih cepat!",
      avatar: "/avatars/avatar-1.jpg", // Placeholder, Anda bisa ganti dengan gambar asli
    },
    {
      name: "Sarah Chen",
      title: "Lead Developer",
      quote:
        "Antarmuka yang intuitif membuat kolaborasi tim menjadi sangat mudah dan efisien.",
      avatar: "/avatars/avatar-2.jpg", // Placeholder
    },
    {
      name: "Budi Santoso",
      title: "Product Owner",
      quote:
        "Notifikasi pintar membantu kami tidak pernah melewatkan deadline penting lagi.",
      avatar: "/avatars/avatar-3.jpg", // Placeholder
    },
  ];

  return (
    <section
      id="testimonials"
      className="bg-zinc-800 py-20 gap-10 flex flex-col items-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl text-white font-bold flex gap-2 items-center text-center leading-tight tracking-tight"
      >
        <MessageSquareQuote className="text-pink-500" />
        Apa Kata Mereka?
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl px-5 mt-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col items-center text-center gap-4 p-6 bg-white rounded-lg shadow-lg"
          >
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-pink-500"
            />
            <h3 className="text-xl font-bold">{testimonial.name}</h3>
            <p className="text-pink-500 text-sm">{testimonial.title}</p>
            <p className="text-zinc-700 italic">{`"${testimonial.quote}"`}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

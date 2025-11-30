"use client";

import { useNotes } from "@/context/NotesContext";
import { motion } from "framer-motion";
import { Brain, Clock, Edit3, SortAsc } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { stats } = useNotes();

  const cards = [
    {
      title: "Chronology Challenge",
      description: "Drag and drop works into the correct order.",
      icon: SortAsc,
      href: "/quiz/order",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Date Master",
      description: "Test your memory of publication years.",
      icon: Brain,
      href: "/quiz/dates",
      color: "bg-stone-200 text-stone-700",
    },
    {
      title: "Visual Timeline",
      description: "Explore literary history on a timeline.",
      icon: Clock,
      href: "/timeline",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Edit Notes",
      description: "Add or modify your literary works.",
      icon: Edit3,
      href: "/edit",
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-serif font-bold text-stone-800 mb-4"
        >
          LitChrono
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 text-lg"
        >
          Master the chronology of English Literature
        </motion.p>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 mb-12 max-w-md mx-auto"
      >
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 text-center">
          <div className="text-3xl font-bold text-amber-600">{stats.authorCount}</div>
          <div className="text-sm text-stone-500 uppercase tracking-wide">Authors</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 text-center">
          <div className="text-3xl font-bold text-amber-600">{stats.workCount}</div>
          <div className="text-sm text-stone-500 uppercase tracking-wide">Works</div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <Link key={card.href} href={card.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer h-full flex items-start gap-4"
            >
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-800 mb-1 font-serif">
                  {card.title}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}

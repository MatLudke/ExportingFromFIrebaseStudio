"use client"

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { ActivityList } from "@/components/dashboard/activity-list";
import { StudyTimer } from "@/components/dashboard/study-timer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-auto p-6 md:p-8 pt-32">
        <motion.div 
          className="grid gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <ActivityList />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StudyTimer />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

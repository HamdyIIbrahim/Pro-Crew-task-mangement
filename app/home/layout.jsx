"use client";
import Navbar from "@/components/Navbar/Navbar";
import { motion as m } from "framer-motion";
export default function ListingLayout({ children }) {
  return (
    <m.div
      className="body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      <Navbar />
      <div className="tableParent flex flex-row gap-1">{children}</div>
    </m.div>
  );
}

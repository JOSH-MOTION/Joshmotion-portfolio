"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

export default function MaskReveal({
  children,
  delay = 0,
  trigger = "view",
  className,
}: {
  children: ReactNode;
  delay?: number;
  trigger?: "view" | "load";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const shown = trigger === "load" || inView;

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: shown ? "0%" : "110%" }}
        transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { photoUrlById } from "@/lib/photos";

export default function Cinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.22]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0.15, 0.55], ["24px", "0px"]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative h-[85vh] overflow-hidden border-y border-line"
    >
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          src={photoUrlById(1041, 1920, 1300)}
          alt=""
          fill
          sizes="100vw"
          className={reduced ? "object-cover" : "object-cover animate-[breathe_16s_ease-in-out_infinite]"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/60" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <p className="mb-4 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
          On stillness
        </p>
        <p className="max-w-2xl font-display text-3xl font-semibold leading-[1.15] md:text-5xl">
          &ldquo;A photograph is the pause between one breath and the
          next.&rdquo;
        </p>
      </motion.div>
    </section>
  );
}

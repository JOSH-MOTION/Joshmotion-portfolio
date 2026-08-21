"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useCallback, useState } from "react";
import type { GalleryPhoto } from "@/lib/data";

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, scale: 0.97, x: dir * 40 }),
  center: { opacity: 1, scale: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, scale: 0.97, x: dir * -40 }),
};

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const photo = photos[index];
  const [direction, setDirection] = useState<1 | -1>(1);

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      onNavigate((index + dir + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, go]);

  if (!photo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col bg-bg/97 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} — image viewer`}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <p className="font-sans text-[13px] uppercase tracking-[0.15em] text-muted">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </p>
        <button
          onClick={onClose}
          data-cursor="Close"
          aria-label="Close viewer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-transform duration-[160ms] ease-out hover:border-accent active:scale-[0.9]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Previous image"
        data-cursor="Prev"
        className="absolute inset-y-0 left-0 hidden w-1/6 items-center justify-start pl-6 md:flex"
      />
      <button
        onClick={() => go(1)}
        aria-label="Next image"
        data-cursor="Next"
        className="absolute inset-y-0 right-0 hidden w-1/6 items-center justify-end pr-6 md:flex"
      />

      <div className="relative flex-1 overflow-hidden px-6 pb-4 md:px-16">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={photo.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="relative mx-auto h-full max-w-5xl"
          >
            <Image
              src={photo.src}
              alt={`${photo.title}, ${photo.location}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 py-6 md:px-10">
        <div>
          <p className="font-display text-xl font-bold uppercase">{photo.title}</p>
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            {photo.location} — {photo.year}
          </p>
        </div>
        <div className="hidden gap-3 md:flex">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-transform duration-[160ms] ease-out hover:border-accent active:scale-[0.9]"
          >
            ←
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-transform duration-[160ms] ease-out hover:border-accent active:scale-[0.9]"
          >
            →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import type { GalleryPhoto } from "@/lib/data";

export default function GalleryCard({
  photo,
  index,
  onClick,
  className,
}: {
  photo: GalleryPhoto;
  index: number;
  onClick: () => void;
  className: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 200, damping: 18, mass: 0.4 };
  const rotateX = useSpring(rawY, spring);
  const rotateY = useSpring(rawX, spring);

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * 10);
    rawY.set(-py * 8);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.23, 1, 0.32, 1],
      }}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="View"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative overflow-hidden bg-bg-raised text-left ${className}`}
    >
      <Image
        src={photo.src}
        alt={`${photo.title}, ${photo.location}`}
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-display text-lg font-bold uppercase">{photo.title}</p>
        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          {photo.location} — {photo.year}
        </p>
      </div>
    </motion.button>
  );
}

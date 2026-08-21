"use client";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { GalleryPhoto } from "@/lib/data";
import GalleryCard from "@/components/GalleryCard";
import Lightbox from "@/components/Lightbox";
import MaskReveal from "@/components/MaskReveal";

export default function WorkTeaser({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
        <div>
          <MaskReveal>
            <p className="mb-3 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
              01 — Selected work
            </p>
          </MaskReveal>
          <MaskReveal delay={0.08}>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] md:text-6xl">
              A working
              <span className="block font-light normal-case text-muted">archive.</span>
            </h2>
          </MaskReveal>
        </div>

        <MaskReveal delay={0.14}>
          <Link
            href="/work"
            data-cursor="View all"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-sans text-[13px] uppercase tracking-[0.1em] transition-colors duration-200 ease-out hover:border-accent hover:text-accent active:scale-[0.97]"
          >
            View full archive
            <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </MaskReveal>
      </div>

      <div className="grid auto-rows-[240px] grid-cols-2 gap-3 md:auto-rows-[280px] md:grid-cols-3 md:gap-4">
        {photos.map((photo, i) => (
          <GalleryCard
            key={photo.id}
            photo={photo}
            index={i}
            onClick={() => setOpenIndex(i)}
            className="col-span-2 md:col-span-1"
          />
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            photos={photos}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onNavigate={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

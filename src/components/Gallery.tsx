"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { CategoryOption, GalleryPhoto } from "@/lib/data";
import { groupPhotosForDisplay } from "@/lib/groupPhotos";
import Lightbox from "@/components/Lightbox";
import GalleryCard from "@/components/GalleryCard";
import MaskReveal from "@/components/MaskReveal";

export default function Gallery({
  photos,
  categories,
}: {
  photos: GalleryPhoto[];
  categories: CategoryOption[];
}) {
  const tabs = useMemo(
    () => [{ key: "all", label: "All work" }, ...categories],
    [categories]
  );
  const [active, setActive] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? photos : photos.filter((p) => p.category === active)),
    [active, photos]
  );

  const cells = useMemo(() => groupPhotosForDisplay(filtered), [filtered]);

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

        <div className="flex flex-wrap gap-2">
          {tabs.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`relative rounded-full px-4 py-2 font-sans text-[13px] uppercase tracking-[0.1em] transition-colors duration-200 ease-out active:scale-[0.97] ${
                active === c.key ? "text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {active === c.key && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                  className="absolute inset-0 rounded-full bg-fg"
                />
              )}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          No photos in this category yet.
        </p>
      ) : (
        <div className="grid auto-rows-[240px] grid-cols-2 gap-3 md:auto-rows-[280px] md:grid-cols-4 md:gap-4">
          <AnimatePresence mode="popLayout">
            {cells.map((cell) => {
              const cover = cell.kind === "group" ? cell.photos[0] : cell.photo;
              return (
                <GalleryCard
                  key={cell.kind === "group" ? cell.project : cover.id}
                  photo={cover}
                  index={cell.index}
                  onClick={() => setOpenIndex(cell.index)}
                  groupCount={cell.kind === "group" ? cell.photos.length : undefined}
                  className={`col-span-2 md:col-span-1 ${cover.span}`}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            photos={filtered}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onNavigate={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import MaskReveal from "@/components/MaskReveal";

const HeroCamera = dynamic(() => import("@/components/HeroCamera"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-[100svh] overflow-hidden bg-bg"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 78% 45%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-2 px-6 pt-24 pb-16 md:grid-cols-2 md:gap-10 md:px-10 md:pt-24 md:pb-20">
        <div className="order-2 md:order-1">
          <MaskReveal trigger="load" delay={0.1}>
            <p className="mb-4 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
              Photography — Est. 2019 — Accra / West Africa
            </p>
          </MaskReveal>

          <h1 className="font-display text-[15vw] font-extrabold uppercase leading-[0.86] tracking-tight md:text-[6.5rem]">
            <MaskReveal trigger="load" delay={0.22}>
              Joshua
            </MaskReveal>
            <MaskReveal trigger="load" delay={0.32}>
              <span className="block font-light text-muted">Doe</span>
            </MaskReveal>
          </h1>

          <MaskReveal trigger="load" delay={0.5} className="mt-6">
            <p className="max-w-md font-sans text-[15px] leading-relaxed text-muted">
              I make quiet, unhurried photographs of people and the light
              around them — portraits, street, editorial and film.
            </p>
          </MaskReveal>

          <MaskReveal trigger="load" delay={0.6} className="mt-5">
            <div className="flex items-center gap-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Founder &amp; CEO,{" "}
              <a
                href="https://brainworksstudioafrica.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                Brain Works Studio Africa
              </a>
            </div>
          </MaskReveal>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="order-1 h-[38vh] w-full md:order-2 md:h-full"
        >
          <HeroCamera />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 md:right-10 md:flex"
      >
        <motion.span
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px origin-top bg-line"
        />
        <span className="rotate-90 font-sans text-[11px] uppercase tracking-[0.2em] text-muted">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

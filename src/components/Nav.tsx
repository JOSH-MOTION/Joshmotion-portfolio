"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/work", label: "Work" },
  { href: "/rates", label: "Rates" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const anchors = links.filter((l) => l.href.startsWith("/#"));
    const sections = anchors
      .map((l) => document.querySelector(l.href.slice(1)))
      .filter((el): el is Element => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveAnchor(`/#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#")
      ? pathname === "/" && activeAnchor === href
      : pathname === href;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? "bg-bg/80 backdrop-blur-md border-b border-line" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link
              href="/"
              data-cursor="Home"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-tight"
            >
              <Image
                src="/logo-icon.png"
                alt=""
                width={40}
                height={38}
                className="h-7 w-auto md:h-8"
                priority
              />
              Joshmotion
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.06 + i * 0.05,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <Link
                  href={l.href}
                  className={`group relative font-sans text-[13px] uppercase tracking-[0.15em] transition-colors ${
                    isActive(l.href) ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-accent transition-[width] duration-300 ease-out ${
                      isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.a
              href="mailto:hello@joshmotion.com"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-full border border-line px-4 py-2 font-sans text-[13px] uppercase tracking-[0.1em] transition-colors duration-200 ease-out hover:border-accent hover:text-accent active:scale-[0.97]"
            >
              Available for work
            </motion.a>
          </nav>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[6px] md:hidden"
          >
            <span
              className={`h-px w-6 bg-fg transition-transform duration-300 ease-out ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-fg transition-transform duration-300 ease-out ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-30 flex flex-col justify-center bg-bg px-8 pt-20 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl font-extrabold uppercase"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

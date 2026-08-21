import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 font-sans text-[11px] uppercase tracking-[0.15em] text-muted md:flex-row md:items-center">
        <p className="flex items-center gap-2">
          <Image
            src="/logo-icon-white.png"
            alt=""
            width={20}
            height={19}
            className="h-4 w-auto opacity-60"
          />
          © {new Date().getFullYear()} Joshmotion. All rights reserved.
        </p>
        <p>Accra, Ghana — GMT+0</p>
      </div>
    </footer>
  );
}

const ITEMS = [
  "Portraits",
  "Weddings",
  "Corporate",
  "Editorial",
  "Film",
  "Available for commissions",
];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-line py-5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...track, ...track].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl font-semibold uppercase text-muted md:text-3xl"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

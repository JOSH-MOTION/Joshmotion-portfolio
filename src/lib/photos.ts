export type Category =
  | "portrait"
  | "street"
  | "editorial"
  | "film"
  | "baby-family"
  | "wedding";

export type Photo = {
  id: string;
  seed: string;
  width: number;
  height: number;
  category: Category;
  title: string;
  location: string;
  year: string;
  /** Tailwind grid placement for the editorial grid */
  span: string;
};

const picsum = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const photoUrl = (p: Pick<Photo, "seed" | "width" | "height">) =>
  picsum(p.seed, p.width, p.height);

/** Curated (non-random) Picsum photo, keyed by its fixed id so the
 * content is predictable — used where a specific subject is needed. */
export const photoUrlById = (id: number, w: number, h: number) =>
  `https://picsum.photos/id/${id}/${w}/${h}`;

export const photos: Photo[] = [
  {
    id: "01",
    seed: "joshmotion-01",
    width: 1400,
    height: 1750,
    category: "portrait",
    title: "Half Light",
    location: "Accra, GH",
    year: "2025",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "02",
    seed: "joshmotion-02",
    width: 1600,
    height: 1067,
    category: "street",
    title: "Ring Road",
    location: "Accra, GH",
    year: "2025",
    span: "md:col-span-2",
  },
  {
    id: "03",
    seed: "joshmotion-03",
    width: 1200,
    height: 1500,
    category: "editorial",
    title: "Studio, No. 3",
    location: "Accra, GH",
    year: "2024",
    span: "",
  },
  {
    id: "04",
    seed: "joshmotion-04",
    width: 1200,
    height: 1500,
    category: "film",
    title: "Grain & Dust",
    location: "Kumasi, GH",
    year: "2024",
    span: "",
  },
  {
    id: "05",
    seed: "joshmotion-05",
    width: 1600,
    height: 2000,
    category: "portrait",
    title: "Quiet Hour",
    location: "Aburi, GH",
    year: "2025",
    span: "md:row-span-2",
  },
  {
    id: "06",
    seed: "joshmotion-06",
    width: 1600,
    height: 1067,
    category: "street",
    title: "Market Light",
    location: "Accra, GH",
    year: "2023",
    span: "md:col-span-2",
  },
  {
    id: "07",
    seed: "joshmotion-07",
    width: 1200,
    height: 1500,
    category: "editorial",
    title: "Cream & Iron",
    location: "Accra, GH",
    year: "2024",
    span: "",
  },
  {
    id: "08",
    seed: "joshmotion-08",
    width: 1400,
    height: 1750,
    category: "film",
    title: "35mm, Overcast",
    location: "Cape Coast, GH",
    year: "2023",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "09",
    seed: "joshmotion-09",
    width: 1200,
    height: 1500,
    category: "portrait",
    title: "Window Seat",
    location: "Lagos, NG",
    year: "2025",
    span: "",
  },
  {
    id: "10",
    seed: "joshmotion-10",
    width: 1600,
    height: 1067,
    category: "street",
    title: "Rain, Briefly",
    location: "Accra, GH",
    year: "2024",
    span: "md:col-span-2",
  },
  {
    id: "11",
    seed: "joshmotion-11",
    width: 1200,
    height: 1500,
    category: "editorial",
    title: "Set Piece",
    location: "Accra, GH",
    year: "2025",
    span: "",
  },
  {
    id: "12",
    seed: "joshmotion-12",
    width: 1600,
    height: 2000,
    category: "film",
    title: "Last Light",
    location: "Elmina, GH",
    year: "2023",
    span: "md:row-span-2",
  },
  {
    id: "13",
    seed: "joshmotion-13",
    width: 1200,
    height: 1500,
    category: "baby-family",
    title: "First Weeks",
    location: "Accra, GH",
    year: "2025",
    span: "",
  },
  {
    id: "14",
    seed: "joshmotion-14",
    width: 1600,
    height: 1067,
    category: "wedding",
    title: "The Recessional",
    location: "Accra, GH",
    year: "2025",
    span: "md:col-span-2",
  },
];

export const categories: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "portrait", label: "Portrait" },
  { key: "street", label: "Street" },
  { key: "editorial", label: "Editorial" },
  { key: "film", label: "Film" },
  { key: "baby-family", label: "Baby & Family" },
  { key: "wedding", label: "Weddings" },
];

export type RateCard = {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  priceNote: string;
  seed: string;
  width: number;
  height: number;
};

export const rateCards: RateCard[] = [
  {
    id: "portrait",
    title: "Portrait Session",
    description:
      "A relaxed, single-location portrait session — for headshots, personal branding, or just because. Includes wardrobe guidance and a same-week private gallery.",
    priceAmount: 800,
    priceCurrency: "GHS",
    priceNote: "starting at · 1hr · 15+ edited images",
    seed: "rate-portrait",
    width: 1600,
    height: 2000,
  },
  {
    id: "baby-family",
    title: "Baby & Family",
    description:
      "Newborn, milestone, or full-family sessions shot at home or in studio — unhurried, low-pressure, built around nap schedules and short attention spans.",
    priceAmount: 1200,
    priceCurrency: "GHS",
    priceNote: "starting at · 1.5hr · 20+ edited images",
    seed: "rate-baby",
    width: 1600,
    height: 2000,
  },
  {
    id: "wedding",
    title: "Wedding Photography",
    description:
      "Full-day coverage from preparations through reception — both principal events, a second shooter available on request, and a private online gallery for guests.",
    priceAmount: 4500,
    priceCurrency: "GHS",
    priceNote: "starting at · full day · online gallery",
    seed: "rate-wedding",
    width: 1600,
    height: 1067,
  },
  {
    id: "product",
    title: "Product Photography",
    description:
      "Clean e-commerce and lifestyle product shots for online stores and catalogues — white background and styled sets, fast turnaround for growing brands.",
    priceAmount: 600,
    priceCurrency: "GHS",
    priceNote: "starting at · up to 10 products",
    seed: "rate-product",
    width: 1600,
    height: 1600,
  },
  {
    id: "corporate",
    title: "Corporate & Headshots",
    description:
      "On-site team headshots, leadership portraits, and brand/office photography for companies that want their people looking like themselves, just sharper.",
    priceAmount: 1500,
    priceCurrency: "GHS",
    priceNote: "starting at · half day · on-site",
    seed: "rate-corporate",
    width: 1600,
    height: 2000,
  },
];

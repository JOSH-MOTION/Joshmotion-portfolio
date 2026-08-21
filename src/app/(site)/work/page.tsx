import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getCategories, getPhotos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work — Joshmotion",
  description: "The full photography archive — portraits, street, editorial, film, weddings and more.",
};

export const revalidate = 60;

export default async function WorkPage() {
  const [photos, categories] = await Promise.all([getPhotos(), getCategories()]);

  return <Gallery photos={photos} categories={categories} />;
}

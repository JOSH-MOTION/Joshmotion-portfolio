import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WorkTeaser from "@/components/WorkTeaser";
import Cinematic from "@/components/Cinematic";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { getRandomPhotoSample } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const photos = await getRandomPhotoSample();

  return (
    <>
      <Hero />
      <Marquee />
      <WorkTeaser photos={photos} />
      <Cinematic />
      <About />
      <Contact />
    </>
  );
}

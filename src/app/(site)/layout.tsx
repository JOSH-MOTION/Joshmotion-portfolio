import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Grain from "@/components/Grain";
import ScrollProgress from "@/components/ScrollProgress";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Grain />
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}

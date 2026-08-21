import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joshmotion.vercel.app";
const title = "Joshmotion — Portrait, Wedding & Corporate Photographer in Accra, Ghana";
const description =
  "Joshua Doe is a portrait, wedding, editorial and corporate photographer based in Accra, Ghana — also shooting baby & family sessions, product photography, and film. Founder of Brain Works Studio Africa.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "photographer Accra",
    "Ghana photographer",
    "wedding photographer Ghana",
    "corporate photographer Accra",
    "portrait photographer Accra",
    "product photography Ghana",
    "editorial photographer Ghana",
    "Joshua Doe photography",
    "Joshmotion",
  ],
  authors: [{ name: "Joshua Doe" }],
  creator: "Joshua Doe",
  alternates: { canonical: siteUrl },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Joshmotion",
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: "Joshmotion Photography",
      image: `${siteUrl}/opengraph-image.png`,
      url: siteUrl,
      telephone: "+233242403450",
      priceRange: "GHS",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Accra",
        addressCountry: "GH",
      },
      areaServed: "Accra, Ghana",
      founder: { "@type": "Person", name: "Joshua Doe" },
      sameAs: [
        "https://www.instagram.com/josh_motionz/",
        "https://wa.me/message/YZ5UIBD2HAFOF1",
        "https://brainworksstudioafrica.com/",
      ],
      makesOffer: [
        "Portrait Photography",
        "Wedding Photography",
        "Editorial Photography",
        "Corporate Photography",
        "Product Photography",
        "Baby & Family Photography",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${plexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <script
          type="application/ld+json"
          // Static, server-controlled data only — safe to inject as-is.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}

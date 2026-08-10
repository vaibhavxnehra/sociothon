import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { AboutRGIPT } from "@/components/site/AboutRGIPT";
import { AboutSouhardya } from "@/components/site/AboutSouhardya";
import { Events } from "@/components/site/Events";
import { Timeline } from "@/components/site/Timeline";
import { Registration } from "@/components/site/Registration";
import { Rewards } from "@/components/site/Rewards";
import { Sponsors } from "@/components/site/Sponsors";
import { Team } from "@/components/site/Team";
import { Footer } from "@/components/site/Footer";

const TITLE = "SOCI-O-THON & NIRMAAN 2026 | RGIPT Souhardya";
const DESCRIPTION =
  "SOUHARDYA 2026 presents SOCI-O-THON & NIRMAAN — a national social innovation hackathon and conference at RGIPT, Jais, Amethi on 30–31 October 2026. ₹30,000 prize pool. Register now.";

// Replace with the official registration form link.
const REGISTER_URL = "https://forms.gle/your-registration-form";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "SOCI-O-THON & NIRMAAN — Souhardya 2026",
          startDate: "2026-10-30",
          endDate: "2026-10-31",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: "Rajiv Gandhi Institute of Petroleum Technology",
            address: "Jais, Amethi, Uttar Pradesh, India",
          },
          organizer: { "@type": "Organization", name: "RGIPT" },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar registerUrl={REGISTER_URL} />
      <main>
        <Hero registerUrl={REGISTER_URL} />
        <AboutRGIPT />
        <AboutSouhardya />
        <Events />
        <Timeline />
        <Registration registerUrl={REGISTER_URL} />
        <Rewards />
        <Sponsors />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

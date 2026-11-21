import Layout from "@/app/components/Layout";
import HeroBackground from "@/app/components/HeroBackground";
import NavCardLink from "@/app/components/NavCardLink";
import AwardsWheel, { type AwardGroup } from "@/app/components/AwardsWheel";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import SweepReveal from "@/app/components/SweepReveal";
import { metadata as layoutMetadata } from "@/app/layout";
import {
  BlogPlaceholder,
  SplatContainer,
} from "@/app/components/HomePageExtras";

// From LinkedIn Honors & Awards, plus the SUAS and SmartHack results described on
// the Experience and Projects pages. Grouped by competition.
const awardGroups: AwardGroup[] = [
  {
    name: "SUAS Internationals",
    fullName: "Student Unmanned Aerial Systems (SUAS) Competition, 2026 Internationals",
    meta: "Association for Uncrewed Vehicle Systems International · with SUAS @STEM · Jun 2026",
    items: [
      { title: "2nd Place Among First-Time US Teams, 26th Overall", detail: "In a field dominated by university teams" },
    ],
  },
  {
    name: "TSA Nationals",
    fullName: "Technology Student Association (TSA) National Conference",
    meta: "Jul 2025",
    items: [
      { title: "1st Place, Webmaster", detail: "Out of ~450 national submissions; designed and built a restaurant website (Maitso)" },
      { title: "6th Place, Engineering Design", detail: "Internet of Things nitrogen management system with an Android app, mixing nutrients via the Venturi effect" },
      { title: "5th Place, Technology Bowl", detail: "Quarterfinals of the tech quiz bowl bracket" },
    ],
  },
  {
    name: "Washington TSA",
    fullName: "Washington Technology Student Association State Conference",
    meta: "Apr 2025",
    items: [
      { title: "1st Place, Software Development" },
      { title: "1st Place, Webmaster" },
      { title: "3rd Place, Engineering Design" },
      { title: "Quarterfinals, Technology Bowl" },
    ],
  },
  {
    name: "FIRST Tech Challenge",
    fullName: "FIRST Tech Challenge Robotics",
    meta: "Team 19669 Systematic Chaos · 2024–25",
    items: [
      { title: "Design Award", detail: "Washington State Championship · Feb 2025" },
      { title: "Design Award", detail: "Asimov Semifinal · Jan 2025" },
      { title: "Control Award", detail: "Tesla Interleague · Dec 2024" },
    ],
  },
  {
    name: "WTN Science Contest",
    fullName: "Washington Tracking Network (WTN) Youth Science Contest",
    meta: "Washington State Department of Health",
    items: [
      { title: "2nd Place, Group Science Communication", detail: "The Opioid Epidemic, an interactive Three.js story · May 2025" },
      { title: "2nd Place, Group Science Communication", detail: "Teen Mental Health in Washington · May 2024" },
    ],
  },
  {
    name: "More Honors",
    meta: "2024–26",
    items: [
      { title: "Selected Attendee, Y Combinator Startup School San Francisco", detail: "Jul 2026" },
      { title: "\"Outstanding Code\" Award", detail: "EmP Hackfest SmartHack, sponsored by Art of Problem Solving, for EcoCollab · 2024" },
    ],
  },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Inesh Dey",
  url: "https://ineshd.com",
  jobTitle: "Computer Science & Engineering Student",
  description: layoutMetadata.description,
  sameAs: [
    "https://github.com/ineshd",
    "https://linkedin.com/in/ineshdey",
  ],
};

export const metadata = {
  title: {
    absolute: "Inesh Dey",
  },
  description: layoutMetadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ineshd.com",
    siteName: "Inesh Dey",
    title: "Inesh Dey",
    description: layoutMetadata.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Inesh Dey",
    description: layoutMetadata.description,
  },
};

const socialLinks = [
  { href: "https://github.com/ineshd", label: "github", Icon: Github },
  { href: "https://linkedin.com/in/ineshdey", label: "linkedin", Icon: Linkedin },
  { href: "mailto:me@ineshd.com", label: "email", Icon: Mail },
];

export default function Home() {
  return (
    <Layout headerPosition="absolute">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero */}
      {/* One background grid pinned behind the hero and the cards below
          it. Everything above it is pointer-events-none except actual
          content, so clicking the background works anywhere. */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="sticky top-0 h-screen overflow-hidden">
            <HeroBackground />
          </div>
        </div>

        <section className="[view-transition-name:hero] relative h-screen flex flex-col justify-center items-center text-center px-8 lg:items-start lg:justify-end lg:text-left lg:px-20 lg:pb-24 pointer-events-none">
          <div className="relative z-10 flex flex-col items-center gap-5 lg:items-start pointer-events-none">
            <h1 className="text-6xl max-lg:text-4xl max-sm:text-3xl font-black italic pointer-events-auto">
              Inesh Dey
            </h1>
            <p className="text-2xl max-lg:text-xl text-primary pointer-events-auto">
              University of Michigan CoE '30 | Computer Science & Engineering
            </p>
            <p className="text-xl max-lg:text-base max-w-lg leading-relaxed pointer-events-auto">
              I like installing software, meeting people, and winning competitions
              :)
            </p>
            <p className="text-md tracking-wide pointer-events-auto">
              try clicking the background
            </p>
            {/* One slanted green bar, a segment per link, with the blue hover sweep. */}
            <div className="flex w-fit mt-4 pointer-events-auto">
              {socialLinks.map(({ href, label, Icon }, i) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  className="group relative flex items-center gap-2.5 px-6 py-3 max-sm:px-4 text-background text-lg max-sm:text-base font-[family-name:var(--font-roboto-mono)] active:brightness-90 transition-[filter] duration-200"
                >
                  <span aria-hidden="true" className={`absolute inset-0 -skew-x-12 bg-primary ${i > 0 ? "border-l-2 border-background/25" : ""}`} />
                  <Icon size={22} aria-hidden="true" className="relative" />
                  <span className="relative">{label}</span>
                  <SweepReveal skewed slant="11px" className="flex items-center gap-2.5 px-6 py-3 max-sm:px-4">
                    <Icon size={22} className="relative" />
                    <span className="relative">{label}</span>
                  </SweepReveal>
                </Link>
              ))}
            </div>
          </div>
          <p className="absolute bottom-12 inset-x-0 text-center text-xl text-foreground/50 tracking-wide pointer-events-none">
            <span>scroll?</span>
          </p>
        </section>

        {/* About + Blog: joined cards scrolling over the pinned background */}
        <div className="relative px-8 max-lg:px-4 pt-6 pb-28 max-lg:pt-4 max-lg:pb-16 pointer-events-none">
          <div className="max-w-7xl mx-auto pointer-events-auto bg-background   divide-y divide-border/20 shadow-2xl shadow-black/50">
            {/* About */}
            <section className="px-12 max-lg:px-6 py-16">
              <div
                className="grid gap-x-16 gap-y-6 items-center
                                grid-cols-1 [grid-template-areas:'heading'_'description'_'splat'_'actions']
                                lg:grid-cols-[minmax(0,1fr)_minmax(0,40rem)] lg:[grid-template-areas:'heading_splat'_'description_splat'_'actions_splat']"
              >
                <h2 className="[grid-area:heading] text-4xl max-sm:text-3xl font-black max-lg:text-center">
                  About Me
                </h2>
                <p className="[grid-area:description] text-lg text-foreground/50 leading-relaxed max-w-md max-lg:mx-auto max-lg:text-center">
                  I'm a CS &amp; Engineering student from Redmond, WA, who dabbles in
                  3D graphics, web development, robotics, and machine learning. I'm really
                  into the use of computer science in both creative endeavors and in simulating the real world.
                  {" "}
                  <br />
                  <br></br>I try to work on a variety of projects with the newest
                  tech, and love talking about it too. I'm always down to chat; feel
                  free to reach out!
                </p>
                <SplatContainer />
                <div className="[grid-area:actions] flex flex-col sm:flex-row gap-6 w-full">
                  <NavCardLink
                    href="/projects"
                    label="Projects"
                    viewTransitionName="projects-heading"
                  />
                  <NavCardLink
                    href="/experience"
                    label="Experience"
                    viewTransitionName="experience-heading"
                  />
                </div>
              </div>
            </section>

            {/* Awards */}
            <section className="px-12 max-lg:px-6 py-16">
              <h2 className="text-4xl max-sm:text-3xl font-black mb-4 max-lg:text-center">
                Awards
              </h2>
              <AwardsWheel groups={awardGroups} />
            </section>

            {/* Blog */}
            <section className="px-10 max-lg:px-6 py-16 text-center">
              <h2 className="text-3xl max-sm:text-2xl font-black mb-3">
                Blog
              </h2>
              <BlogPlaceholder />
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

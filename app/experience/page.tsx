import type { Metadata } from "next";
import ExperiencePageClient from "./ExperiencePageClient";

export const metadata: Metadata = {
    title: "Experience",
    description: "my experience",
    alternates: {
        canonical: "/experience",
    },
};

export default function ExperiencePage() {
    return <ExperiencePageClient />;
}

import type {Metadata} from "next";
import ExperiencePageClient from "./ExperiencePageClient";

export const metadata: Metadata = {
    title: "Experience",
    description: "Software, research, leadership, and web development experience from Inesh Dey.",
    alternates: {
        canonical: "/experience",
    },
};

export default function ExperiencePage() {
    return <ExperiencePageClient />;
}

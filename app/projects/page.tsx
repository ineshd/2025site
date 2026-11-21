import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
    title: "Projects",
    description: "my projects",
    alternates: {
        canonical: "/projects",
    },
};

export default function ProjectsPage() {
    return <ProjectsPageClient />;
}

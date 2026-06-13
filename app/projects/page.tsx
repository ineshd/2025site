import type {Metadata} from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
    title: "Projects",
    description: "Selected computer science, 3D graphics, web development, and machine learning projects by Inesh Dey.",
    alternates: {
        canonical: "/projects",
    },
};

export default function ProjectsPage() {
    return <ProjectsPageClient />;
}

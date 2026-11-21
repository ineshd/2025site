import type { Metadata } from "next";
import ExperimentsPageClient from "./ExperimentsPageClient";

export const metadata: Metadata = {
    title: "Experiments",
    description: "my experiments",
    alternates: {
        canonical: "/experiments",
    },
};

export default function ExperimentsPage() {
    return <ExperimentsPageClient />;
}

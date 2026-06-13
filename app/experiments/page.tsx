import type {Metadata} from "next";
import ExperimentsPageClient from "./ExperimentsPageClient";

export const metadata: Metadata = {
    title: "Experiments",
    description: "Interactive experiments, prototypes, and creative builds by Inesh Dey.",
    alternates: {
        canonical: "/experiments",
    },
};

export default function ExperimentsPage() {
    return <ExperimentsPageClient />;
}

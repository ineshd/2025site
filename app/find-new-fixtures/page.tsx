import type { Metadata } from "next";
import FindingNewFixturesClient from "./FindingNewFixturesClient";

export const metadata: Metadata = {
    title: "Finding New Fixtures",
    description: "my experiment in finding new fixtures",
    alternates: {
        canonical: "/find-new-fixtures",
    },
};

export default function Home() {
    return <FindingNewFixturesClient />;
}

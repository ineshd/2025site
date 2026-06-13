import type {Metadata} from "next";
import FindingNewFixturesClient from "./FindingNewFixturesClient";

export const metadata: Metadata = {
    title: "Finding New Fixtures",
    description: "A data and design experiment exploring water use and identifying new fixtures by Inesh Dey.",
    alternates: {
        canonical: "/find-new-fixtures",
    },
};

export default function Home() {
    return <FindingNewFixturesClient />;
}
                         
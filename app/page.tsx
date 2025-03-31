import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import Link from "next/link";

export default function Home() {
    return (
        <Layout headerPosition="absolute">
            <div className="opacity-10 absolute">
                <FullScreen4545Grid/>
            </div>
            <div className="absolute pointer-events-none">
                <div className={"w-screen h-screen flex flex-col justify-center items-center text-center pointer-events-none px-8"}>
                    <h1 className={"text-5xl max-lg:text-2xl text-font-medium pointer-events-auto mx-16"}>The new home for <br/>Inesh Dey&apos;s random stuff</h1>
                    <p className={"text-xl pointer-events-auto"}>This page is under construction.</p>
                    <Link href={"https://s4545.eu.org"}><p className={"text-lg text-primary pointer-events-auto"}>Check out my more complete site →</p></Link>

                    <Link href={"/find-new-fixtures"}><p className={"text-lg text-primary pointer-events-auto"}>Check out Find new Fixtures →</p></Link>

                </div>
            </div>
        </Layout>
    );
}

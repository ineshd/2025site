"use client"

import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";

export default function FindingNewFixturesClient() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <Layout headerPosition="sticky">
            <motion.div
                className="overflow-hidden relative py-16 shadow-2xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className={"text-4xl text-primary max-lg:text-2xl text-font-medium pointer-events-auto z-20 text-center m-auto w-full"}>
                    Finding New Fixtures
                </h1>
                <p className={"text-center"}>a project by Inesh Dey</p>
                <p className={"text-center"}>3/28/25</p>
                <div aria-hidden="true" className={"opacity-10 absolute inset-0 z-10"}>
                    <FullScreen4545Grid />
                </div>
            </motion.div>
            <div className="flex flex-col lg:flex-row items-center justify-center my-16 mx-16">
                <motion.div
                    className="w-full lg:w-1/2 px-16 max-h-[1%] z-10"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Carousel className="max-w-[400px] mx-auto" opts={{loop: true,}}>
                        <CarouselContent className="max-h-[400px] ">
                            <CarouselItem>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/1.jpg" alt="Fixture 1" className="h-full w-full object-cover  rounded-lg p-8" />
                            </CarouselItem>
                            <CarouselItem>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/23.jpg" alt="Fixture 2" className="h-full w-full object-cover  rounded-lg p-8" />
                            </CarouselItem>
                            <CarouselItem>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/34.jpg" alt="Fixture 3" className="h-full w-full  object-cover  rounded-lg p-8" />
                            </CarouselItem>
                            <CarouselItem>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/45.jpg" alt="Fixture 3" className="h-full w-full object-cover  rounded-lg p-8" />
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="z-10" />
                        <CarouselNext />
                    </Carousel>
                    <p className="text-center">Some of the places our water bill is being spent out of</p>
                </motion.div>
                <motion.div
                    className="w-full lg:w-1/2 p-8 min-h-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-2xl font-bold mb-4">The Problem</h2>
                    <p className="text-lg mb-4">
                        So... recently I checked out our water bill, and turns out we&apos;re spending some crazy amount of money I wouldn&apos;t have ever guessed. And maybe, you are too! So strap on and maybe you&apos;ll find some new fixtures too!
                    </p>
                </motion.div>
            </div>
            <motion.div
                className="flex flex-col items-center justify-center my-32 mx-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl max-md:text-3xl">So what is a lot?</h2>
                <p className="text-xl text-center">I don&apos;t know about yours, but our water bill was at</p>
                <motion.div
                    ref={ref}
                    className="text-4xl font-bold text-primary text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
                    transition={{ duration: 0.8 }}
                >
                    {isInView && <CountUp end={182.42} duration={2} prefix="$" decimals={2} />}
                    <p className="text-xl text-white font-normal text-center relative -top-4">a month</p>
                    <p className="text-xl text-white font-normal text-center">({isInView && <CountUp end={377.58} duration={2} prefix="$" decimals={2} />} in 63 days / 30.4 days per month)</p>
                </motion.div>
                <motion.div
                    ref={ref}
                    className=""
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                >
                    <p className="text-xl pt-8">yikes...</p>
                </motion.div>
            </motion.div>
            <motion.div
                className="flex flex-col items-center justify-center my-32 mx-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl max-md:text-3xl">Identifying the wall of shame</h2>
                <div className="w-[60%] max-w-[1200px] pt-8 text-lg">
                    <p className="">With a bit of Google reverse image search and online resources, I got information about each of the pictured items. Turns out, we&apos;re pretty good at choosing the good stuff, but some of these are definitely not good</p>
                    <div className="text-lg pt-8">
                        <ul>
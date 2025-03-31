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

export default function Home() {
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
                <div className={"opacity-10 absolute inset-0 z-10"}>
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
                        So... recently I checked out our water bill, and turns out we&apos;re spending some crazy amount of money I wouldn&apos;t have ever guessed. And maybe, you are too! So strap on and maybe you'll find some new fixtures too!
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
                            <li>
                                <Link href="https://www.amazon.ae/AFA-Stainless-Kitchen-Faucet-Brushed/dp/B0892SP1PP" className="text-primary">Kitchen Faucet</Link> - 1.8 GPM. By modern standards, alright! 1.5 GPM could be better. 
                            </li>
                            <li>
                                <Link href="https://www.homedepot.com/p/Waterpik-2-Spray-7-8-in-Single-Wall-Mount-Fixed-Rain-Shower-Head-in-White-CF-201/100092293" className="text-primary">Shower Head</Link> - 2.5 GPM is a bit much. Minimum ideal: 1.8 GPM
                            </li>
                            <li>
                                <Link href="https://www.whirlpool.com/owners-center-pdp.WTW4815EW.html" className="text-primary">Washer</Link> - Sure it&apos;s pretty energy efficient, but it uses a lot of water, typically around 28 gallons on a full load.
                                This is not good! Some energy star washers use way less than 15 gallons per load.
                            </li>
                            <li>
                                <Link href="https://www.whirlpool.com/owners-center-pdp.WTW4815EW.html" className="text-primary">Bathroom Faucet</Link> - 1.5 GPM is pretty good, and is the maximum allowed by law in the US. This is a good one, but 1.2 GPM is better.
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="flex flex-col items-center justify-center my-32 mx-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl max-md:text-3xl">Replacing them</h2>
                <div className="w-[60%] max-w-[1200px] pt-8 text-lg">
                    <p className="">Based on my research online, I&apos;ve found a ton of great alternatives for each! I tried searching for a wide price range, so you can find the right one for you!</p>
                    <div className="mt-8 mb-4 text-xl">Washers (some based on water use on Energy Star site, annual divided by 295)</div>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="border border-gray-300 px-4 py-2">Brand & Model</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Water Efficiency</th>
                                <th className="border border-gray-300 px-4 py-2">Store</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">BLACK +  DECKER - BFLW27MW</td>
                                <td className="border border-gray-300 px-4 py-2">$759.45</td>
                                <td className="border border-gray-300 px-4 py-2">8.64 gal / cycle</td>
                                <td className="border border-gray-300 px-4 py-2">@ Home Depot </td>
                            </tr>
                            <tr className="bg-black">
                                <td className="border border-gray-300 px-4 py-2">Summit - LW2427
</td>
                                <td className="border border-gray-300 px-4 py-2">$1,172.83</td>
                                <td className="border border-gray-300 px-4 py-2">8.64 gal / cycle</td>
                                <td className="border border-gray-300 px-4 py-2">@ Home Depot</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">LG WT6105CW</td>
                                <td className="border border-gray-300 px-4 py-2">$528.00</td>
                                <td className="border border-gray-300 px-4 py-2">14 gal / cycle</td>
                                <td className="border border-gray-300 px-4 py-2">@ Home Depot</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-8 mb-4 text-xl">Kitchen Faucets <p className="text-lg">Turns out mine was pretty good, but here&apos;s some efficient ones to consider if you&apos;re above 1.8 GPM</p></div>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="border border-gray-300 px-4 py-2">Brand & Model</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Water Efficiency</th>
                                <th className="border border-gray-300 px-4 py-2">Store</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Grohe 31518DC0 Concetto</td>
                                <td className="border border-gray-300 px-4 py-2">$213.52</td>
                                <td className="border border-gray-300 px-4 py-2">1.5 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ Amazon </td>
                            </tr>
                            <tr className="bg-black">
                                <td className="border border-gray-300 px-4 py-2">FORIOUS Kitchen Faucet
</td>
                                <td className="border border-gray-300 px-4 py-2">$39.90</td>
                                <td className="border border-gray-300 px-4 py-2">1.8 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ Amazon</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Kohler 596-VS Simplice</td>
                                <td className="border border-gray-300 px-4 py-2">$219.99</td>
                                <td className="border border-gray-300 px-4 py-2">1.5 GPM</td>
                                <td className="border border-gray-300 px-4 py-2 max-w-32">@ Amazon and @ Home Depot</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-8 mb-4 text-xl">Bathroom Faucets</div>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="border border-gray-300 px-4 py-2">Brand & Model</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Water Efficiency</th>
                                <th className="border border-gray-300 px-4 py-2">Store</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Delta 15840LF-PD</td>
                                <td className="border border-gray-300 px-4 py-2">$157.00</td>
                                <td className="border border-gray-300 px-4 py-2">1.2 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ Amazon </td>
                            </tr>
                            <tr className="bg-black">
                                <td className="border border-gray-300 px-4 py-2">GROHE 23085001 Bauloop
</td>
                                <td className="border border-gray-300 px-4 py-2">$79.20</td>
                                <td className="border border-gray-300 px-4 py-2">1.2 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ Amazon</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">IKEA - Saljen</td>
                                <td className="border border-gray-300 px-4 py-2">$25.00</td>
                                <td className="border border-gray-300 px-4 py-2">1.2 GPM</td>
                                <td className="border border-gray-300 px-4 py-2 max-w-32">@ IKEA</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-8 mb-4 text-xl">Shower Heads</div>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="border border-gray-300 px-4 py-2">Brand & Model</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Water Efficiency</th>
                                <th className="border border-gray-300 px-4 py-2">Store</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">IKEA - Brogrund</td>
                                <td className="border border-gray-300 px-4 py-2">$69.99</td>
                                <td className="border border-gray-300 px-4 py-2">1.8 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ IKEA </td>
                            </tr>
                            <tr className="bg-black">
                                <td className="border border-gray-300 px-4 py-2">Delta 75554C
</td>
                                <td className="border border-gray-300 px-4 py-2">$22.98</td>
                                <td className="border border-gray-300 px-4 py-2">1.75 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ Home Depot</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">SparkPod Shower Head</td>
                                <td className="border border-gray-300 px-4 py-2">$25.46</td>
                                <td className="border border-gray-300 px-4 py-2">1.8 GPM</td>
                                <td className="border border-gray-300 px-4 py-2">@ Amazon</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </motion.div>
            <motion.div
                className="flex flex-col items-center justify-center my-32 mx-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl max-md:text-3xl">Results!</h2>
                <div className="w-[60%] max-w-[1200px] pt-8 text-lg">
                    Both motivation from me and our water bill allowed me to convince my parents that we do in fact need to replace our stuff. 
                    Now, theoretically, if we replaced all of our stuff, here&apos;s the amount of water we&apos;d save per month:

                    <ul className="list-disc pl-8">
                        <li>Bathroom Faucet: 126 gallons/week</li>
                        <li>Kitchen Faucet: 126 gallons/week</li>
                        <li>Shower Head: 245 gallons/week</li>
                        <li>Washer: 57 gallons/week</li>
                    </ul>
                    <p className="pt-4 font-bold">Total: 554 gallons/week and $1.64/week from our house!</p>
                    <p>Maybe you could save some water too! Since our water usage was 29642 gallons a week, we save at least 1%, a conservative estimate, which is likely much higher! Data for timing was collected over a short time, and not complete.</p>
                </div>
            </motion.div>
            <motion.div
                className="flex flex-col items-center justify-center py-32 mx-16 h-[60vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl max-md:text-3xl">What are you waiting for?</h2>
                <p className="text-xl">See what you&apos;re missing out on and swap to more water efficient fixtures, and maybe you&apos;ll save some money too!</p>
            </motion.div>
            <motion.div
                className="flex flex-col items-center justify-center my-32 mx-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl max-md:text-3xl">Detailed Calculations</h2>
                
                <details className="w-[60%] max-w-[1200px] mt-8 text-lg border-gray-300 border rounded-lg p-4">
                    <summary className="cursor-pointer">Click to check out the calculations!</summary>
                    <ul className="list-disc pl-8 pt-8">
                        <li>
                            <strong>Bathroom Faucets:</strong> 
                            <p>(1.5 gpm − 1.2 gpm) × (60 min/day × 7 days) = 0.3 gpm × 210 min = <strong>126 gallons/week</strong></p>
                        </li>
                        <li>
                            <strong>Kitchen Faucets:</strong> 
                            <p>(1.8 gpm − 1.5 gpm) × (60 min/day × 7 days) = 0.3 gpm × 210 min = <strong>126 gallons/week</strong></p>
                        </li>
                        <li>
                            <strong>Shower Head:</strong> 
                            <p>(2.5 gpm − 1.8 gpm) × (50 min/day × 7 days) = 0.7 gpm × 210 min = <strong>245 gallons/week</strong></p>
                        </li>
                        <li>
                            <strong>Washer:</strong> 
                            <p>(23 gallons/load − 8.64 gallons/load) * 4 loads / week = <strong>57 gallons/week</strong></p>
                        </li>
                        <li>
                        <p className="py-4 font-bold">Total: 554 gallons/week</p> </li>
                        <li>
                            <p>$2.20 per cubic meter / 748 galloner per cubic meter = <strong>$0.002964 per gallon</strong></p>
                        </li>
                        <li>
                            <p>$0.002964 per gallon * 554 gallons/week = <strong>$1.64 per week</strong></p>
                        </li>
                        <li>
                            554 gallons/week * 2 weeks = <strong>1108 gallons</strong> for project time
                        </li>
                        <li>
                            $1.62 per week * 2 weeks = <strong>$3.28</strong> for project time
                        </li>
                    </ul>
                </details>
            </motion.div>
        </Layout>
    );
}


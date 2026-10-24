"use client"

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface LayoutProps {
    children: React.ReactNode;
    headerPosition?: 'absolute' | 'sticky';
}

const Layout = ({children, headerPosition = 'sticky'}: LayoutProps) => {
    return (
        <div className={"min-h-screen flex flex-col max-w-screen overflow-x-clip"}>
            <Header position={headerPosition}/>
            {/* relative z-10 with an opaque background so the sticky footer below
                stays hidden underneath until the content scrolls past it. */}
            <main className={"relative z-10 bg-background flex-1 w-full overflow-x-clip"}>{children}</main>
            <Footer/>
        </div>
    );

};

export default Layout;
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared renderer for the link-preview (Open Graph) images: the site's slanted
// background text, the textured "ineshd.com" logo, and the page's name below it.
// The images are generated once at build time.
//
// The renderer can't use the site's CSS blend mode and brightness filter for the
// logo, so logo-texture-tinted.png is public/logo-texture.png with that effect
// (green "color" blend, then brightness 2x) baked in. Fonts are static Montserrat
// TTFs, since it can't read the site's web fonts.

const BACKGROUND = "rgb(11, 13, 25)";  // --background
const FOREGROUND = "rgb(241, 240, 255)"; // --foreground

const asset = (name: string) => readFile(join(process.cwd(), "app/_og", name));

export async function renderOgImage(page?: string) {
    const [blackItalic, boldItalic, black, texture] = await Promise.all([
        asset("Montserrat-BlackItalic.ttf"),
        asset("Montserrat-BoldItalic.ttf"),
        asset("Montserrat-Black.ttf"),
        asset("logo-texture-tinted.png"),
    ]);
    const textureUrl = `data:image/png;base64,${texture.toString("base64")}`;

    // Same as the site: the page's name, or the home page's "cool background".
    const word = page ? `${page.toLowerCase()} ` : "cool background ";
    const line = word.repeat(Math.ceil(2600 / (word.length * 50)));

    return new ImageResponse(
        (
            <div style={{
                width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden", background: BACKGROUND,
            }}>
                {/* Background text: rotated rows, alternate rows nudged right, at 10% like the site. */}
                <div style={{
                    position: "absolute", left: -400, top: -450, width: 2000, height: 1530,
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    transform: "rotate(12deg)", opacity: 0.1,
                }}>
                    {Array.from({ length: 17 }, (_, i) => (
                        <div key={i} style={{
                            display: "flex", flexShrink: 0, marginLeft: i % 2 === 0 ? 64 : 0, whiteSpace: "pre",
                            fontFamily: "Montserrat", fontStyle: "italic", fontWeight: 700, fontSize: 90, lineHeight: 1,
                            color: FOREGROUND,
                        }}>
                            {line}
                        </div>
                    ))}
                </div>
                {/* Darken the middle so the title reads clearly over the background text. */}
                <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    backgroundImage: `radial-gradient(ellipse 60% 55% at 50% 50%, ${BACKGROUND} 35%, rgba(11, 13, 25, 0) 100%)`,
                }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                        display: "flex", fontFamily: "Montserrat", fontStyle: "italic", fontWeight: 900,
                        fontSize: page ? 80 : 150, lineHeight: 1.2, paddingRight: "0.1em",
                        backgroundImage: `url(${textureUrl})`, backgroundSize: "cover", backgroundPosition: "center",
                        backgroundClip: "text", color: "transparent",
                    }}>
                        ineshd.com
                    </div>
                    {page && (
                        <div style={{
                            display: "flex", fontFamily: "Montserrat", fontWeight: 900, fontSize: 150, lineHeight: 1.05,
                            color: FOREGROUND,
                        }}>
                            {page}
                        </div>
                    )}
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                { name: "Montserrat", data: blackItalic, weight: 900, style: "italic" },
                { name: "Montserrat", data: boldItalic, weight: 700, style: "italic" },
                { name: "Montserrat", data: black, weight: 900, style: "normal" },
            ],
        },
    );
}

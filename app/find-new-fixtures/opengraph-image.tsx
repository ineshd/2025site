import { renderOgImage } from "@/app/_og/og-image";

export const alt = "Finding New Fixtures | ineshd.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return renderOgImage("Fixtures");
}

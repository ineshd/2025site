import Image, {StaticImageData} from "next/image";

// Shared by the Projects and Experience lists. Both expect to sit inside an entry
// that has the `group` class and `relative isolate` positioning.

// Desktop: a square slot showing the image's left edge (or its center, for images
// whose subject isn't on the left). On hover the image slides out past the card's
// right edge to its full 16:9 width where there's room (xl+); narrower desktops pan
// it inside the square instead. Phones: full-width 16:9.
export function EntryPreviewImage({image, alt, focus = "left"}: {
    image: StaticImageData;
    alt: string;
    focus?: "left" | "center";
}) {
    return (
        <div className="relative w-full aspect-video lg:aspect-auto lg:size-48 shrink-0 lg:order-last">
            <div className="relative z-10 h-full w-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-48 xl:group-hover:w-[calc(12rem*16/9)] overflow-hidden transition-[width] duration-300 ease-out">
                <Image src={image} alt={alt}
                       sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 12rem, 100vw"
                       className={`h-full w-full object-cover ${focus === "center" ? "lg:object-center" : "lg:object-left"} lg:group-hover:object-right transition-[object-position] duration-500 ease-out`}/>
            </div>
        </div>
    );
}

// A logo shown whole in a fixed square (same slot as the 3D models): no crop and no
// slide-out. The dark backing keeps a light logo readable over the green hover fill.
export function EntryPreviewLogo({image, alt}: { image: StaticImageData; alt: string }) {
    return (
        <div className="relative w-full aspect-video lg:aspect-auto lg:size-48 shrink-0 lg:order-last bg-background">
            <Image src={image} alt={alt} sizes="(min-width: 1024px) 12rem, 100vw"
                   className="absolute inset-0 h-full w-full object-contain p-6"/>
        </div>
    );
}

// Hover fill on its own layer so it can grow: next to a sliding preview image
// (xl+) it extends right by the slide-out distance (16:9 width minus the square).
export function EntryHoverFill({expands}: { expands: boolean }) {
    return (
        <span aria-hidden="true"
              className={`absolute inset-y-0 left-0 right-0 -z-10 group-hover:bg-primary group-active:bg-secondary transition-all duration-300 ease-out ${expands ? "xl:group-hover:-right-[calc(12rem*16/9-12rem)]" : ""}`}/>
    );
}

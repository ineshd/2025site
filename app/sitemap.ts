import type {MetadataRoute} from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/projects",
        "/experience",
        "/experiments",
        "/find-new-fixtures",
    ];

    return routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.7,
    }));
}
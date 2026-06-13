const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

export default function Head() {
    return (
        <>
            <title>Experience | Inesh Dey</title>
            <meta
                name="description"
                content="Software, research, leadership, and web development experience from Inesh Dey."
            />
            <link rel="canonical" href={`${siteUrl}/experience`} />
        </>
    );
}
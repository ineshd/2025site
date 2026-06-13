const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

export default function Head() {
    return (
        <>
            <title>Experiments | Inesh Dey</title>
            <meta
                name="description"
                content="Interactive experiments, prototypes, and creative builds by Inesh Dey."
            />
            <link rel="canonical" href={`${siteUrl}/experiments`} />
        </>
    );
}
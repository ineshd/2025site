const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

export default function Head() {
    return (
        <>
            <title>Projects | Inesh Dey</title>
            <meta
                name="description"
                content="Selected computer science, 3D graphics, web development, and machine learning projects by Inesh Dey."
            />
            <link rel="canonical" href={`${siteUrl}/projects`} />
        </>
    );
}
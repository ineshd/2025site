const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

export default function Head() {
    return (
        <>
            <title>Finding New Fixtures | Inesh Dey</title>
            <meta
                name="description"
                content="A data and design experiment exploring water use and identifying new fixtures by Inesh Dey."
            />
            <link rel="canonical" href={`${siteUrl}/find-new-fixtures`} />
        </>
    );
}
import {NextResponse} from "next/server";
import {englishDataset, englishRecommendedTransformers, RegExpMatcher} from "obscenity";

// Returns only the top clean track (title + artist) of the past 7 days. The
// Last.fm username and API key stay server-side (env vars), and nothing that
// identifies the account (username, profile URL, avatar) is passed through to
// the client.
const REVALIDATE_S = 1800;
// How many of the week's top tracks to look through for a clean one.
const CANDIDATES = 10;

// Profanity matching comes from the obscenity package (its word list and
// leetspeak handling live in node_modules, not this repo). It errs strict, which
// only skips to the next track; the safe direction for a résumé site.
const matcher = new RegExpMatcher({...englishDataset.build(), ...englishRecommendedTransformers});
const isExplicit = (text: string) => matcher.hasMatch(text);

type TopTracksResponse = {
    toptracks?: { track?: { name?: string; artist?: { name?: string } }[] };
};

export async function GET() {
    const user = process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;
    if (!user || !apiKey) {
        return NextResponse.json({track: null});
    }

    const url = new URL("https://ws.audioscrobbler.com/2.0/");
    url.search = new URLSearchParams({
        method: "user.gettoptracks",
        user,
        api_key: apiKey,
        period: "7day",
        limit: String(CANDIDATES),
        format: "json",
    }).toString();

    try {
        const res = await fetch(url, {next: {revalidate: REVALIDATE_S}});
        if (!res.ok) return NextResponse.json({track: null});
        const data: TopTracksResponse = await res.json();
        // Tracks come back in play-count order; take the first clean one.
        const top = (data.toptracks?.track ?? []).find((t) =>
            t.name && t.artist?.name && !isExplicit(t.name) && !isExplicit(t.artist.name));
        const track = top ? {title: top.name!, artist: top.artist!.name!} : null;
        return NextResponse.json(
            {track},
            {headers: {"Cache-Control": `public, s-maxage=${REVALIDATE_S}, stale-while-revalidate=${REVALIDATE_S}`}},
        );
    } catch {
        return NextResponse.json({track: null});
    }
}

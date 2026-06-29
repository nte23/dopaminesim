import { NextResponse } from "next/server";

/**
 * Server-side Pixabay proxy. Keeps the key off the client and caches results
 * (Pixabay's license requires caching ~24h and discourages permanent
 * hotlinking — for production, re-host the chosen images on your own CDN).
 * Returns { url: null } when no key is configured, so the UI shows its
 * designed gradient fallback and everything still works.
 */
const cache = new Map<string, string | null>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").slice(0, 80).trim();
  if (!q) return NextResponse.json({ url: null });
  if (cache.has(q)) return NextResponse.json({ url: cache.get(q) ?? null });

  const key = process.env.PIXABAY_KEY;
  if (!key) {
    cache.set(q, null);
    return NextResponse.json({ url: null });
  }

  try {
    const u = new URL("https://pixabay.com/api/");
    u.searchParams.set("key", key);
    u.searchParams.set("q", q);
    u.searchParams.set("image_type", "photo");
    u.searchParams.set("category", "food");
    u.searchParams.set("safesearch", "true");
    u.searchParams.set("orientation", "horizontal");
    u.searchParams.set("per_page", "3");
    const res = await fetch(u, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      hits?: { webformatURL?: string; largeImageURL?: string }[];
    };
    const url = data.hits?.[0]?.largeImageURL || data.hits?.[0]?.webformatURL || null;
    cache.set(q, url);
    return NextResponse.json({ url });
  } catch {
    cache.set(q, null);
    return NextResponse.json({ url: null });
  }
}

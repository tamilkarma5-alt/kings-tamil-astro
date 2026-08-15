import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing place" }, { status: 400 });

  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=en&q=" +
    encodeURIComponent(q);

  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "KingsTamilAstro/1.0 contact=website" },
      next: { revalidate: 86400 },
    });
    if (!r.ok) throw new Error("Geocoding failed");
    const data = await r.json();
    if (!Array.isArray(data) || !data.length) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }
    return NextResponse.json({
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
      display: data[0].display_name,
    });
  } catch {
    return NextResponse.json({ error: "Could not find place coordinates" }, { status: 502 });
  }
}
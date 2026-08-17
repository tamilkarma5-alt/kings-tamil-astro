import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json(
        {
          success: false,
          error: "Place is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const url =
      "https://nominatim.openstreetmap.org/search" +
      `?q=${encodeURIComponent(q + ", Tamil Nadu, India")}` +
      "&format=json" +
      "&limit=1" +
      "&addressdetails=1";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Kings-Tamil-Astro/1.0",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Geocoding service failed",
        },
        {
          status: 502,
          headers: corsHeaders,
        }
      );
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Place not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const result = results[0];

    return NextResponse.json(
      {
        success: true,
        lat: Number(result.lat),
        lon: Number(result.lon),
        displayName: result.display_name || q,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Geocode error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to find location",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

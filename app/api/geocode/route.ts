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
      `?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Kings-Tamil-Astro/1.0",
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

    const first = results[0];

    const lat = Number(first.lat);
    const lon = Number(first.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid coordinates",
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        lat,
        lon,
        displayName: first.display_name ?? q,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Geocode API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Geocoding failed",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

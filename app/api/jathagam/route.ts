import { NextResponse } from "next/server";
import { calculateChart } from "../../../lib/astro";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      date,
      time,
      latitude,
      longitude,
    } = body;

    if (
      typeof date !== "string" ||
      typeof time !== "string" ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "date, time, latitude and longitude are required",
        },
        { status: 400 }
      );
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid latitude or longitude",
        },
        { status: 400 }
      );
    }

    if (
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude or longitude is out of range",
        },
        { status: 400 }
      );
    }

    const chart = calculateChart({
      date,
      time,
      lat,
      lon,
    });

    return NextResponse.json({
      success: true,
      data: chart,
    });
  } catch (error) {
    console.error("Jathagam API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to calculate jathagam",
      },
      { status: 500 }
    );
  }
}

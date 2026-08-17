import { NextResponse } from "next/server";
import { calculateBirthChart } from "../../../lib/astro";

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
      !date ||
      !time ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "date, time, latitude and longitude are required",
        },
        { status: 400 }
      );
    }

    const birthDate = new Date(
      `${date}T${time}:00`
    );

    if (
      Number.isNaN(
        birthDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid birth date or time",
        },
        { status: 400 }
      );
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid latitude or longitude",
        },
        { status: 400 }
      );
    }

    const chart =
      calculateBirthChart(
        birthDate,
        lat,
        lon
      );

    return NextResponse.json({
      success: true,
      data: chart,
    });
  } catch (error) {
    console.error(
      "Jathagam API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to calculate jathagam",
      },
      { status: 500 }
    );
  }
}

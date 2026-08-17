import { NextResponse } from "next/server";
import { calculateChart } from "../../../lib/astro";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const date = body?.date;
    const time = body?.time;
    const latitude = Number(body?.latitude);
    const longitude = Number(body?.longitude);

    if (
      typeof date !== "string" ||
      typeof time !== "string" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
        },
        { status: 400 }
      );
    }

    const data = calculateChart({
      date,
      time,
      lat: latitude,
      lon: longitude,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Jathagam calculation failed",
      },
      { status: 500 }
    );
  }
}

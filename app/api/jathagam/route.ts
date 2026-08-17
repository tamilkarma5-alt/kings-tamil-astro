import { NextResponse } from "next/server";
import { calculateChart } from "../../../lib/astro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

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
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const data = calculateChart({
      date,
      time,
      lat: latitude,
      lon: longitude,
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Jathagam API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Jathagam calculation failed",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

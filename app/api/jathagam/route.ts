```tsx
import { NextResponse } from "next/server";
import { calculateChart } from "../../../lib/astro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function makeResponse(data: unknown, status: number) {
  return NextResponse.json(data, {
    status: status,
    headers: corsHeaders,
  });
}

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
      return makeResponse(
        {
          success: false,
          error: "Invalid input",
        },
        400
      );
    }

    const data = calculateChart({
      date: date,
      time: time,
      lat: latitude,
      lon: longitude,
    });

    return makeResponse(
      {
        success: true,
        data: data,
      },
      200
    );
  } catch (error) {
    console.error("Jathagam API error:", error);

    return makeResponse(
      {
        success: false,
        error: "Jathagam calculation failed",
      },
      500
    );
  }
}
```

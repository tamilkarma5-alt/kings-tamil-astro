```tsx
import { NextResponse } from "next/server";
import { calculateChart } from "../../../lib/astro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
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
      return json(
        {
          success: false,
          error: "Invalid input",
        },
        400
      );
    }

    const data = calculateChart({
      date,
      time,
      lat: latitude,
      lon: longitude,
    });

    return json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Jathagam API error:", error);

    return json(
      {
        success: false,
        error: "Jathagam calculation failed",
      },
      500
    );
  }
}
```

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Fetching readings from database")
    const { db } = await connectToDatabase()

    // Get the latest 100 readings, sorted by timestamp (newest first)
    const readings = await db.collection("readings").find({}).sort({ createdAt: -1 }).limit(100).toArray()

    console.log(`Found ${readings.length} readings`)
    return NextResponse.json(readings)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch readings" }, { status: 500 })
  }
}

// Add CORS headers to the POST handler
export async function POST(request: Request) {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  try {
    console.log("Received POST request to /api/readings")

    const { db } = await connectToDatabase()
    console.log("Connected to database")

    const data = await request.json()
    console.log("Received data:", data)

    // Validate the incoming data
    if (data.fsr === undefined) {
      console.log("Missing required field: fsr")
      return NextResponse.json({ error: "Missing required field: fsr" }, { status: 400 })
    }

    // Add timestamp and format the data
    const reading = {
      fsr: data.fsr,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    }
    console.log("Formatted reading:", reading)

    // Insert the reading into the database
    const result = await db.collection("readings").insertOne(reading)
    console.log("Inserted reading with ID:", result.insertedId)

    // Return response with CORS headers
    return new NextResponse(
      JSON.stringify({
        message: "Reading saved successfully",
        id: result.insertedId,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("Database error:", error)
    return new NextResponse(
      JSON.stringify({
        error: "Failed to save reading",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}


import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// This handles POST requests from the ESP32
export async function POST(request: Request) {
  console.log("Received POST request to /readings")

  // Add CORS headers for ESP32
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers })
  }

  try {
    // Parse the JSON payload
    let data
    try {
      data = await request.json()
      console.log("Received data:", data)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return new NextResponse(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      })
    }

    // Validate the FSR data
    if (data.fsr === undefined) {
      console.log("Missing required field: fsr")
      return new NextResponse(JSON.stringify({ error: "Missing required field: fsr" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      })
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Format the reading with timestamp
    const reading = {
      fsr: data.fsr,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    }

    // Insert into database
    const result = await db.collection("readings").insertOne(reading)
    console.log("Saved reading with ID:", result.insertedId)

    // Return success response
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Reading saved successfully",
        id: result.insertedId,
      }),
      {
        status: 201,
        headers: { ...headers, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error processing request:", error)

    // Return error response
    return new NextResponse(JSON.stringify({ error: "Failed to save reading" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    })
  }
}


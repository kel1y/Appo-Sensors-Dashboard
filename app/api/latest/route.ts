import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Function to determine status based on FSR value
function getStatus(value: number): string {
  if (value < 50) return "No pressure"
  if (value < 500) return "Light touch"
  if (value < 1500) return "Light squeeze"
  if (value < 2500) return "Medium squeeze"
  return "Big squeeze"
}

export async function GET() {
  try {
    // Connect to the database
    const { db } = await connectToDatabase()

    // Get only the latest reading
    const latestReading = await db.collection("readings").find({}).sort({ createdAt: -1 }).limit(1).toArray()

    // If no readings found
    if (latestReading.length === 0) {
      return NextResponse.json(
        {
          error: "No readings available",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    const reading = latestReading[0]

    // Return a clean response with fsr1, fsr2, fsr3 and their statuses
    return NextResponse.json({
      fsr1: reading.fsr1,
      status1: getStatus(reading.fsr1),
      fsr2: reading.fsr2,
      status2: getStatus(reading.fsr2),
      fsr3: reading.fsr3,
      status3: getStatus(reading.fsr3),
      timestamp: reading.createdAt,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch latest reading" }, { status: 500 })
  }
}

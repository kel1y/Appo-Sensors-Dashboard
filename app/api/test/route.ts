import { NextResponse } from "next/server"

// Function to determine status based on FSR value
function getStatus(value: number): string {
  if (value < 50) return "No pressure"
  if (value < 500) return "Light touch"
  if (value < 1500) return "Light squeeze"
  if (value < 2500) return "Medium squeeze"
  return "Big squeeze"
}

export async function GET() {
  return NextResponse.json({ message: "API is working!" })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received test data:", data)

    // Build the response payload
    let responsePayload = {
      message: "Test data received successfully",
      receivedData: data,
    }

    // If data includes fsr1, fsr2, and fsr3, include statuses in the response
    if (
      data.fsr1 !== undefined &&
      data.fsr2 !== undefined &&
      data.fsr3 !== undefined
    ) {
      responsePayload = {
        ...responsePayload,
        fsr1: data.fsr1,
        status1: getStatus(data.fsr1),
        fsr2: data.fsr2,
        status2: getStatus(data.fsr2),
        fsr3: data.fsr3,
        status3: getStatus(data.fsr3),
      }
    }

    return NextResponse.json(responsePayload)
  } catch (error) {
    console.error("Error in test endpoint:", error)
    return NextResponse.json({ error: "Failed to process test data" }, { status: 500 })
  }
}

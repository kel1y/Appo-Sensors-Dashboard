import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "API is working!" })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received test data:", data)

    return NextResponse.json({
      message: "Test data received successfully",
      receivedData: data,
    })
  } catch (error) {
    console.error("Error in test endpoint:", error)
    return NextResponse.json({ error: "Failed to process test data" }, { status: 500 })
  }
}


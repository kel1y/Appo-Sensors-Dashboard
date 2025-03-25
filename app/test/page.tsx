"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TestPage() {
  // Set up state for three FSR sensor values. Default values are "500".
  const [fsr1Value, setFsr1Value] = useState("500")
  const [fsr2Value, setFsr2Value] = useState("500")
  const [fsr3Value, setFsr3Value] = useState("500")
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)
    setError(null)

    try {
      // Send to the API endpoint for testing data submission.
      const res = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send all three FSR values as numbers in the JSON payload
        body: JSON.stringify({
          fsr1: Number.parseInt(fsr1Value),
          fsr2: Number.parseInt(fsr2Value),
          fsr3: Number.parseInt(fsr3Value),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit data")
      }

      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Test Data Submission</h1>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Submit Test FSR Data</CardTitle>
          <CardDescription>
            Use this form to manually submit test data to the API. Provide values for all three sensors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fsr1" className="text-sm font-medium">
                FSR1 Value
              </label>
              <Input
                id="fsr1"
                type="number"
                value={fsr1Value}
                onChange={(e) => setFsr1Value(e.target.value)}
                required
                min="0"
                max="4095"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fsr2" className="text-sm font-medium">
                FSR2 Value
              </label>
              <Input
                id="fsr2"
                type="number"
                value={fsr2Value}
                onChange={(e) => setFsr2Value(e.target.value)}
                required
                min="0"
                max="4095"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fsr3" className="text-sm font-medium">
                FSR3 Value
              </label>
              <Input
                id="fsr3"
                type="number"
                value={fsr3Value}
                onChange={(e) => setFsr3Value(e.target.value)}
                required
                min="0"
                max="4095"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Test Data"}
            </Button>
          </form>
        </CardContent>
        {(response || error) && (
          <CardFooter className="flex flex-col items-start">
            {response && (
              <div className="mt-4">
                <h3 className="font-medium text-green-600">Success Response:</h3>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-x-auto w-full">{response}</pre>
              </div>
            )}
            {error && (
              <div className="mt-4">
                <h3 className="font-medium text-red-600">Error:</h3>
                <pre className="mt-2 bg-red-50 p-2 rounded text-sm text-red-800 overflow-x-auto w-full">{error}</pre>
              </div>
            )}
          </CardFooter>
        )}
      </Card>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

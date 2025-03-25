"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

interface Reading {
  _id: string
  fsr1: number
  fsr2: number
  fsr3: number
  timestamp: string
  createdAt: string
}

export default function Home() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/readings")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setReadings(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Get the latest reading (assumes readings are sorted newest first)
  const latestReading = readings.length > 0 ? readings[0] : null

  // Determine status based on an FSR value
  const getStatus = (value: number) => {
    if (value < 50) return { text: "No pressure", color: "text-gray-500" }
    if (value < 500) return { text: "Light touch", color: "text-blue-500" }
    if (value < 1500) return { text: "Light squeeze", color: "text-green-500" }
    if (value < 2500) return { text: "Medium squeeze", color: "text-yellow-500" }
    return { text: "Big squeeze", color: "text-red-500" }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">FSR Sensor Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: {lastUpdated || "Never"}
        <Button variant="ghost" size="sm" className="ml-2" onClick={fetchData} disabled={loading}>
          <RefreshCcw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Cards for individual sensor readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sensor 1</CardTitle>
            <CardDescription>Latest FSR1 reading</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ) : latestReading ? (
              <div>
                <p className="text-5xl font-bold">{latestReading.fsr1}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {getStatus(latestReading.fsr1).text}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recorded at {new Date(latestReading.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No readings available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sensor 2</CardTitle>
            <CardDescription>Latest FSR2 reading</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ) : latestReading ? (
              <div>
                <p className="text-5xl font-bold">{latestReading.fsr2}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {getStatus(latestReading.fsr2).text}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recorded at {new Date(latestReading.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No readings available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sensor 3</CardTitle>
            <CardDescription>Latest FSR3 reading</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ) : latestReading ? (
              <div>
                <p className="text-5xl font-bold">{latestReading.fsr3}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {getStatus(latestReading.fsr3).text}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recorded at {new Date(latestReading.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No readings available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table of recent readings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>Latest sensor readings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : readings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left pb-2">Time</th>
                    <th className="text-left pb-2">FSR1</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">FSR2</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">FSR3</th>
                    <th className="text-left pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.slice(0, 10).map((reading) => (
                    <tr key={reading._id}>
                      <td className="py-2">
                        {new Date(reading.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2">{reading.fsr1}</td>
                      <td className={`py-2 ${getStatus(reading.fsr1).color}`}>
                        {getStatus(reading.fsr1).text}
                      </td>
                      <td className="py-2">{reading.fsr2}</td>
                      <td className={`py-2 ${getStatus(reading.fsr2).color}`}>
                        {getStatus(reading.fsr2).text}
                      </td>
                      <td className="py-2">{reading.fsr3}</td>
                      <td className={`py-2 ${getStatus(reading.fsr3).color}`}>
                        {getStatus(reading.fsr3).text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4">No readings available</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

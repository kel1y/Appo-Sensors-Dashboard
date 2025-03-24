import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ESP32 FSR Sensor Dashboard",
  description: "Monitor and visualize FSR sensor data from ESP32",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="border-b">
            <div className="container mx-auto py-4 px-4 flex justify-between items-center">
              <Link href="/" className="font-bold text-xl">
                ESP32 Dashboard
              </Link>
              <nav className="flex gap-4">
                <Link href="/" className="hover:underline">
                  Dashboard
                </Link>
                <Link href="/test" className="hover:underline">
                  Test
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
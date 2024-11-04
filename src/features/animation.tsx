"use client"

import { useEffect, useState } from "react"

export default function Animation() {
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    const generateBars = () => {
      const newBars = Array.from({ length: 20 }, () => Math.random() * 100)
      setBars(newBars)
    }

    generateBars()
    const interval = setInterval(generateBars, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end justify-between h-32">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 mx-1 bg-blue-500 dark:bg-blue-400 rounded-t"
          style={{
            height: `${height}%`,
            transition: "height 0.5s ease-in-out"
          }}
        />
      ))}
    </div>
  )
}

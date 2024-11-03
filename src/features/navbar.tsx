import { CircleHelp } from "lucide-react"
import React from "react"

const navbar = () => {
  return (
    <div className="flex items-center justify-between border-b-2 py-5 px-6 w-screen z-10 bg-white">
      <p className="text-gray-400 text-md font-bold">D-VOICE</p>
      <button className="">
        {" "}
        <CircleHelp className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  )
}

export default navbar

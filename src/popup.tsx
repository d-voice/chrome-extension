import Navbar from "~features/navbar"
import VoiceRecorder from "~features/voice-record"

import "~style.css"

function IndexPopup() {
  return (
    <div className="flex flex-col items-center min-h-[550px] w-80 ">
      <div className="-z-10 dot"></div>
      <Navbar />
      <VoiceRecorder />
      <div className="flex flex-col item-center justify-center px-5 w-screen">
        <h1 className="text-center font-bold text-2xl text-gray-500 ">
          Tell us what do you want to access!
        </h1>
        <p className="text-center text-gray-400 py-5">
          Our, AI supported extensions help about current web pages
        </p>
      </div>
    </div>
  )
}

export default IndexPopup

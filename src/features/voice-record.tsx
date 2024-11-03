"use client"

import { Download, Mic, Square } from "lucide-react"
import { useCallback, useRef, useState } from "react"

import { getCurrentBody } from "~utils/getBody"

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        setAudioBlob(audioBlob)
        audioChunks.current = []
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Mikrofon erişimi reddedildi. Lütfen izin verin.")
      } else {
        setError("Mikrofon erişim hatası: " + err.message)
      }
      console.error("Error accessing microphone:", err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }

    const body = getCurrentBody()
    console.log(body)
    console.log
  }, [isRecording])

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center self-center p-10">
      <button
        onClick={handleButtonClick}
        className={`w-32 h-32 rounded-full focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-colors duration-200 ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}>
        {isRecording ? (
          <Square className="w-16 h-16 text-white mx-auto" />
        ) : (
          <Mic className="w-16 h-16 text-white mx-auto" />
        )}
      </button>

      {audioUrl && !isRecording && (
        <a
          href={audioUrl}
          download="recorded_audio.wav"
          className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-200">
          <Download className="w-5 h-5 mr-2" />
          Download Recording
        </a>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

import { Mic, Square } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { BackendService } from "~services/BackendService"

import Animation from "./animation"

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const [manifestData, setManifestData] = useState<string | null>(null)
  const [resultAudioUrl, setResultAudioUrl] = useState<string | null>(null)
  const backendService = new BackendService()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)
        audioChunks.current = []

        // setAudioBlob çağrısını bekleyip stopRecording işlemini çağır
        await stopRecording(audioBlob)
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

  const stopRecording = useCallback(async (blob?: Blob) => {
    setIsRecording(false)
    if (mediaRecorder.current && blob) {
      console.log("Sending to backend...")
      const resp = await sendToBackground({
        name: "ping"
      })

      setManifestData(resp.message)

      if (blob && resp.message) {
        const resultBlob = await backendService.voiceToAnswer({
          AudioBlob: blob,
          WebBody: resp.message
        })

        // Yanıtı Blob olarak aldığımız için URL.createObjectURL ile URL oluşturuyoruz
        const audioUrl = URL.createObjectURL(resultBlob)
        setResultAudioUrl(audioUrl)
      } else {
        console.error("AudioBlob veya manifestData mevcut değil.")
        console.log(blob, resp.message)
      }
    }
  }, [])

  const handleButtonClick = () => {
    if (isRecording) {
      mediaRecorder.current?.stop()
    } else {
      startRecording()
    }
  }

  // resultAudioUrl değiştiğinde sesi otomatik olarak oynatmak için
  useEffect(() => {
    if (resultAudioUrl) {
      const audio = new Audio(resultAudioUrl)
      audio.play()

      // Sesi oynatmayı bitirdikten sonra URL'yi serbest bırakıyoruz
      audio.onended = () => {
        URL.revokeObjectURL(resultAudioUrl)
        setResultAudioUrl(null)
      }
    }
  }, [resultAudioUrl])

  return (
    <div className="flex flex-col items-center justify-center self-center p-10">
      {!resultAudioUrl ? (
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
      ) : (
        <Animation />
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

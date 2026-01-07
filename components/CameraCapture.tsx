'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Camera } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void
  disabled?: boolean
}

export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Countdown timer effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const base64Image = canvas.toDataURL('image/jpeg', 0.8)
          setCapturedImage(base64Image)
          if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
          }
        }
      }
      setCountdown(null)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [countdown, stream])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Failed to access camera. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setCountdown(null)
  }, [stream])

  const startAutoCapture = useCallback(() => {
    setCountdown(3)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    
    // Convert to base64 with compression
    const base64Image = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(base64Image)
    stopCamera()
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const handleClose = useCallback(() => {
    stopCamera()
    setCapturedImage(null)
    setError(null)
    setIsOpen(false)
  }, [stopCamera])

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
      handleClose()
    }
  }, [capturedImage, onCapture, handleClose])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    startCamera()
  }, [startCamera])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleOpen}
        disabled={disabled}
        title="Take photo"
      >
        <Camera className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleClose()
      }} modal={false}>
        <DialogContent 
          className="max-w-sm fixed bottom-4 left-1/2 -translate-x-1/2 translate-y-0 top-auto right-auto p-4 bg-white/15 border-white/20"
          hideOverlay={true}
        >
          <DialogHeader>
            <DialogTitle className="text-base text-gray-800">
              {capturedImage ? 'Preview Photo' : 'Take Photo'}
            </DialogTitle>
          </DialogHeader>

          <div className="relative bg-black/15 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', maxHeight: '240px' }}>
            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded">
                  {error}
                </div>
              </div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-black/50 rounded-full w-20 h-20 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{countdown}</span>
                </div>
              </div>
            )}

            {!capturedImage && !error && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-15"
              />
            )}

            {capturedImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover opacity-15"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter className="flex gap-1.5">
            {!capturedImage && !error && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={startAutoCapture}
                  disabled={!stream || countdown !== null}
                >
                  {countdown !== null ? `${countdown}s` : '3s'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={capturePhoto}
                  disabled={!stream || countdown !== null}
                >
                  Capture
                </Button>
              </>
            )}

            {capturedImage && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={retakePhoto}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={confirmPhoto}
                >
                  Send
                </Button>
              </>
            )}

            {error && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

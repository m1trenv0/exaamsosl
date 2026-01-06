'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Camera, X, Image as ImageIcon } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void
  disabled?: boolean
}

export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
  }, [stream])

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

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
      handleClose()
    }
  }, [capturedImage, onCapture])

  const handleClose = useCallback(() => {
    stopCamera()
    setCapturedImage(null)
    setError(null)
    setIsOpen(false)
  }, [stopCamera])

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
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {capturedImage ? 'Preview Photo' : 'Take Photo'}
            </DialogTitle>
          </DialogHeader>

          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded">
                  {error}
                </div>
              </div>
            )}

            {!capturedImage && !error && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter className="flex gap-2">
            {!capturedImage && !error && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!stream}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </>
            )}

            {capturedImage && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={retakePhoto}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  onClick={confirmPhoto}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Send Photo
                </Button>
              </>
            )}

            {error && (
              <Button
                type="button"
                variant="outline"
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

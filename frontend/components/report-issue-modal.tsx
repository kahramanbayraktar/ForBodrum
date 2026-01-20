"use client"

import { useState } from "react"
import { X, Camera, Upload, MapPin, Sparkles, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReportIssueModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 1 | 2 | 3 | 4

export function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [detectedTags, setDetectedTags] = useState<string[]>([])
  const [description, setDescription] = useState("")

  const handlePhotoCapture = () => {
    setHasPhoto(true)
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setDetectedTags(["Pothole", "Road Damage", "High Severity"])
      setIsAnalyzing(false)
      setStep(2)
    }, 2000)
  }

  const handleClose = () => {
    setStep(1)
    setHasPhoto(false)
    setDetectedTags([])
    setDescription("")
    onClose()
  }

  const handleSubmit = () => {
    // Handle submission
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
          <X className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-lg">Report Issue</h1>
        <div className="w-10" />
      </header>

      {/* Progress */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                s <= step ? "bg-bougainvillea" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of 4: {
            step === 1 ? "Capture Photo" :
            step === 2 ? "AI Analysis" :
            step === 3 ? "Confirm Location" :
            "Add Description"
          }
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {step === 1 && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            {!hasPhoto ? (
              <>
                <div className="w-full aspect-[4/3] bg-muted rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/30">
                  <Camera className="w-16 h-16 text-muted-foreground" />
                  <p className="text-muted-foreground text-center px-4">
                    Take a photo or upload an image of the issue
                  </p>
                </div>
                <div className="flex gap-3 mt-6 w-full">
                  <Button 
                    onClick={handlePhotoCapture}
                    className="flex-1 h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handlePhotoCapture}
                    className="flex-1 h-14 bg-transparent"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full aspect-[4/3] bg-muted rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-bougainvillea" />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
                <div className="relative">
                  <Sparkles className="w-12 h-12 text-bougainvillea animate-pulse" />
                </div>
                <p className="text-muted-foreground">Analyzing image with AI...</p>
              </div>
            ) : (
              <>
                {/* Photo preview */}
                <div className="w-full aspect-video bg-muted rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🛣️</span>
                </div>

                {/* AI Results */}
                <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-bougainvillea" />
                    <span className="font-semibold">AI Analysis</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detectedTags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-card"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tap tags to edit or add more details
                  </p>
                </div>

                <Button 
                  onClick={() => setStep(3)}
                  className="w-full h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white"
                >
                  Confirm Tags
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {/* Mini Map */}
            <div className="w-full aspect-video bg-aegean-light/20 rounded-2xl relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, var(--bodrum-blue) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--bodrum-blue) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <MapPin className="w-10 h-10 text-bougainvillea" />
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-bodrum-blue mt-0.5" />
                <div>
                  <p className="font-semibold">Detected Location</p>
                  <p className="text-sm text-muted-foreground">
                    Barlar Sokak 42, Bodrum Center
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStep(4)}
              className="w-full h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white"
            >
              Confirm Location
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block font-semibold mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details about the issue..."
                className="w-full h-32 p-4 rounded-xl bg-secondary/50 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-bougainvillea"
              />
            </div>

            {/* Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="secondary">Pothole</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Severity:</span>
                  <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">Location:</span>
                  <span>Barlar Sokak 42, Bodrum Center</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white text-lg font-semibold"
            >
              Send Report
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

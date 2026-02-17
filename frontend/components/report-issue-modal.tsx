import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Camera, ChevronRight, Loader2, MapPin, Navigation, Sparkles, Upload, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ReportIssueModalProps {
  isOpen: boolean
  onClose: () => void
  dictionary?: any
  lang?: string
}

type Step = 1 | 2 | 3 | 4

export function ReportIssueModal({ isOpen, onClose, dictionary, lang = "en" }: ReportIssueModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [detectedTags, setDetectedTags] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [isLocating, setIsLocating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setHasPhoto(true)
    setIsAnalyzing(true)
    
    const formData = new FormData()
    formData.append("file", file)
    if (lang) {
      formData.append("lang", lang)
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Analysis failed")
      
      const data = await res.json()
      setAnalysisData(data)
      setDetectedTags(data.detectedTags || [])
      
      // Auto-fill description if empty
      if (!description) {
        setDescription(data.description || "")
      }
      
      setIsAnalyzing(false)
      setStep(2)
    } catch (error) {
      console.error(error)
      setIsAnalyzing(false)
      // TODO: Show error toast
    }
  }

  const handleLocate = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
            const data = await response.json()
            
            // Format address: Street, District, City
            const address = data.address
            const formattedAddress = [
              address.road || address.pedestrian,
              address.suburb || address.quarter || address.neighbourhood,
              address.city || address.town
            ].filter(Boolean).join(", ")

            setLocation(formattedAddress || "Bodrum, Muğla")
            setIsLocating(false)
          } catch (error) {
            console.error("Reverse geocoding failed:", error)
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
            setIsLocating(false)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
          setLocation("Location detection failed. Please enter manually.")
        }
      )
    } else {
      console.error("Geolocation is not supported")
      setIsLocating(false)
      setLocation("Geolocation is not supported by your browser")
    }
  }

  // Trigger location detection when reaching step 3
  useEffect(() => {
    if (step === 3 && !location) {
      handleLocate()
    }
  }, [step, location])

  const handleClose = () => {
    setStep(1)
    setHasPhoto(false)
    setDetectedTags([])
    setDescription("")
    setAnalysisData(null)
    setPreviewUrl("")
    onClose()
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: analysisData?.title || detectedTags[0] || "New Issue Report",
          location: location || "Unknown Location",
          category: analysisData?.category || (detectedTags.includes("Pothole") ? "Infrastructure" : "General"),
          description: description,
          severity: analysisData?.severity || "Medium",
          detectedTags: detectedTags,
          imageUrl: analysisData?.imageUrl || previewUrl // SQL'e gidecek kalıcı URL
        }),
      })

      if (response.ok) {
        handleClose()
        window.location.reload() 
      }
    } catch (error) {
      console.error('Failed to submit issue:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] bg-background md:bg-black/80 md:backdrop-blur-sm md:flex md:items-center md:justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div 
        className="w-full h-full md:h-auto md:max-h-[85vh] md:w-[500px] bg-background md:rounded-2xl md:shadow-2xl md:overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
          <X className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-lg">{dictionary?.report_modal?.title || "Report Issue"}</h1>
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
            step === 1 ? (dictionary?.report_modal?.step_1 || "Capture Photo") :
            step === 2 ? (dictionary?.report_modal?.step_2 || "AI Analysis") :
            step === 3 ? (dictionary?.report_modal?.step_3 || "Confirm Location") :
            (dictionary?.report_modal?.step_4 || "Add Description")
          }
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {step === 1 && (
          <div className="flex flex-col items-center justify-center py-2">
            {!hasPhoto ? (
              <>
                <div 
                  className="w-full aspect-video bg-muted rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={handleFileSelect}
                >
                  <Camera className="w-16 h-16 text-muted-foreground" />
                  <p className="text-muted-foreground text-center px-4">
                    {dictionary?.report_modal?.upload_instruction || "Take a photo or upload an image of the issue"}
                  </p>
                </div>
                <div className="flex gap-3 mt-6 w-full">
                  <Button 
                    onClick={handleFileSelect}
                    className="flex-1 h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {dictionary?.report_modal?.take_photo || "Take Photo"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleFileSelect}
                    className="flex-1 h-14 bg-transparent"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {dictionary?.report_modal?.upload || "Upload"}
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
                <p className="text-muted-foreground">{dictionary?.report_modal?.analyzing || "Analyzing image with AI..."}</p>
              </div>
            ) : (
              <>
                {/* Photo preview */}
                <div className="w-full aspect-video bg-muted rounded-2xl flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Issue preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🛣️</span>
                  )}
                </div>

                {/* AI Results */}
                <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-bougainvillea" />
                    <span className="font-semibold">{dictionary?.report_modal?.analysis_result || "AI Analysis Result"}</span>
                  </div>
                  
                  {analysisData && (
                     <div className="mb-2">
                        <h3 className="font-bold text-lg">{analysisData.title}</h3>
                        <p className="text-sm text-muted-foreground">{analysisData.description}</p>
                     </div>
                  )}

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
                </div>

                <Button 
                  onClick={() => setStep(3)}
                  className="w-full h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white"
                >
                  {dictionary?.report_modal?.confirm_continue || "Confirm & Continue"}
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
                <div className="flex-1">
                  <p className="font-semibold">{dictionary?.report_modal?.detected_location || "Detected Location"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isLocating ? (
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Locating...
                      </span>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {location || "Location not found"}
                      </p>
                    )}
                  </div>
                  {!isLocating && (
                    <Button 
                      variant="link" 
                      onClick={handleLocate}
                      className="h-auto p-0 text-xs text-bodrum-blue mt-1"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Retry Location
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStep(4)}
              className="w-full h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white"
            >
              {dictionary?.report_modal?.confirm_location || "Confirm Location"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block font-semibold mb-2">
                {dictionary?.report_modal?.description_label || "Description (optional)"}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={dictionary?.report_modal?.description_placeholder || "Add any additional details about the issue..."}
                className="w-full h-32 p-4 rounded-xl bg-secondary/50 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-bougainvillea"
              />
            </div>

            {/* Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold">{dictionary?.report_modal?.summary || "Summary"}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{dictionary?.report_modal?.category || "Category"}:</span>
                  <Badge variant="secondary">{analysisData?.category || "General"}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{dictionary?.report_modal?.severity || "Severity"}:</span>
                  <Badge className="bg-red-100 text-red-800 border-red-200">{analysisData?.severity || "Medium"}</Badge>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">{dictionary?.report_modal?.location || "Location"}:</span>
                  <span className="text-muted-foreground">{dictionary?.report_modal?.location || "Location"}:</span>
                  <span>{location}</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full h-14 bg-bougainvillea hover:bg-bougainvillea/90 text-white text-lg font-semibold"
            >
              {dictionary?.report_modal?.send_report || "Send Report"}
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

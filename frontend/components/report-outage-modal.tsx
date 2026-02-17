"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertTriangle, Clock, MapPin, Navigation, X, Zap } from "lucide-react"
import { useState } from "react"

interface ReportOutageModalProps {
  isOpen: boolean
  onClose: () => void
  dictionary?: any
}

export function ReportOutageModal({ isOpen, onClose, dictionary }: ReportOutageModalProps) {
  const [district, setDistrict] = useState("")
  const [street, setStreet] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  const handleLocateMe = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would reverse geocode these coordinates to get the address
          console.log(position.coords)
          // Mock data for demo
          setDistrict("Merkez Mahallesi")
          setStreet("Atatürk Caddesi")
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLocating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ district, street, startTime, endTime })
    onClose()
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
        <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-amber-50/50">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h1 className="font-bold text-lg text-amber-900">{dictionary?.outage_modal?.title || "Report Power Outage"}</h1>
          </div>
          <div className="w-10" />
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div className="bg-amber-100/50 p-4 rounded-xl border border-amber-200">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-900">
                  {dictionary?.outage_modal?.info_text || "Please provide accurate location and timing details to help us track the outage effectively."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{dictionary?.outage_modal?.location_details || "Location Details"}</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="h-8 text-xs gap-1.5"
                >
                  <Navigation className={cn("w-3 h-3", isLocating && "animate-spin")} />
                  {isLocating ? (dictionary?.outage_modal?.locating || "Locating...") : (dictionary?.outage_modal?.use_my_location || "Use My Location")}
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">{dictionary?.outage_modal?.district || "District (Mahalle)"} <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="district"
                      placeholder={dictionary?.outage_modal?.district_placeholder || "e.g. Gümbet"}
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">{dictionary?.outage_modal?.street || "Street / Avenue (Optional)"}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="street"
                      placeholder={dictionary?.outage_modal?.street_placeholder || "e.g. Adnan Menderes Cd."}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">{dictionary?.outage_modal?.outage_timing || "Outage Timing"}</Label>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">{dictionary?.outage_modal?.start_time || "Start Time"} <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">{dictionary?.outage_modal?.end_time || "Expected End Time (Optional)"}</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white"
            >
              {dictionary?.outage_modal?.submit || "Submit Report"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

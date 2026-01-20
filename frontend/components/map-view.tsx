"use client"

import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

const issueMarkers = [
  { id: 1, type: "infrastructure", top: "30%", left: "45%", label: "Pothole" },
  { id: 2, type: "environment", top: "55%", left: "65%", label: "Trash" },
  { id: 3, type: "infrastructure", top: "40%", left: "25%", label: "Street Light" },
  { id: 4, type: "environment", top: "65%", left: "40%", label: "Graffiti" },
  { id: 5, type: "infrastructure", top: "25%", left: "70%", label: "Broken Bench" },
]

export function MapView() {
  return (
    <div className="relative w-full h-full bg-aegean-light/20">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-aegean-light/10 to-aegean-light/30">
        {/* Grid pattern to simulate map */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--bodrum-blue) 1px, transparent 1px),
              linear-gradient(to bottom, var(--bodrum-blue) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Simulated streets */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-card/60" />
        <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-card/60" />
        <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-card/60" />
        <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-card/40" />
        <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-card/40" />
      </div>

      {/* Issue Markers */}
      {issueMarkers.map((marker) => (
        <button
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-full group"
          style={{ top: marker.top, left: marker.left }}
          aria-label={`Issue: ${marker.label}`}
        >
          <div className={`
            relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg
            ${marker.type === 'infrastructure' ? 'bg-bodrum-blue' : 'bg-bougainvillea'}
            transition-transform group-hover:scale-110 group-active:scale-95
          `}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-card rounded text-xs font-medium whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {marker.label}
          </div>
        </button>
      ))}

      {/* Current Location Button */}
      <Button
        size="icon"
        className="absolute bottom-32 right-4 w-12 h-12 rounded-full bg-card text-bodrum-blue shadow-lg border border-border"
        aria-label="Center on my location"
      >
        <Navigation className="w-5 h-5" />
      </Button>

      {/* Location indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-bodrum-blue border-2 border-white shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-bodrum-blue/30 animate-ping" />
        </div>
      </div>
    </div>
  )
}

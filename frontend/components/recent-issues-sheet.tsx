"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { AlertCircle, CheckCircle2, ChevronUp, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface Issue {
  id: string
  title: string
  location: string
  status: "pending" | "in-progress" | "fixed"
  category: string
  createdAt: string
  severity?: string
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  fixed: {
    label: "Fixed",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 border-green-200",
  },
}

export function RecentIssuesSheet() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues')
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Poll for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchIssues, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className={cn(
        "fixed bottom-16 left-0 right-0 bg-card rounded-t-3xl shadow-2xl transition-all duration-300 ease-out z-40",
        "md:absolute md:top-4 md:left-4 md:bottom-auto md:right-auto md:w-96 md:h-auto md:max-h-[calc(100vh-2rem)] md:rounded-xl",
        isExpanded ? "h-[60vh]" : "h-48 md:h-auto"
      )}
    >
      {/* Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col items-center pt-3 pb-2 md:hidden"
        aria-label={isExpanded ? "Collapse issues panel" : "Expand issues panel"}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
        <ChevronUp 
          className={cn(
            "w-5 h-5 text-muted-foreground mt-1 transition-transform",
            isExpanded && "rotate-180"
          )} 
        />
      </button>

      {/* Header */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-foreground">Recent Issues Near You</h2>
        <span className="text-sm text-muted-foreground">{issues.length} issues</span>
      </div>

      {/* Issues List */}
      <div className={cn(
        "overflow-y-auto px-4",
        isExpanded ? "h-[calc(60vh-100px)]" : "h-24 md:h-[calc(100vh-10rem)]"
      )}>
        <div className="space-y-3 pb-4">
          {isLoading ? (
             <div className="text-center py-4 text-muted-foreground">Loading issues...</div>
          ) : issues.map((issue) => {
            const status = statusConfig[issue.status] || statusConfig.pending
            const StatusIcon = status.icon
            
            return (
              <button
                key={issue.id}
                className="w-full flex items-start gap-3 p-3 bg-secondary/50 rounded-xl text-left transition-colors hover:bg-secondary active:bg-secondary/80"
              >
                {/* Thumbnail placeholder */}
                <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                  <span className="text-2xl">
                    {issue.category === "Infrastructure" ? "🛣️" : "🌳"}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-foreground line-clamp-1">
                      {issue.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {issue.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs px-2 py-0.5 font-medium", status.className)}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {issue.category}
                    </Badge>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

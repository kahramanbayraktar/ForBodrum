"use client"

import { Map, Vote, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onReportClick: () => void
}

export function BottomNavigation({ activeTab, onTabChange, onReportClick }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Map", icon: Map },
    { id: "report", label: "Report", icon: Plus, isCenter: true },
    { id: "actions", label: "Actions", icon: Vote },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab, index) => {
          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={onReportClick}
                className="relative -mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-bougainvillea text-white shadow-lg shadow-bougainvillea/30 active:scale-95 transition-transform"
                aria-label="Report new issue"
              >
                <Plus className="w-7 h-7" strokeWidth={2.5} />
              </button>
            )
          }
          
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isBeforeCenter = index < 1
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[64px] transition-colors",
                isActive ? "text-bodrum-blue" : "text-muted-foreground",
                isBeforeCenter ? "order-first" : ""
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

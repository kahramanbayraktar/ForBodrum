"use client"

import { cn } from "@/lib/utils"
import { Home, Map, Plus, User, Vote } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onReportClick: () => void
  dictionary: any
}

export function BottomNavigation({ activeTab, onTabChange, onReportClick, dictionary }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: dictionary.menu.home, icon: Home },
    { id: "map", label: dictionary.menu.map, icon: Map },
    { id: "report", label: dictionary.common.report, icon: Plus, isCenter: true },
    { id: "actions", label: dictionary.menu.actions, icon: Vote },
    { id: "profile", label: dictionary.menu.profile, icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 mx-auto">
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
          const isBeforeCenter = index < 2
          
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

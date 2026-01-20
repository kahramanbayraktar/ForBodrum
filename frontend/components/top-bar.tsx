"use client"

import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

interface TopBarProps {
  notificationCount?: number
}

export function TopBar({ notificationCount = 0 }: TopBarProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border safe-area-top">
      <div className="flex items-center justify-between h-14 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-bodrum-blue flex items-center justify-center">
            <span className="text-white font-bold text-sm">FB</span>
          </div>
          <span className="font-serif font-bold text-xl text-bodrum-blue tracking-tight">ForBodrum</span>
        </div>
        
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5 text-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-bougainvillea text-white text-xs font-bold flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Map, Plus, User, Vote } from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onReportClick: () => void
}

export function Sidebar({ activeTab, onTabChange, onReportClick }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Map Overview", icon: Map },
    { id: "actions", label: "Civic Actions", icon: Vote },
    { id: "profile", label: "My Profile", icon: User },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-bodrum-blue flex items-center justify-center">
          <span className="text-white font-bold text-sm">FB</span>
        </div>
        <span className="font-serif font-bold text-xl text-bodrum-blue tracking-tight">ForBodrum</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button 
          onClick={onReportClick}
          className="w-full bg-bougainvillea hover:bg-bougainvillea/90 text-white shadow-md mb-6 h-12 justify-start px-4 text-base"
        >
          <Plus className="w-5 h-5 mr-3" />
          Report Issue
        </Button>

        <div className="space-y-1">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-bodrum-blue/10 text-bodrum-blue" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer / User Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Citizen #4821</p>
            <p className="text-xs text-muted-foreground truncate">Impact Score: 850</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

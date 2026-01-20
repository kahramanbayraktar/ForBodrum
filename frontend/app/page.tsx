"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { MapView } from "@/components/map-view"
import { RecentIssuesSheet } from "@/components/recent-issues-sheet"
import { ReportIssueModal } from "@/components/report-issue-modal"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <TopBar notificationCount={3} />
      
      <main className="pt-14 pb-16 h-screen">
        <MapView />
        <RecentIssuesSheet />
      </main>

      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReportClick={() => setIsReportModalOpen(true)}
      />

      <ReportIssueModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  )
}

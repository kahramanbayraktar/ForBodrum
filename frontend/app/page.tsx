"use client"

import { BottomNavigation } from "@/components/bottom-navigation"
import { MapView } from "@/components/map-view"
import { RecentIssuesSheet } from "@/components/recent-issues-sheet"
import { ReportIssueModal } from "@/components/report-issue-modal"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { useState } from "react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <TopBar notificationCount={3} />
      
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReportClick={() => setIsReportModalOpen(true)}
      />
      
      <main className="pt-14 pb-16 md:pt-0 md:pb-0 md:ml-64 h-screen relative">
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

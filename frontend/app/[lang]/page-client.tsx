"use client"

import { BottomNavigation } from "@/components/bottom-navigation"
import { MapView } from "@/components/map-view"
import { RecentIssuesSheet } from "@/components/recent-issues-sheet"
import { ReportIssueModal } from "@/components/report-issue-modal"
import { ReportOutageModal } from "@/components/report-outage-modal"
import { ServicesSection } from "@/components/services-section"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { useState } from "react"

export default function PageClient({ dictionary, lang }: { dictionary: any; lang: string }) {
  const [activeTab, setActiveTab] = useState("home")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isOutageModalOpen, setIsOutageModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <TopBar notificationCount={3} dictionary={dictionary} />
      
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReportClick={() => setIsReportModalOpen(true)}
        dictionary={dictionary}
      />
      
      <main className="pt-14 pb-16 md:pt-0 md:pb-0 md:ml-64 h-screen relative">
        {activeTab === "home" && (
          <ServicesSection 
            onReportClick={() => setIsReportModalOpen(true)} 
            onMapClick={() => setActiveTab("map")}
            onOutageClick={() => setIsOutageModalOpen(true)}
            dictionary={dictionary}
          />
        )}
        
        {activeTab === "map" && (
          <>
            <MapView dictionary={dictionary} />
            <RecentIssuesSheet dictionary={dictionary} />
          </>
        )}
      </main>

      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReportClick={() => setIsReportModalOpen(true)}
        dictionary={dictionary}
      />

      <ReportIssueModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        dictionary={dictionary}
        lang={lang}
      />

      <ReportOutageModal 
        isOpen={isOutageModalOpen}
        onClose={() => setIsOutageModalOpen(false)}
        dictionary={dictionary}
      />
    </div>
  )
}

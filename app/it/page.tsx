"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Zap, Bell, Plus } from "lucide-react"
import LazyTicketCard from "@/components/it/lazy-ticket-card"
import DashboardOverview from "@/components/it/dashboard-overview"
import { getTickets } from "@/lib/ticket-data"
import type { Ticket } from "@/lib/types"
import TicketIcon from "@/components/it/ticket-icon"
import { requestNotificationPermission } from "@/lib/notification"
import { Spinner } from "@/components/ui/spinner"
import AddCommonIssueModal from "@/components/it/add-common-issue-modal"

export default function ITDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "software" | "hardware">("all")
  const [refreshKey, setRefreshKey] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showAddIssueModal, setShowAddIssueModal] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initial load - show loading spinner
  useEffect(() => {
    const loadTickets = () => {
      setTickets(getTickets())
      setIsInitialLoading(false)
    }
    
    // Small delay for initial load only
    const timeout = setTimeout(loadTickets, 200)
    
    return () => clearTimeout(timeout)
  }, [])

  // Background refresh - update silently without showing loading
  useEffect(() => {
    if (isInitialLoading) return // Don't refresh until initial load is done
    
    const interval = setInterval(() => {
      // Silently update tickets in background without showing loading state
      setTickets(getTickets())
      setRefreshKey((prev) => prev + 1)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isInitialLoading])

  useEffect(() => {
    if (isMounted && typeof window !== "undefined" && "Notification" in window) {
      const permission = Notification.permission
      setHasNotificationPermission(permission === "granted")
      setShowNotificationPrompt(permission !== "granted")
    }
  }, [isMounted])

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setHasNotificationPermission(granted)
    setShowNotificationPrompt(false)
  }

  const filteredTickets = useMemo(() => {
    let allTickets = getTickets()

    if (activeTab !== "overview") {
      allTickets = allTickets.filter((t) => {
        if (categoryFilter === "software") return t.issueCategory === "software"
        if (categoryFilter === "hardware") return t.issueCategory === "hardware"
        return true
      })
    }

    if (activeTab === "all") return allTickets
    if (activeTab === "overview") return allTickets
    return allTickets.filter((t) => t.status === activeTab)
  }, [activeTab, categoryFilter, refreshKey])

  const handleTicketUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const statusCounts = useMemo(() => {
    // Only calculate counts after component mounts (client-side only)
    if (!isMounted) {
      return {
        all: 0,
        open: 0,
        assigned: 0,
        "in-progress": 0,
        "waiting-external": 0,
        resolved: 0,
        closed: 0,
      }
    }
    
    const all = getTickets()
    return {
      all: all.length,
      open: all.filter((t) => t.status === "open").length,
      assigned: all.filter((t) => t.status === "assigned").length,
      "in-progress": all.filter((t) => t.status === "in-progress").length,
      "waiting-external": all.filter((t) => t.status === "waiting-external").length,
      resolved: all.filter((t) => t.status === "resolved").length,
      closed: all.filter((t) => t.status === "closed").length,
    }
  }, [refreshKey, isMounted])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">IT Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Manage support requests</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddIssueModal(true)}
                className="gap-2 hover:bg-primary/10 rounded-lg bg-transparent"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Common Issue</span>
              </Button>
              {isMounted && showNotificationPrompt && typeof window !== "undefined" && "Notification" in window && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnableNotifications}
                  className="gap-2 hover:bg-primary/10 rounded-lg bg-transparent"
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
              )}
              {isMounted && hasNotificationPermission && (
                <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 rounded-lg">
                  <Bell className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary hidden sm:inline">On</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 hover:bg-destructive/10 hover:text-destructive rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="bg-card rounded-lg p-1.5 border border-border inline-flex gap-1 overflow-x-auto flex-wrap shadow-sm">
            {[
              { id: "overview", label: "Overview", icon: Zap },
              { id: "all", label: `All (${statusCounts.all})` },
              { id: "open", label: `Open (${statusCounts.open})` },
              { id: "assigned", label: `Assigned (${statusCounts.assigned})` },
              { id: "in-progress", label: `In Progress (${statusCounts["in-progress"]})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.id === "overview" && <Zap className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== "overview" && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as "all" | "software" | "hardware")}
              className="select-modern"
            >
              <option value="all">All Categories</option>
              <option value="software">Software Issues</option>
              <option value="hardware">Hardware Issues</option>
            </select>
          )}
        </div>

        {activeTab === "overview" ? (
          <div className="animate-fade-in">
            <DashboardOverview />
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {isInitialLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Spinner className="w-12 h-12 text-primary" />
                  <p className="text-muted-foreground font-medium">Loading tickets...</p>
                </div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-muted rounded-full mb-4">
                  <TicketIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-foreground text-lg font-medium">No tickets in this category</p>
                <p className="text-muted-foreground text-sm mt-1">Check back soon for new support requests</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <LazyTicketCard key={ticket.id} ticket={ticket} onUpdate={handleTicketUpdate} />
              ))
            )}
          </div>
        )}
      </main>

      <AddCommonIssueModal
        isOpen={showAddIssueModal}
        onClose={() => setShowAddIssueModal(false)}
        onAdd={() => {
          // Refresh if needed
        }}
      />
    </div>
  )
}

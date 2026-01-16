"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Zap, Bell, Plus, AlertCircle } from "lucide-react"
import LazyTicketCard from "@/components/it/lazy-ticket-card"
import DashboardOverview from "@/components/it/dashboard-overview"
import { getTickets } from "@/lib/ticket-data"
import type { Ticket } from "@/lib/types"
import TicketIcon from "@/components/it/ticket-icon"
import { requestNotificationPermission } from "@/lib/notification"
import { Spinner } from "@/components/ui/spinner"
import AddCommonIssueModal from "@/components/it/add-common-issue-modal"

// 15 minutes in milliseconds
const OVERDUE_THRESHOLD = 15 * 60 * 1000

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

  // Track notified tickets to avoid spam
  const notifiedTicketIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initial load
  useEffect(() => {
    const loadTickets = () => {
      setTickets(getTickets())
      setIsInitialLoading(false)
    }
    const timeout = setTimeout(loadTickets, 200)
    return () => clearTimeout(timeout)
  }, [])

  // Background refresh & Notifications
  useEffect(() => {
    if (isInitialLoading) return

    const checkOverdueAndNotify = (currentTickets: Ticket[]) => {
      if (!("Notification" in window) || Notification.permission !== "granted") return

      const now = Date.now()
      const newOverdueTickets = currentTickets.filter(t => {
        const isOverdue = now - new Date(t.createdAt).getTime() > OVERDUE_THRESHOLD
        const isActive = t.status !== "resolved" && t.status !== "closed"
        const notNotified = !notifiedTicketIds.current.has(t.id)
        return isOverdue && isActive && notNotified
      })

      if (newOverdueTickets.length > 0) {
        // Play sound
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU") // Short beep placeholder or real file
          // Simple beep using AudioContext is better but for now let's rely on Notification sound
          // or just the visual notification
        } catch (e) { }

        newOverdueTickets.forEach(t => {
          new Notification("Overdue Ticket Alert", {
            body: `Ticket ${t.id} has been waiting for more than 15 minutes!`,
            icon: "/favicon.ico"
          })
          notifiedTicketIds.current.add(t.id)
        })
      }
    }

    const interval = setInterval(() => {
      const currentTickets = getTickets()
      setTickets(currentTickets)
      setRefreshKey((prev) => prev + 1)
      checkOverdueAndNotify(currentTickets)
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

  // Dashboard Check Helper
  const isOverdue = (ticket: Ticket) => {
    return (
      (Date.now() - new Date(ticket.createdAt).getTime() > OVERDUE_THRESHOLD) &&
      ticket.status !== "resolved" &&
      ticket.status !== "closed"
    )
  }

  const filteredTickets = useMemo(() => {
    let allTickets = getTickets()

    // Category Filter
    if (activeTab !== "overview") {
      allTickets = allTickets.filter((t) => {
        if (categoryFilter === "software") return t.issueCategory === "software"
        if (categoryFilter === "hardware") return t.issueCategory === "hardware"
        return true
      })
    }

    // Tab Filter
    if (activeTab === "all") return allTickets
    if (activeTab === "overview") return allTickets
    if (activeTab === "overdue") return allTickets.filter(isOverdue)

    return allTickets.filter((t) => t.status === activeTab)
  }, [activeTab, categoryFilter, refreshKey])

  const handleTicketUpdate = () => {
    setTickets(getTickets())
    setRefreshKey((prev) => prev + 1)
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const statusCounts = useMemo(() => {
    if (!isMounted) return { all: 0, open: 0, assigned: 0, "in-progress": 0, "waiting-external": 0, resolved: 0, closed: 0, overdue: 0 }

    const all = getTickets()
    return {
      all: all.length,
      open: all.filter((t) => t.status === "open").length,
      assigned: all.filter((t) => t.status === "assigned").length,
      "in-progress": all.filter((t) => t.status === "in-progress").length,
      "waiting-external": all.filter((t) => t.status === "waiting-external").length,
      resolved: all.filter((t) => t.status === "resolved").length,
      closed: all.filter((t) => t.status === "closed").length,
      overdue: all.filter(isOverdue).length
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
                <span className="hidden sm:inline">Add Issue</span>
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
          <div className="bg-card rounded-lg p-1.5 border border-border inline-flex gap-1 overflow-x-auto flex-wrap shadow-sm max-w-full">
            {[
              { id: "overview", label: "Overview", icon: Zap },
              { id: "overdue", label: `Overdue (${statusCounts.overdue})`, icon: AlertCircle, urgent: true },
              { id: "all", label: `All (${statusCounts.all})` },
              { id: "open", label: `Open (${statusCounts.open})` },
              { id: "assigned", label: `Assigned (${statusCounts.assigned})` },
              { id: "in-progress", label: `Progress (${statusCounts["in-progress"]})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                    ? tab.urgent
                      ? "bg-destructive text-destructive-foreground shadow-sm"
                      : "bg-primary text-primary-foreground shadow-sm"
                    : tab.urgent && statusCounts.overdue > 0
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {tab.id === "overview" && <Zap className="w-4 h-4" />}
                {tab.id === "overdue" && <AlertCircle className="w-4 h-4" />}
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
                <p className="text-foreground text-lg font-medium">No tickets found</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {activeTab === 'overdue'
                    ? "Great job! No tickets are overdue."
                    : "Check back soon for new support requests"}
                </p>
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
        onAdd={() => { }}
      />
    </div>
  )
}

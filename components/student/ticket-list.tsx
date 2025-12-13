"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTickets } from "@/lib/ticket-data"
import type { Ticket, TicketStatus } from "@/lib/types"
import { AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react"
import TicketIcon from "@/components/it/ticket-icon"
import { Spinner } from "@/components/ui/spinner"

const statusConfig: Record<
  TicketStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }
> = {
  open: {
    label: "Open",
    variant: "outline",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50",
  },
  assigned: {
    label: "Assigned",
    variant: "secondary",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50",
  },
  "in-progress": {
    label: "In Progress",
    variant: "secondary",
    icon: <Wrench className="w-4 h-4" />,
    color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50",
  },
  "waiting-external": {
    label: "External Repair",
    variant: "outline",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50",
  },
  resolved: {
    label: "Resolved",
    variant: "default",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50",
  },
  closed: {
    label: "Closed",
    variant: "default",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/50",
  },
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTickets = () => {
      const sortedTickets = getTickets().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      setTickets(sortedTickets)
      setIsLoading(false)
    }

    loadTickets()
    const interval = setInterval(loadTickets, 500)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="pt-12 pb-12">
          <div className="text-center flex flex-col items-center gap-4">
            <Spinner className="w-10 h-10 text-primary" />
            <p className="text-muted-foreground font-medium">Loading tickets...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="pt-12 pb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-muted rounded-full mb-4">
              <TicketIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground mb-2 font-medium">No tickets yet</p>
            <p className="text-muted-foreground text-sm">
              Submit a ticket to get started and track your device repairs
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => {
        const status = statusConfig[ticket.status]
        return (
          <Card
            key={ticket.id}
            className={`border-l-4 ${status.color} hover:shadow-lg transition-all duration-200 rounded-lg overflow-hidden card-hover bg-card animate-fade-in`}
            style={{
              borderLeftColor:
                ticket.status === "open"
                  ? "#ef4444"
                  : ticket.status === "assigned"
                    ? "#3b82f6"
                    : ticket.status === "in-progress"
                      ? "#eab308"
                      : ticket.status === "waiting-external"
                        ? "#a855f7"
                        : ticket.status === "resolved"
                          ? "#22c55e"
                          : "#6b7280",
              transitionDelay: `${index * 30}ms`,
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="px-3 py-1 bg-muted rounded-lg">
                      <h3 className="font-semibold text-foreground text-sm">{ticket.id}</h3>
                    </div>
                    <Badge variant={status.variant} className="gap-1 flex items-center font-medium">
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.deviceType} • {ticket.deviceIpAddress || "IP Address"}
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                  Issue Description
                </p>
                <p className="text-sm text-foreground leading-relaxed">{ticket.issueDescription}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Department", value: ticket.department },
                  { label: "Issue Type", value: ticket.issueType, capitalize: true },
                  { label: "Submitted", value: ticket.createdAt.toLocaleDateString() },
                  ...(ticket.estimatedRepairTime ? [{ label: "Est. Time", value: ticket.estimatedRepairTime }] : []),
                ].map((item, idx) => (
                  <div key={idx} className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {item.capitalize
                        ? (item.value as string).charAt(0).toUpperCase() + (item.value as string).slice(1)
                        : item.value}
                    </p>
                  </div>
                ))}
              </div>

              {ticket.instructorName && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 dark:border-blue-600/50 rounded-lg shadow-sm">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">
                    Instructor
                  </p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{ticket.instructorName}</p>
                </div>
              )}

              {ticket.isExternal && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-lg p-4 text-sm mt-4">
                  <p className="font-semibold text-orange-900 dark:text-orange-100 mb-1">External Repair</p>
                  <p className="text-orange-800 dark:text-orange-200 text-sm">
                    Repairing by {ticket.externalRepairCompany}
                    {ticket.externalTrackingNumber && ` (Tracking: ${ticket.externalTrackingNumber})`}
                  </p>
                </div>
              )}

              {ticket.notes && (
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/50 dark:border-emerald-600/50 rounded-lg p-4 text-sm mt-4 shadow-sm">
                  <p className="text-emerald-800 dark:text-emerald-200 font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                    IT Notes
                  </p>
                  <p className="text-emerald-950 dark:text-emerald-50 leading-relaxed font-medium">{ticket.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

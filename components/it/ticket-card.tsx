"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Ticket, TicketStatus, Priority } from "@/lib/types"
import { ChevronDown, AlertCircle, Download } from "lucide-react"
import UpdateTicketModal from "./update-ticket-modal"

const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400" },
  assigned: { label: "Assigned", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400",
  },
  "waiting-external": {
    label: "External Repair",
    color: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400",
  },
  resolved: { label: "Resolved", color: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400" },
  closed: { label: "Closed", color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400" },
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400" },
  high: { label: "High", color: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400" },
  critical: { label: "Critical", color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400" },
}

interface TicketCardProps {
  ticket: Ticket
  onUpdate: (updatedTicket: Ticket) => void
}

export default function TicketCard({ ticket, onUpdate }: TicketCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const isOverdue = useMemo(() => {
    if (ticket.status !== "open") return false
    const createdTime = new Date(ticket.createdAt).getTime()
    const now = new Date().getTime()
    const diffMinutes = (now - createdTime) / (1000 * 60)
    return diffMinutes > 15
  }, [ticket.status, ticket.createdAt])

  const handleDownloadReport = () => {
    if (!ticket.reportFile) return
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(ticket.reportFile.data))
    element.setAttribute("download", ticket.reportFile.name)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const status = statusConfig[ticket.status]
  const priority = ticket.priority ? priorityConfig[ticket.priority] : null

  return (
    <>
      <Card
        className={`card-hover border ${isOverdue ? "border-destructive/50 bg-destructive/5" : "border-border bg-card"} overflow-hidden animate-fade-in`}
      >
        <div
          className={`h-1 w-full ${isOverdue ? "bg-destructive" : "bg-primary"}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        ></div>
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors pt-5"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <div className="px-3 py-1 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold text-primary text-sm">{ticket.id}</h3>
                </div>
                <Badge className={`${status.color} rounded-full font-medium`}>{status.label}</Badge>
                {priority && <Badge className={`${priority.color} rounded-full font-medium`}>{priority.label}</Badge>}
                {isOverdue && (
                  <Badge className="bg-destructive text-destructive-foreground rounded-full flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> Overdue
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">{ticket.studentName}</p>
              <p className="text-xs text-muted-foreground">{ticket.studentEmail}</p>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </CardHeader>

        {expanded && (
          <CardContent className="space-y-4 border-t border-border pt-4">
            {/* Device Info */}
            <div className="space-y-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Device</p>
              <p className="text-sm font-medium text-foreground">{ticket.deviceType}</p>
              <p className="text-xs text-muted-foreground">IP Address: {ticket.deviceIpAddress}</p>
            </div>

            {/* Issue */}
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Issue Description</p>
              <p className="text-sm text-foreground leading-relaxed">
                {ticket.issueDescription || "No description provided"}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs capitalize">
                  {ticket.issueCategory}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {ticket.department}
                </Badge>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Submitted</p>
                <p className="font-medium text-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Est. Time</p>
                <p className="font-medium text-foreground">{ticket.estimatedRepairTime || "Not set"}</p>
              </div>
            </div>

            {/* Assigned Engineer */}
            {ticket.assignedEngineer && (
              <div className="space-y-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wide">
                  Assigned Engineer
                </p>
                <p className="text-sm font-medium text-foreground">
                  {ticket.assignedEngineer.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
            )}

            {/* Instructor Name */}
            {ticket.instructorName && (
              <div className="space-y-2 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 dark:border-blue-600/50 rounded-lg shadow-sm">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                  Student's Instructor
                </p>
                <p className="text-base font-bold text-blue-900 dark:text-blue-100">{ticket.instructorName}</p>
              </div>
            )}

            {/* IT Notes */}
            {ticket.internalNotes && (
              <div className="space-y-2 p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-2 border-orange-400/50 dark:border-orange-600/50 rounded-lg shadow-sm">
                <p className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                  Internal Notes
                </p>
                <p className="text-sm text-orange-950 dark:text-orange-50 leading-relaxed font-medium">
                  {ticket.internalNotes}
                </p>
              </div>
            )}

            {/* Notes for Student */}
            {ticket.notes && (
              <div className="space-y-2 p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/50 dark:border-emerald-600/50 rounded-lg shadow-sm">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                  Student Notes
                </p>
                <p className="text-sm text-emerald-950 dark:text-emerald-50 leading-relaxed font-medium">
                  {ticket.notes}
                </p>
              </div>
            )}

            {/* Report File */}
            {ticket.reportFile && (
              <div className="space-y-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wide">Report File</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-foreground truncate flex-1" title={ticket.reportFile.name}>
                    {ticket.reportFile.name}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadReport}
                    className="gap-2 bg-transparent hover:bg-secondary/20 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* External Repair Info */}
            {ticket.isExternal && (
              <div className="space-y-2 p-3 bg-orange-100 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900/50">
                <p className="text-xs font-semibold text-orange-900 dark:text-orange-300 uppercase tracking-wide">
                  External Repair
                </p>
                <p className="text-sm text-orange-900 dark:text-orange-100">Company: {ticket.externalRepairCompany}</p>
                {ticket.externalTrackingNumber && (
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    Tracking: {ticket.externalTrackingNumber}
                  </p>
                )}
              </div>
            )}

            {/* Update Button */}
            <Button
              onClick={() => setShowUpdateModal(true)}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg h-10"
            >
              Update Ticket
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Update Modal */}
      <UpdateTicketModal
        ticket={ticket}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={onUpdate}
      />
    </>
  )
}

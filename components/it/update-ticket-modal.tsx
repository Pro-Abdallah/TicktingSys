"use client"

import type React from "react"
import { useState } from "react"
import type { Ticket, TicketStatus, Priority, Engineer } from "@/lib/types"
import { updateTicket } from "@/lib/ticket-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Check, CheckCircle, X, FileText } from "lucide-react"
import { triggerCelebration } from "@/lib/celebration"

interface UpdateTicketModalProps {
  ticket: Ticket
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTicket: Ticket) => void
}

const STATUSES: TicketStatus[] = ["open", "assigned", "in-progress", "waiting-external", "resolved", "closed"]
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"]
const ENGINEERS = [
  { id: "eng-khalid", name: "Eng Khalid" },
  { id: "eng-essam", name: "Eng Essam" },
]

export default function UpdateTicketModal({ ticket, isOpen, onClose, onUpdate }: UpdateTicketModalProps) {
  const [status, setStatus] = useState(ticket.status)
  const [priority, setPriority] = useState(ticket.priority || "medium")
  const [estimatedTime, setEstimatedTime] = useState(ticket.estimatedRepairTime || "")
  const [internalNotes, setInternalNotes] = useState(ticket.internalNotes || "")
  const [notes, setNotes] = useState(ticket.notes || "")
  const [isExternal, setIsExternal] = useState(ticket.isExternal)
  const [externalCompany, setExternalCompany] = useState(ticket.externalRepairCompany || "")
  const [trackingNumber, setTrackingNumber] = useState(ticket.externalTrackingNumber || "")
  const [assignedEngineer, setAssignedEngineer] = useState(ticket.assignedEngineer || "")
  const [reportFile, setReportFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const newCount = prev - 1
      if (newCount === 0) {
        setDragActive(false)
      }
      return newCount
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      e.dataTransfer.dropEffect = "copy"
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setDragCounter(0)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setReportFile(file)
      } else {
        alert("Please upload a CSV file only")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setReportFile(file)
      } else {
        alert("Please upload a CSV file only")
        e.target.value = ""
      }
    }
  }

  const handleRemoveFile = () => {
    setReportFile(null)
    const input = document.getElementById("report-file") as HTMLInputElement
    if (input) {
      input.value = ""
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      let fileData = ticket.reportFile
      if (reportFile) {
        const text = await reportFile.text()
        fileData = {
          name: reportFile.name,
          data: text,
          uploadedAt: new Date(),
        }
      }

      const updated = updateTicket(ticket.id, {
        status,
        priority,
        estimatedRepairTime: estimatedTime,
        internalNotes,
        notes,
        isExternal,
        externalRepairCompany: isExternal ? externalCompany : undefined,
        externalTrackingNumber: isExternal ? trackingNumber : undefined,
        assignedEngineer: assignedEngineer as Engineer,
        reportFile: fileData,
      })

      if (updated) {
        setShowSuccess(true)

        if ((status === "closed" || status === "resolved") && ticket.status !== status) {
          triggerCelebration()
        }

        setTimeout(() => {
          onUpdate(updated)
          setShowSuccess(false)
          onClose()
        }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-border shadow-2xl animate-fade-in-scale">
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in">
            <div className="bg-card border-2 border-primary rounded-2xl shadow-2xl p-8 flex items-center gap-4 animate-bounce-in">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Updated Successfully!</h3>
                <p className="text-sm text-muted-foreground">Ticket changes saved</p>
              </div>
            </div>
          </div>
        )}

        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">Update Ticket {ticket.id}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify ticket details and communicate with students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4 pr-4">
          {/* Status & Priority Section */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm flex items-center justify-center font-bold shadow-lg">
                1
              </span>
              Status & Priority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-5 rounded-xl border border-border/50">
              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TicketStatus)}
                  className="select-modern w-full"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("-", " ").charAt(0).toUpperCase() + s.replace("-", " ").slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Priority</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="select-modern w-full"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Assign To</Label>
                <select
                  value={assignedEngineer}
                  onChange={(e) => setAssignedEngineer(e.target.value)}
                  className="select-modern w-full"
                >
                  <option value="">Select Engineer</option>
                  {ENGINEERS.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Repair Details Section */}
          <div className="space-y-4 pt-4 border-t-2 border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground text-sm flex items-center justify-center font-bold shadow-lg">
                2
              </span>
              Repair Information
            </h3>
            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
              <Label className="text-sm font-semibold text-foreground block mb-2">Estimated Repair Time</Label>
              <Input
                placeholder="e.g., 1-2 days, 3 hours"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="input-modern"
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 pt-4 border-t-2 border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground text-sm flex items-center justify-center font-bold shadow-lg">
                3
              </span>
              Notes & Communication
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Message for Student</Label>
                <Textarea
                  placeholder="Visible to student - Use for status updates, next steps, or pickup instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="textarea-modern"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Internal IT Notes</Label>
                <Textarea
                  placeholder="Only visible to IT staff - Diagnosis, parts needed, troubleshooting steps"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={3}
                  className="textarea-modern"
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4 pt-4 border-t-2 border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 text-primary-foreground text-sm flex items-center justify-center font-bold shadow-lg">
                4
              </span>
              Report Upload
            </h3>
            <div
              className={`upload-zone ${dragActive ? "active" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input id="report-file" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              {reportFile || ticket.reportFile ? (
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-7 h-7 text-primary" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground text-lg">
                        {reportFile ? reportFile.name : ticket.reportFile?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reportFile ? "Ready to upload" : "Current report file"}
                      </p>
                    </div>
                  </div>
                  {reportFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <label htmlFor="report-file" className="cursor-pointer w-full">
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="text-foreground font-medium text-lg">
                      Drag and drop CSV here or <span className="text-primary font-bold">Browse</span>
                    </p>
                    <p className="text-sm text-muted-foreground">CSV format only</p>
                  </div>
                </label>
              )}
            </div>
            {ticket.reportFile && !reportFile && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{ticket.reportFile.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (ticket.reportFile) {
                      const element = document.createElement("a")
                      element.setAttribute(
                        "href",
                        "data:text/csv;charset=utf-8," + encodeURIComponent(ticket.reportFile.data)
                      )
                      element.setAttribute("download", ticket.reportFile.name)
                      element.style.display = "none"
                      document.body.appendChild(element)
                      element.click()
                      document.body.removeChild(element)
                    }
                  }}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Download Current
                </Button>
              </div>
            )}
          </div>

          {/* External Repair Section */}
          <div className="space-y-4 pt-4 border-t-2 border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/80 to-secondary/60 text-secondary-foreground text-sm flex items-center justify-center font-bold shadow-lg">
                5
              </span>
              External Repair
            </h3>
            <div className="flex items-center gap-3 bg-muted/30 p-5 rounded-xl border border-border/50">
              <Checkbox
                id="external"
                checked={isExternal}
                onCheckedChange={(checked) => setIsExternal(checked as boolean)}
              />
              <Label htmlFor="external" className="font-semibold text-foreground cursor-pointer flex-1">
                Send to External Repair Company
              </Label>
            </div>

            {isExternal && (
              <div className="space-y-4 p-5 bg-primary/5 rounded-xl border-2 border-primary/30 animate-fade-in">
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Repair Company Name</Label>
                  <Input
                    placeholder="e.g., TechRepair Solutions"
                    value={externalCompany}
                    onChange={(e) => setExternalCompany(e.target.value)}
                    className="input-modern"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Tracking Number</Label>
                  <Input
                    placeholder="External tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="input-modern"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t-2 border-border pt-6 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-transparent border-2 font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTicket } from "@/lib/ticket-data"
import type { Department, IssueType, StudentYear, DeviceType, IssueCategory } from "@/lib/types"
import { HelpCircle, X, CheckCircle } from "lucide-react"

interface TicketFormProps {
  onTicketCreated: () => void
}

export default function TicketForm({ onTicketCreated }: TicketFormProps) {
  const [loading, setLoading] = useState(false)
  const [showIPHelper, setShowIPHelper] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    studentName: "",
    department: "IS" as Department,
    year: "senior" as StudentYear,
    classYear: "",
    instructorName: "",
    deviceType: "HP Zbook G3" as DeviceType,
    deviceIpAddress: "",
    issueDescription: "",
    issueType: "software" as IssueType,
    issueCategory: "software" as IssueCategory,
  })

  const getClassOptions = () => {
    const yearNum = Number.parseInt(formData.year === "senior" ? "4" : formData.year === "wheeler" ? "5" : "3")
    const baseNum = formData.year === "senior" ? 1 : formData.year === "wheeler" ? 1 : 1
    return Array.from({ length: 4 }, (_, i) => ({
      value: `${formData.year.charAt(0).toUpperCase() + formData.year.slice(1)} ${baseNum + i}`,
      label: `${formData.year.charAt(0).toUpperCase() + formData.year.slice(1)} ${baseNum + i}`,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const studentId = `STU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      createTicket({
        studentId,
        studentName: formData.studentName,
        studentEmail: `${formData.studentName.toLowerCase().replace(/\s+/g, ".")}@school.edu`,
        department: formData.department,
        year: formData.year,
        classYear: formData.classYear,
        instructorName: formData.instructorName,
        deviceType: formData.deviceType,
        deviceIpAddress: formData.deviceIpAddress,
        issueDescription: formData.issueDescription,
        issueType: formData.issueType,
        issueCategory: formData.issueCategory,
        status: "open",
        isExternal: false,
      } as any)

      setShowSuccess(true)
      setTimeout(() => {
        setFormData({
          studentName: "",
          department: "IS",
          year: "senior",
          classYear: "",
          instructorName: "",
          deviceType: "HP Zbook G3",
          deviceIpAddress: "",
          issueDescription: "",
          issueType: "software",
          issueCategory: "software",
        })
        setShowSuccess(false)
        onTicketCreated()
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in">
          <div className="bg-card border-2 border-primary rounded-2xl shadow-2xl p-8 flex items-center gap-4 animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Ticket Submitted!</h3>
              <p className="text-sm text-muted-foreground">We'll get back to you soon</p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-2 border-border shadow-xl rounded-2xl bg-card animate-fade-in">
        <CardHeader className="border-b-2 border-border pb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-3xl font-bold text-foreground">Submit a Support Ticket</CardTitle>
          <CardDescription className="text-base mt-2">
            Fill out the form below to get help with your device issue on TikTrack
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  1
                </div>
                Your Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Full Name *</Label>
                  <Input
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="input-modern"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Instructor Name *</Label>
                  <Input
                    value={formData.instructorName}
                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                    placeholder="Dr. Smith"
                    required
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Department *</Label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="select-modern w-full"
                    required
                  >
                    <option value="IS">Information Systems</option>
                    <option value="CS">Computer Science</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Year *</Label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value as StudentYear, classYear: "" })}
                    className="select-modern w-full"
                    required
                  >
                    <option value="senior">Senior</option>
                    <option value="wheeler">Wheeler</option>
                    <option value="junior">Junior</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Class *</Label>
                <select
                  value={formData.classYear}
                  onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                  className="select-modern w-full"
                  required
                >
                  <option value="">Select your class</option>
                  {getClassOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Device Information Section */}
            <div className="space-y-5 pt-4 border-t-2 border-border/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  2
                </div>
                Device Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">Device Type *</Label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value as DeviceType })}
                    className="select-modern w-full"
                    required
                  >
                    <option value="HP Zbook G3">HP Zbook G3</option>
                    <option value="HP Silver">HP Silver</option>
                    <option value="Dell Latitude">Dell Latitude</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground block mb-2">IP Address *</Label>
                  <Input
                    value={formData.deviceIpAddress}
                    onChange={(e) => setFormData({ ...formData, deviceIpAddress: e.target.value })}
                    placeholder="192.168.1.100"
                    required
                    className="input-modern"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIPHelper(true)}
                className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Need help finding your IP address?
              </button>
            </div>

            {/* Issue Details Section */}
            <div className="space-y-5 pt-4 border-t-2 border-border/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  3
                </div>
                Problem Description
              </h3>

              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Issue Category *</Label>
                <select
                  value={formData.issueCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issueCategory: e.target.value as IssueCategory,
                      issueType: e.target.value as IssueType,
                    })
                  }
                  className="select-modern w-full"
                  required
                >
                  <option value="software">Software Issue</option>
                  <option value="hardware">Hardware Issue</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground block mb-2">Describe the Problem *</Label>
                <Textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                  placeholder="Tell us what's happening with your device..."
                  className="textarea-modern"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t-2 border-border">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-base"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* IP Address Helper Modal */}
      {showIPHelper && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-2xl rounded-2xl border-2 border-border shadow-2xl animate-slide-in-bottom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div>
                <CardTitle className="text-xl font-bold">Find Your Device IP Address</CardTitle>
              </div>
              <button
                onClick={() => setShowIPHelper(false)}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {[
                {
                  title: "Open Command Prompt",
                  content: "Press Windows key + R, type 'cmd' and press Enter.",
                },
                {
                  title: "Type Command",
                  content: "Copy and paste this command:",
                  code: "ipconfig",
                },
                {
                  title: "Find IPv4 Address",
                  content: 'Look for "IPv4 Address" in the results - this is your device IP.',
                },
              ].map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{step.content}</p>
                      {step.code && (
                        <code className="block bg-muted p-3 rounded-lg text-sm font-mono text-foreground border border-border">
                          {step.code}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="border-t-2 border-border p-4">
              <Button
                onClick={() => setShowIPHelper(false)}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-bold shadow-lg"
              >
                Got It
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

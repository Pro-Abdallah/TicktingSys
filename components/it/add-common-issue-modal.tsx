"use client"

import type React from "react"
import { useState } from "react"
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
import { Plus, X, CheckCircle } from "lucide-react"
import type { CommonIssue } from "@/components/student/common-issues"
import { addCommonIssue } from "@/lib/common-issues-data"

interface AddCommonIssueModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
}

export default function AddCommonIssueModal({ isOpen, onClose, onAdd }: AddCommonIssueModalProps) {
  const [issue, setIssue] = useState("")
  const [category, setCategory] = useState<"hardware" | "software">("software")
  const [fixSteps, setFixSteps] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddStep = () => {
    setFixSteps([...fixSteps, ""])
  }

  const handleRemoveStep = (index: number) => {
    if (fixSteps.length > 1) {
      setFixSteps(fixSteps.filter((_, i) => i !== index))
    }
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...fixSteps]
    newSteps[index] = value
    setFixSteps(newSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!issue.trim()) {
      alert("Please enter an issue title")
      return
    }

    const validSteps = fixSteps.filter((step) => step.trim() !== "")
    if (validSteps.length === 0) {
      alert("Please add at least one fix step")
      return
    }

    setLoading(true)
    try {
      const newIssue: CommonIssue = {
        issue: issue.trim(),
        category,
        fixSteps: validSteps,
      }

      addCommonIssue(newIssue)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        setIssue("")
        setCategory("software")
        setFixSteps([""])
        onAdd()
        onClose()
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setIssue("")
      setCategory("software")
      setFixSteps([""])
      setShowSuccess(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-border shadow-2xl">
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in">
            <div className="bg-card border-2 border-primary rounded-2xl shadow-2xl p-8 flex items-center gap-4 animate-bounce-in">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Issue Added!</h3>
                <p className="text-sm text-muted-foreground">Common issue has been added successfully</p>
              </div>
            </div>
          </div>
        )}

        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">Add Common Issue</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new common issue with fix steps for students to reference
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Issue Title */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Issue Title *</Label>
            <Input
              placeholder="e.g., Wi-Fi Not Connecting"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="input-modern"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Category *</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "hardware" | "software")}
              className="select-modern w-full"
              required
            >
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
            </select>
          </div>

          {/* Fix Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground">Fix Steps *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStep}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </Button>
            </div>

            <div className="space-y-3">
              {fixSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder={`Step ${index + 1}...`}
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    className="textarea-modern flex-1"
                    rows={2}
                  />
                  {fixSteps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStep(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t-2 border-border pt-6 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl bg-transparent border-2 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? "Adding..." : "Add Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


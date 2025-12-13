"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { getCommonIssues } from "@/lib/common-issues-data"

export interface CommonIssue {
  issue: string
  fixSteps: string[]
  category: "hardware" | "software"
}

export function getCommonIssuesList(): CommonIssue[] {
  return getCommonIssues()
}

export interface CommonIssueCardProps {
  issue: CommonIssue
  index: number
}

export function CommonIssueCard({ issue, index }: CommonIssueCardProps) {
  return (
    <Card className="border border-border hover:shadow-md transition-all rounded-lg overflow-hidden hover:border-primary/30 card-hover bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm mt-0.5">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold text-lg text-foreground">{issue.issue}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                issue.category === "hardware"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
              }`}>
                {issue.category === "hardware" ? "Hardware" : "Software"}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Fix Steps:</p>
              <ol className="space-y-2">
                {issue.fixSteps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs mt-0.5">
                      {stepIndex + 1}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


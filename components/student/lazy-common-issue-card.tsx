"use client"

import { useEffect, useRef, useState } from "react"
import { CommonIssueCard } from "./common-issues"
import type { CommonIssue } from "./common-issues"
import { Spinner } from "@/components/ui/spinner"

interface LazyCommonIssueCardProps {
  issue: CommonIssue
  index: number
}

export default function LazyCommonIssueCard({ issue, index }: LazyCommonIssueCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: "100px", // Start loading 100px before the card enters viewport
        threshold: 0.1,
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  return (
    <div ref={cardRef} className="min-h-[200px]">
      {isVisible ? (
        <CommonIssueCard issue={issue} index={index} />
      ) : (
        <div className="h-[200px] bg-card border border-border rounded-lg flex items-center justify-center">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      )}
    </div>
  )
}


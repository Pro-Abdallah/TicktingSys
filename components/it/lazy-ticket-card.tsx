"use client"

import { useEffect, useRef, useState } from "react"
import TicketCard from "./ticket-card"
import type { Ticket } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

interface LazyTicketCardProps {
  ticket: Ticket
  onUpdate: (updatedTicket: Ticket) => void
}

export default function LazyTicketCard({ ticket, onUpdate }: LazyTicketCardProps) {
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
        <TicketCard ticket={ticket} onUpdate={onUpdate} />
      ) : (
        <div className="h-[200px] bg-card border border-border rounded-lg flex items-center justify-center">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      )}
    </div>
  )
}


"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import TicketForm from "@/components/student/ticket-form"

export default function NewTicketPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/student">
              <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Support Ticket</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Describe your device issue below</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <div className="animate-fade-in">
          <TicketForm onTicketCreated={() => (window.location.href = "/student")} />
        </div>
      </main>
    </div>
  )
}

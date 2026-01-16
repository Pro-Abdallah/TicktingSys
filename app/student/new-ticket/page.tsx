"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import TicketForm from "@/components/student/ticket-form"

export default function NewTicketPage() {
  return (
    <div className="min-h-screen bg-muted/30 relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 translate-y-[-50%]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50 translate-y-[50%]" />
      </div>

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/student">
              <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full w-10 h-10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Create Support Ticket</h1>
              <p className="text-xs text-muted-foreground font-medium">Get help with your school device</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-2xl">
        <TicketForm onTicketCreated={() => (window.location.href = "/student")} />
      </main>
    </div>
  )
}

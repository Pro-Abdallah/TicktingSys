"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Plus, TicketIcon, Wrench } from "lucide-react"
import TicketList from "@/components/student/ticket-list"
import { getCommonIssuesList } from "@/components/student/common-issues"
import LazyCommonIssueCard from "@/components/student/lazy-common-issue-card"

export default function StudentPortal() {
  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Track your device repairs</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tickets" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <TabsList className="bg-card border border-border rounded-lg p-1.5 shadow-sm gap-2">
              <TabsTrigger
                value="tickets"
                className="gap-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium transition-all"
              >
                <TicketIcon className="w-4 h-4" />
                <span className="hidden sm:inline">My Tickets</span>
                <span className="sm:hidden">Tickets</span>
              </TabsTrigger>
              <TabsTrigger
                value="common-issues"
                className="gap-2 rounded-md data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm font-medium transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span className="hidden sm:inline">Common Issues</span>
                <span className="sm:hidden">Issues</span>
              </TabsTrigger>
            </TabsList>
            <Link href="/student/new-ticket">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all rounded-lg w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </Link>
          </div>

          <TabsContent value="tickets" className="space-y-4 mt-6 animate-fade-in">
            <TicketList />
          </TabsContent>

          <TabsContent value="common-issues" className="space-y-4 mt-6 animate-fade-in">
            <div className="space-y-4">
              {getCommonIssuesList().map((issue, index) => (
                <LazyCommonIssueCard key={index} issue={issue} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

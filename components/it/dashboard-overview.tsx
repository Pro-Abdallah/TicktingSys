"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTickets } from "@/lib/ticket-data"
import type { Ticket } from "@/lib/types"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardOverview() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "hardware" | "software">("all")

  // Initial load - show loading spinner
  useEffect(() => {
    const loadTickets = () => {
      const allTickets = getTickets().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setTickets(allTickets)
      setIsInitialLoading(false)
    }
    
    // Small delay for initial load only
    const timeout = setTimeout(loadTickets, 300)
    
    return () => clearTimeout(timeout)
  }, [])

  // Background refresh - update silently without showing loading
  useEffect(() => {
    if (isInitialLoading) return // Don't refresh until initial load is done
    
    const interval = setInterval(() => {
      // Silently update tickets in background without showing loading state
      const allTickets = getTickets().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setTickets(allTickets)
      setRefreshKey((prev) => prev + 1)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isInitialLoading])

  const filteredTickets =
    selectedCategory === "all" ? tickets : tickets.filter((t) => t.issueCategory === selectedCategory)

  const stats = {
    total: filteredTickets.length,
    open: filteredTickets.filter((t) => t.status === "open").length,
    assigned: filteredTickets.filter((t) => t.status === "assigned").length,
    inProgress: filteredTickets.filter((t) => t.status === "in-progress").length,
    closed: filteredTickets.filter((t) => t.status === "closed").length,
    resolved: filteredTickets.filter((t) => t.status === "resolved").length,
    external: filteredTickets.filter((t) => t.isExternal).length,
  }

  const unassignedOverTime = filteredTickets.filter((t) => {
    if (t.status !== "open") return false
    const createdTime = new Date(t.createdAt).getTime()
    const now = new Date().getTime()
    const diffMinutes = (now - createdTime) / (1000 * 60)
    return diffMinutes > 15
  })

  const statusChartData = [
    { name: "Open", value: stats.open, fill: "#ef4444" },
    { name: "Assigned", value: stats.assigned, fill: "#3b82f6" },
    { name: "In Progress", value: stats.inProgress, fill: "#eab308" },
    { name: "Closed", value: stats.closed, fill: "#6b7280" },
    { name: "Resolved", value: stats.resolved, fill: "#22c55e" },
  ].filter((item) => item.value > 0)

  const hardwareCount = filteredTickets.filter((t) => t.issueCategory === "hardware").length
  const softwareCount = filteredTickets.filter((t) => t.issueCategory === "software").length

  const categoryData = [
    { name: "Hardware Issues", value: hardwareCount, fill: "#f59e0b" },
    { name: "Software Issues", value: softwareCount, fill: "#06b6d4" },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-6">
      {/* Alert for overdue tickets */}
      {unassignedOverTime.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <p className="text-red-900 dark:text-red-200 font-semibold">
            {unassignedOverTime.length} ticket(s) unassigned for over 15 minutes - Immediate action required!
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2"></div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isInitialLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                  <Spinner className="w-8 h-8 text-primary" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="border-blue-200 dark:border-blue-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All submissions</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.closed}</div>
                <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 dark:border-yellow-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently being worked on</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.open}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isInitialLoading ? (
          <>
            {[1, 2].map((i) => (
              <Card key={i} className="border-cyan-200 dark:border-cyan-900 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <Spinner className="w-10 h-10 text-primary" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="border-cyan-200 dark:border-cyan-900 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Ticket Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={90}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tickets`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-cyan-200 dark:border-cyan-900 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Issue Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      formatter={(value) => `${value} tickets`}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar dataKey="value" fill="#06b6d4" name="Count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Statistics Table */}
      <Card className="border-cyan-200 dark:border-cyan-900 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {isInitialLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="w-10 h-10 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="text-sm font-medium">Open Tickets</span>
                  <Badge className="bg-red-100 text-red-800">{stats.open}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-medium">Assigned</span>
                  <Badge className="bg-blue-100 text-blue-800">{stats.assigned}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/40 dark:to-yellow-900/40 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="text-sm font-medium">In Progress</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{stats.inProgress}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-sm font-medium">Resolved</span>
                  <Badge className="bg-green-100 text-green-800">{stats.resolved}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/40 dark:to-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-medium">Closed</span>
                  <Badge className="bg-gray-100 text-gray-800">{stats.closed}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-lg border border-purple-200 dark:border-purple-800">
                  <span className="text-sm font-medium">External Repairs</span>
                  <Badge className="bg-purple-100 text-purple-800">{stats.external}</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

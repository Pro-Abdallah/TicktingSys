import type { Ticket } from "./types"
import { showNotification } from "./notification"

let mockTickets: Ticket[] = []

// Use stable timestamps to avoid SSR/CSR hydration mismatches.
const DEFAULT_CREATED_AT = new Date("2024-11-14T00:00:00Z")
const ONE_HOUR_MS = 60 * 60 * 1000

const initializeTickets = () => {
  if (typeof window === "undefined") {
    return
  }

  const stored = localStorage.getItem("tickets")
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      mockTickets = parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }))
      mockTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return
    } catch (e) {
      console.error("Error parsing stored tickets:", e)
    }
  }

  // Default mock data only if no localStorage (client-side only)
  mockTickets = [
    {
      id: "TKT-001",
      studentId: "STU-001",
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@school.edu",
      department: "IS",
      year: "senior",
      classYear: "Senior 1",
      instructorName: "Mr. Smith",
      deviceType: "HP Zbook G3",
      deviceIpAddress: "192.168.1.100",
      issueDescription: "Laptop won't turn on, screen stays black",
      issueType: "hardware",
      issueCategory: "hardware",
      status: "assigned",
      createdAt: new Date(DEFAULT_CREATED_AT.getTime() - ONE_HOUR_MS),
      updatedAt: new Date("2024-11-13T00:00:00Z"),
      estimatedRepairTime: "2-3 days",
      priority: "high",
      notes: "Device sent for external repair",
      internalNotes: "Likely battery issue or logic board failure",
      isExternal: true,
      externalRepairCompany: "TechRepair Solutions",
      externalTrackingNumber: "EXT-2024-11-001",
    },
    {
      id: "TKT-002",
      studentId: "STU-002",
      studentName: "Sarah Chen",
      studentEmail: "sarah.chen@school.edu",
      department: "CS",
      year: "wheeler",
      classYear: "Wheeler 2",
      instructorName: "Ms. Johnson",
      deviceType: "Dell Latitude",
      deviceIpAddress: "192.168.1.101",
      issueDescription: "Wi-Fi not connecting to network",
      issueType: "software",
      issueCategory: "software",
      status: "in-progress",
      createdAt: new Date("2024-11-13T00:00:00Z"),
      updatedAt: new Date("2024-11-14T00:00:00Z"),
      estimatedRepairTime: "1 day",
      priority: "medium",
      notes: "Network driver update in progress",
      internalNotes: "Driver reinstall in progress",
      isExternal: false,
    },
    {
      id: "TKT-003",
      studentId: "STU-003",
      studentName: "Marcus Lee",
      studentEmail: "marcus.lee@school.edu",
      department: "IS",
      year: "junior",
      classYear: "Junior 3",
      instructorName: "Mr. Williams",
      deviceType: "HP Silver",
      deviceIpAddress: "192.168.1.102",
      issueDescription: "Keyboard keys not responding",
      issueType: "hardware",
      issueCategory: "hardware",
      status: "resolved",
      createdAt: new Date("2024-11-10T00:00:00Z"),
      updatedAt: new Date("2024-11-13T00:00:00Z"),
      estimatedRepairTime: "1 day",
      priority: "medium",
      notes: "Device ready for pickup",
      internalNotes: "Keyboard replaced successfully",
      isExternal: false,
    },
    {
      id: "TKT-004",
      studentId: "STU-004",
      studentName: "Emma Davis",
      studentEmail: "emma.davis@school.edu",
      department: "CS",
      year: "senior",
      classYear: "Senior 2",
      instructorName: "Dr. Brown",
      deviceType: "HP Zbook G3",
      deviceIpAddress: "192.168.1.103",
      issueDescription: "Software crashes frequently",
      issueType: "software",
      issueCategory: "software",
      status: "closed",
      createdAt: new Date("2024-11-08T00:00:00Z"),
      updatedAt: new Date("2024-11-12T00:00:00Z"),
      estimatedRepairTime: "2 hours",
      priority: "high",
      notes: "Issue resolved, software reinstalled",
      internalNotes: "Corrupted installation, clean reinstall fixed it",
      isExternal: false,
    },
  ]

  saveTickets()
}

const saveTickets = () => {
  if (typeof window !== "undefined") {
    mockTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    localStorage.setItem("tickets", JSON.stringify(mockTickets))
  }
}

export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return []
  initializeTickets()
  return [...mockTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getTicketById(id: string): Ticket | undefined {
  if (typeof window === "undefined") return undefined
  initializeTickets()
  return mockTickets.find((ticket) => ticket.id === id)
}

export function getStudentTickets(studentId: string): Ticket[] {
  if (typeof window === "undefined") return []
  initializeTickets()
  return mockTickets.filter((ticket) => ticket.studentId === studentId)
}

export function updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
  initializeTickets()
  const index = mockTickets.findIndex((ticket) => ticket.id === id)
  if (index === -1) return undefined

  mockTickets[index] = {
    ...mockTickets[index],
    ...updates,
    updatedAt: new Date(),
  }
  saveTickets()
  return mockTickets[index]
}

export function createTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Ticket {
  initializeTickets()
  const newTicket: Ticket = {
    ...ticket,
    id: `TKT-${String(mockTickets.length + 1).padStart(3, "0")}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockTickets.push(newTicket)
  saveTickets()

  if (typeof window !== "undefined") {
    try {
      showNotification("New Support Ticket", `${newTicket.studentName} submitted a ${newTicket.issueCategory} issue`)
    } catch (e) {
      console.log("Notification error:", e)
    }
  }

  return newTicket
}

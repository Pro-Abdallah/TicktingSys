export type Department = "IS" | "CS"
export type TicketStatus = "open" | "assigned" | "in-progress" | "waiting-external" | "resolved" | "closed"
export type IssueCategory = "software" | "hardware"
export type IssueType = "software" | "hardware" | "other"
export type Priority = "low" | "medium" | "high" | "critical"
export type StudentYear = "senior" | "wheeler" | "junior"
export type DeviceType = "HP Zbook G3" | "HP Silver" | "Dell Latitude"
export type Engineer = "eng-khalid" | "eng-essam"

export interface Ticket {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  department: Department
  year: StudentYear
  classYear: string
  instructorName: string
  deviceType: DeviceType
  deviceIpAddress: string
  issueDescription: string
  issueType: IssueType
  issueCategory: IssueCategory
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  estimatedRepairTime?: string
  priority?: Priority
  notes?: string
  internalNotes?: string
  isExternal: boolean
  externalRepairCompany?: string
  externalTrackingNumber?: string
  assignedEngineer?: Engineer
  reportFile?: {
    name: string
    data: string
    uploadedAt: Date
  }
}

export interface TicketUpdate {
  status?: TicketStatus
  internalNotes?: string
  estimatedRepairTime?: string
  priority?: Priority
  notes?: string
  isExternal?: boolean
  externalRepairCompany?: string
  externalRepairTrackingNumber?: string
}

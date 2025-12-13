'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTickets, updateTicket } from '@/lib/ticket-data'
import { Ticket, TicketStatus } from '@/lib/types'
import { ChevronDown } from 'lucide-react'

const STATUSES: TicketStatus[] = ['open', 'assigned', 'in-progress', 'waiting-external', 'resolved', 'closed']

const statusLabels: Record<TicketStatus, string> = {
  'open': 'Open',
  'assigned': 'Assigned',
  'in-progress': 'In Progress',
  'waiting-external': 'External Repair',
  'resolved': 'Resolved',
  'closed': 'Closed',
}

export default function TicketBoard() {
  const tickets = useMemo(() => getTickets(), [])
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<TicketStatus, Ticket[]> = {
      'open': [],
      'assigned': [],
      'in-progress': [],
      'waiting-external': [],
      'resolved': [],
      'closed': [],
    }
    
    tickets.forEach(ticket => {
      grouped[ticket.status].push(ticket)
    })
    
    return grouped
  }, [tickets])

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateTicket(ticketId, { status: newStatus })
    setExpandedTicket(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {STATUSES.map(status => (
        <div key={status} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{statusLabels[status]}</h3>
            <Badge variant="outline">{ticketsByStatus[status].length}</Badge>
          </div>

          <div className="space-y-3">
            {ticketsByStatus[status].length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-sm text-muted-foreground">No tickets</p>
                </CardContent>
              </Card>
            ) : (
              ticketsByStatus[status].map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader 
                    className="pb-3 cursor-pointer"
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{ticket.id}</div>
                        <p className="text-xs text-muted-foreground mt-1">{ticket.studentName}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedTicket === ticket.id ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>

                  {expandedTicket === ticket.id && (
                    <CardContent className="border-t border-border pt-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Device</p>
                        <p className="text-sm font-medium">{ticket.deviceType}</p>
                        <p className="text-xs text-muted-foreground">{ticket.deviceSerialNumber}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Issue</p>
                        <p className="text-sm">{ticket.issueDescription}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Department</p>
                        <p className="text-sm font-medium">{ticket.department}</p>
                      </div>

                      {ticket.internalNotes && (
                        <div className="space-y-2 bg-muted/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Internal Notes</p>
                          <p className="text-sm">{ticket.internalNotes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                        {STATUSES
                          .filter(s => s !== status)
                          .slice(0, 2)
                          .map(nextStatus => (
                            <Button
                              key={nextStatus}
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(ticket.id, nextStatus)}
                              className="text-xs"
                            >
                              Move to {statusLabels[nextStatus]}
                            </Button>
                          ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

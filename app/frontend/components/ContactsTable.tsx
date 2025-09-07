import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Mail, Building2 } from "lucide-react"

interface Contact {
  id: number
  name: string
  role: string | null
  email: string | null
  linkedin_url: string | null
  notes: string | null
  company: {
    id: number
    name: string
  }
  created_at: string
}

interface ContactsTableProps {
  contacts: Contact[]
  onContactClick: (contact: Contact) => void
}

export default function ContactsTable({ contacts, onContactClick }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No contacts yet</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding your first contact to track relationships and communications.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow 
              key={contact.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onContactClick(contact)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{contact.name}</div>
                  {contact.notes && (
                    <div className="text-sm text-muted-foreground">
                      {contact.notes.length > 50
                        ? `${contact.notes.substring(0, 50)}...`
                        : contact.notes
                      }
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{contact.company.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {contact.role ? (
                  <Badge variant="secondary" className="text-xs">
                    {contact.role}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {contact.email ? (
                  <Button variant="link" className="h-auto p-0" asChild>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="flex items-center gap-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {contact.linkedin_url ? (
                  <Button variant="link" className="h-auto p-0" asChild>
                    <a 
                      href={contact.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {contact.created_at}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

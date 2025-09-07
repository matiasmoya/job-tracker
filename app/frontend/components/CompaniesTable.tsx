import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink, Building2, Users, Briefcase } from "lucide-react"

interface Company {
  id: number
  name: string
  industry: string | null
  website: string | null
  linkedin_url: string | null
  notes: string | null
  tech_stack: string | null
  job_openings_count: number
  contacts_count: number
  created_at: string
}

interface CompaniesTableProps {
  companies: Company[]
  onCompanyClick: (company: Company) => void
}

export default function CompaniesTable({ companies, onCompanyClick }: CompaniesTableProps) {
  if (companies.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No companies yet</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding your first company to track applications and contacts.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead className="text-center">Jobs</TableHead>
            <TableHead className="text-center">Contacts</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow 
              key={company.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onCompanyClick(company)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{company.name}</div>
                  {company.tech_stack && (
                    <div className="text-sm text-muted-foreground">
                      {company.tech_stack.length > 50
                        ? `${company.tech_stack.substring(0, 50)}...`
                        : company.tech_stack
                      }
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {company.industry || 'Not specified'}
                </span>
              </TableCell>
              <TableCell>
                {company.website ? (
                  <Button variant="link" className="h-auto p-0" asChild>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {new URL(company.website).hostname}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {company.linkedin_url ? (
                  <Button variant="link" className="h-auto p-0" asChild>
                    <a 
                      href={company.linkedin_url} 
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
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{company.job_openings_count}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{company.contacts_count}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {company.created_at}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

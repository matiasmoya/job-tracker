import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Company {
  id: number
  company: string
  url: string
  offer_url: string
}

interface CompaniesTableProps {
  companies: Company[]
}

export default function CompaniesTable({ companies }: CompaniesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Job Offer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.company}</TableCell>
              <TableCell>
                <Button variant="link" className="h-auto p-0" asChild>
                  <a 
                    href={company.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    {new URL(company.url).hostname}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="link" className="h-auto p-0" asChild>
                  <a 
                    href={company.offer_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    View Job Offer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

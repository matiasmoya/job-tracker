import { Head } from '@inertiajs/react'
import AppLayout from '@/components/AppLayout'
import CompaniesTable from '@/components/CompaniesTable'

interface Company {
  id: number
  company: string
  url: string
  offer_url: string
}

interface DashboardProps {
  companies: Company[]
}

export default function Dashboard({ companies }: DashboardProps) {
  return (
    <AppLayout>
      <Head title="Dashboard" />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your job tracking dashboard. Here's an overview of your companies.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Companies</h2>
            <div className="text-sm text-muted-foreground">
              {companies.length} companies tracked
            </div>
          </div>
          
          <CompaniesTable companies={companies} />
        </div>
      </div>
    </AppLayout>
  )
}

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/components/AppLayout'
import CompaniesTable from '@/components/CompaniesTable'
import CompanyForm from '@/components/CompanyForm'
import CompanyEditForm from '@/components/CompanyEditForm'
import { ThemeProvider } from '@/components/ThemeProvider'

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

interface CompaniesProps {
  companies: Company[]
}

export default function Companies({ companies }: CompaniesProps) {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  const handleCompanyClick = async (company: Company) => {
    try {
      const response = await fetch(`/companies/${company.id}`)
      const fullCompanyData = await response.json()
      setEditingCompany(fullCompanyData)
      setIsEditFormOpen(true)
    } catch (error) {
      console.error('Failed to fetch company data:', error)
    }
  }

  const handleEditFormClose = () => {
    setIsEditFormOpen(false)
    setEditingCompany(null)
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="job-tracker-theme">
      <AppLayout>
        <Head title="Companies" />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
              <p className="text-muted-foreground">
                Manage companies you're interested in or have applied to.
              </p>
            </div>
            <CompanyForm />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                All Companies
              </h2>
              <div className="text-sm text-muted-foreground">
                {companies.length} {companies.length === 1 ? 'company' : 'companies'}
              </div>
            </div>
            
            <CompaniesTable companies={companies} onCompanyClick={handleCompanyClick} />
          </div>
        </div>

        <CompanyEditForm 
          company={editingCompany}
          open={isEditFormOpen}
          onOpenChange={handleEditFormClose}
        />
      </AppLayout>
    </ThemeProvider>
  )
}

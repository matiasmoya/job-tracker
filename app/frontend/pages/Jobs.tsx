import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/components/AppLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import JobList from '@/components/JobList'
import JobDetails from '@/components/JobDetails'
import JobForm from '@/components/JobForm'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface Company {
  id: number
  name: string
  website?: string
}

interface ApplicationProcess {
  id: number
  status: string
  applied_on?: string
  created_at: string
  updated_at: string
}

interface Job {
  id: number
  title: string
  company: Company
  application_process: ApplicationProcess | null
  location?: string
  salary?: string
  description?: string
  created_at: string
  updated_at: string
}

interface Contact {
  id: number
  name: string
  role?: string
  email?: string
  company_id: number
  company_name: string
}

interface JobsProps {
  jobs: Job[]
  companies: Company[]
  contacts: Contact[]
  selectedJob?: Job | null
  showForm?: boolean
}

export default function Jobs({ jobs, companies, contacts, selectedJob, showForm = false }: JobsProps) {
  const [isFormOpen, setIsFormOpen] = useState(showForm)

  const handleJobSelect = (jobId: number) => {
    router.get('/jobs', { job_id: jobId })
  }

  const handleNewJob = () => {
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    // Navigate back to jobs index if we were showing the form
    if (showForm) {
      router.get('/jobs')
    }
  }

  const handleFormSubmit = (data: any) => {
    // Build submit data
    const submitData: any = {
      title: data.title,
      description: data.description,
      location: data.location,
      salary: data.salary
    }
    
    // Handle company - either existing or new
    if (data.company_id) {
      submitData.company_id = parseInt(data.company_id, 10)
    }
    
    // Add new company data if provided
    if (data.new_company && data.new_company.name) {
      submitData.new_company_attributes = {
        name: data.new_company.name,
        industry: data.new_company.industry,
        website: data.new_company.website,
        linkedin_url: data.new_company.linkedin_url
      }
    }
    
    // Always send contact IDs (even if empty to handle removals)
    submitData.contact_ids = (data.contact_ids || []).map((id: string) => parseInt(id, 10))
    
    // Add new contact data if provided
    if (data.new_contact && data.new_contact.name) {
      submitData.new_contact_attributes = {
        name: data.new_contact.name,
        role: data.new_contact.role,
        email: data.new_contact.email,
        linkedin_url: data.new_contact.linkedin_url,
        company_id: data.company_id ? parseInt(data.company_id, 10) : undefined
      }
    }
    
    router.post('/jobs', { job_opening: submitData }, {
      onSuccess: () => {
        setIsFormOpen(false)
      }
    })
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="job-tracker-theme">
      <AppLayout>
        <Head title="Jobs" />
        
        <div className="flex h-full bg-background">
          {/* Jobs List Sidebar */}
          <div className="w-80 border-r border-border bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-foreground">Jobs</h1>
                <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <SheetTrigger asChild>
                    <Button onClick={handleNewJob} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      New Job
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                  <JobForm
                    companies={companies}
                    contacts={contacts}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormClose}
                  />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <JobList
              jobs={jobs}
              selectedJobId={selectedJob?.id}
              onJobSelect={handleJobSelect}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {selectedJob ? (
              <JobDetails
                job={selectedJob}
                companies={companies}
                contacts={contacts}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <h2 className="text-lg font-medium mb-2">No job selected</h2>
                  <p className="text-sm">Select a job from the sidebar or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

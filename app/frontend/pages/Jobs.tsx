import React, { useState, useEffect, useCallback } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/components/AppLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Plus, PanelLeft, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import JobList from '@/components/JobList'
import JobDetails from '@/components/JobDetails'
import JobForm from '@/components/JobForm'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// Jobs sidebar state management
const JOBS_SIDEBAR_KEY = 'jobs_sidebar_state'

function getJobsSidebarState(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const stored = window.localStorage.getItem(JOBS_SIDEBAR_KEY)
    return stored !== null ? JSON.parse(stored) : true
  } catch {
    return true
  }
}

function setJobsSidebarState(open: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(JOBS_SIDEBAR_KEY, JSON.stringify(open))
  } catch {
    // Ignore localStorage errors
  }
}

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
  source?: string
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
  const isMobile = useIsMobile()
  const [isFormOpen, setIsFormOpen] = useState(showForm)
  
  // Jobs sidebar state - default to collapsed on mobile, expanded on desktop
  const [isJobsSidebarOpen, setIsJobsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false // Start with false during SSR
    }
    if (isMobile) {
      return false // Always start collapsed on mobile
    } else {
      return getJobsSidebarState() // Use stored state on desktop
    }
  })
  
  // Initialize from localStorage on client-side
  useEffect(() => {
    if (!isMobile) {
      const storedState = getJobsSidebarState()
      setIsJobsSidebarOpen(storedState)
    } else {
      setIsJobsSidebarOpen(false)
    }
  }, [isMobile])
  
  // Toggle jobs sidebar
  const toggleJobsSidebar = useCallback(() => {
    if (isMobile) return // Don't allow toggle on mobile
    const newState = !isJobsSidebarOpen
    setIsJobsSidebarOpen(newState)
    setJobsSidebarState(newState)
  }, [isJobsSidebarOpen, isMobile])

  const handleJobSelect = (jobId: number) => {
    router.get('/jobs', { job_id: jobId })
    // Auto-close sidebar on mobile after selecting a job
    if (isMobile) {
      setIsJobsSidebarOpen(false)
    }
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
      salary: data.salary,
      source: data.source,
      tech_stack: data.tech_stack  // Already a comma-separated string from JobForm
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
          {/* Jobs List Sidebar - Only show when explicitly opened */}
          {isJobsSidebarOpen && (
            <div className={cn(
              "border-r border-border rounded-l bg-card transition-all duration-300 ease-in-out",
              isMobile ? "fixed inset-y-0 left-0 z-50 w-64 shadow-lg" : "w-64"
            )}>
              <div className="p-4 pb-[4px] border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-semibold text-foreground">Jobs</h1>
                  <div className="flex items-center gap-2">
                    {isMobile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsJobsSidebarOpen(false)}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Close jobs sidebar</span>
                      </Button>
                    )}
                    <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                      <SheetTrigger asChild>
                        <Button onClick={handleNewJob} size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          New Job
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-full w-3xl overflow-y-auto max-h-screen">
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
              </div>
              
              <JobList
                jobs={jobs}
                selectedJobId={selectedJob?.id}
                onJobSelect={handleJobSelect}
              />
            </div>
          )}
          
          {/* Overlay for mobile */}
          {isMobile && isJobsSidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/50" 
              onClick={() => setIsJobsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col relative">
            {/* Toggle button and header */}
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={isMobile ? () => setIsJobsSidebarOpen(true) : toggleJobsSidebar}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 h-auto transition-all duration-200",
                  !isMobile && !isJobsSidebarOpen && "hover:bg-accent"
                )}
              >
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Jobs</span>
                {isJobsSidebarOpen ? (
                  <ChevronLeft className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {isMobile ? "Show jobs sidebar" : (isJobsSidebarOpen ? "Hide jobs sidebar" : "Show jobs sidebar")}
                </span>
              </Button>
              {!selectedJob && (
                <div className="text-sm text-muted-foreground">
                  {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
                </div>
              )}
            </div>
            {/* Content area */}
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
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

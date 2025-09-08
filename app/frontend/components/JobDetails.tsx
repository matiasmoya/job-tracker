import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Edit, Plus, MessageSquare, Calendar, CheckSquare, Briefcase } from 'lucide-react'
import ApplicationStatusSteps from '@/components/ApplicationStatusSteps'
import JobTabs from '@/components/JobTabs'
import JobForm from '@/components/JobForm'
import MessageForm from '@/components/MessageForm'
import InterviewForm from '@/components/InterviewForm'
import TaskForm from '@/components/TaskForm'

interface Company {
  id: number
  name: string
  website?: string
}

interface Contact {
  id: number
  name: string
  role?: string
  email?: string
  company_id: number
  company_name: string
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
  tech_stack?: string[]
  description?: string
  created_at: string
  updated_at: string
  contacts?: Contact[]
}

interface JobDetailsProps {
  job: Job
  companies: Company[]
  contacts: Contact[]
}

export default function JobDetails({ job, companies, contacts }: JobDetailsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [isInterviewOpen, setIsInterviewOpen] = useState(false)
  const [isTaskOpen, setIsTaskOpen] = useState(false)
  
  const handleStatusUpdate = (newStatus: string) => {
    router.patch(`/jobs/${job.id}/status`, { status: newStatus }, {
      preserveScroll: true
    })
  }

  const handleEditSubmit = (data: any) => {
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
        company_id: parseInt(data.company_id, 10)
      }
    }
    
    router.patch(`/jobs/${job.id}`, { job_opening: submitData }, {
      onSuccess: () => {
        setIsEditOpen(false)
      },
      preserveScroll: true
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  return (
    <>
      <div className="p-6 border-b border-border">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">{job.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">{job.company.name}</span>
              {job.location && (
                <>
                  <span>•</span>
                  <span>{job.location}</span>
                </>
              )}
            </div>
              {job.salary && (
                <p className="text-sm text-muted-foreground">{job.salary}</p>
              )}
              {job.tech_stack && job.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.tech_stack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg">
              <JobForm
                companies={companies}
                contacts={contacts}
                job={job}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Application Status Steps */}
          {job.application_process && (
            <div className="p-6 border-b border-border">
              <ApplicationStatusSteps
                currentStatus={job.application_process.status}
                appliedOn={job.application_process.applied_on}
                onStatusChange={handleStatusUpdate}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="flex-1">
            <JobTabs job={job} />
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="w-64 border-l border-border bg-card">
          <div className="p-4">
            <h3 className="font-medium text-foreground mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              {/* Add Message */}
              <Sheet open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Message
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <MessageForm
                    jobId={job.id}
                    applicationProcessId={job.application_process?.id || 0}
                    contacts={job.contacts || []}
                    onCancel={() => setIsMessageOpen(false)}
                    onSuccess={() => setIsMessageOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              
              {/* Schedule Interview */}
              <Sheet open={isInterviewOpen} onOpenChange={setIsInterviewOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <InterviewForm
                    jobId={job.id}
                    applicationProcessId={job.application_process?.id || 0}
                    onCancel={() => setIsInterviewOpen(false)}
                    onSuccess={() => setIsInterviewOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              
              {/* Add Task */}
              <Sheet open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <TaskForm
                    jobId={job.id}
                    applicationProcessId={job.application_process?.id || 0}
                    onCancel={() => setIsTaskOpen(false)}
                    onSuccess={() => setIsTaskOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              
              {/* Record Offer - Placeholder */}
              <Button variant="outline" className="w-full justify-start" size="sm" disabled>
                <Briefcase className="h-4 w-4 mr-2" />
                Record Offer
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="text-xs">
                      {job.application_process?.status?.replace('_', ' ') || 'No Status'}
                    </Badge>
                  </div>
                  {job.application_process?.applied_on && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applied:</span>
                      <span>{formatDate(job.application_process.applied_on)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(job.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{formatDate(job.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>

              {job.company.website && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Company</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <a 
                      href={job.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit Website
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>            
  )
}

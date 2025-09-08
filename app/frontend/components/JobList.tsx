import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Plus, Building2 } from 'lucide-react'
import { router } from '@inertiajs/react'
import { cn } from '@/lib/utils'

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

interface JobListProps {
  jobs: Job[]
  selectedJobId?: number
  onJobSelect: (jobId: number) => void
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  interviewing: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800'
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  applied: 'Applied',
  in_review: 'In Review',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
  closed: 'Closed'
}

export default function JobList({ jobs, selectedJobId, onJobSelect }: JobListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  if (jobs.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">No jobs yet</p>
        <p className="text-xs mt-1">Create your first job to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={cn(
            'p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors',
            selectedJobId === job.id && 'bg-muted'
          )}
          onClick={() => onJobSelect(job.id)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-foreground text-sm leading-tight">
                {job.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={cn('text-xs ml-2 flex-shrink-0', statusColors[job.application_process?.status || 'draft'])}
              >
                {statusLabels[job.application_process?.status || 'draft']}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">{job.company.name}</div>
              {job.location && (
                <div className="mt-1">{job.location}</div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Updated {formatDate(job.updated_at)}
              </span>
              {job.application_process?.applied_on && (
                <span>
                  Applied {formatDate(job.application_process.applied_on)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

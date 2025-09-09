import { Link } from '@inertiajs/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  CalendarIcon, 
  ClockIcon, 
  BuildingIcon, 
  UserIcon, 
  MailIcon, 
  LinkedinIcon,
  ExternalLinkIcon
} from 'lucide-react'

interface Contact {
  id: number
  name: string
  title: string | null
  email: string | null
  linkedin_url: string | null
}

interface InterviewData {
  interview_id: number
  company_name: string
  job_title: string
  job_opening_id: number
  interview_type: string
  round_number: number
  duration: string
  performance_score: number | null
  enjoyment_score: number | null
  scheduled_at: string
  contacts: Contact[]
}

interface InterviewDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  interviewData: InterviewData | null
}

export default function InterviewDetailsDialog({ 
  open, 
  onOpenChange, 
  interviewData 
}: InterviewDetailsDialogProps) {
  if (!interviewData) return null

  const handleJobClick = () => {
    // Close dialog and navigate
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <DialogTitle className="text-xl">
                Round {interviewData.round_number}: {interviewData.interview_type}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Interview details and contact information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Job Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{interviewData.company_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Position:</span>
                <Link 
                  href={`/jobs?job_id=${interviewData.job_opening_id}`}
                  className="text-primary hover:text-primary/80 underline-offset-4 hover:underline inline-flex items-center gap-1"
                  onClick={handleJobClick}
                >
                  {interviewData.job_title}
                  <ExternalLinkIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          <Separator />

          {/* Interview Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Interview Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{interviewData.scheduled_at}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {interviewData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Type:</span>
                <Badge variant="secondary">{interviewData.interview_type}</Badge>
              </div>
            </div>
          </div>

          {/* Performance Scores */}
          {(interviewData.performance_score !== null || interviewData.enjoyment_score !== null) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Scores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {interviewData.performance_score !== null && (
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold text-primary">
                        {interviewData.performance_score}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Performance</div>
                    </div>
                  )}
                  {interviewData.enjoyment_score !== null && (
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold text-primary">
                        {interviewData.enjoyment_score}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Enjoyment</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Contacts */}
          {interviewData.contacts && interviewData.contacts.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Contacts ({interviewData.contacts.length})
                </h3>
                <div className="space-y-4">
                  {interviewData.contacts.map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.title && (
                            <p className="text-sm text-muted-foreground">{contact.title}</p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-2">
                            {contact.email && (
                              <a 
                                href={`mailto:${contact.email}`}
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                              >
                                <MailIcon className="h-3 w-3" />
                                {contact.email}
                              </a>
                            )}
                            {contact.linkedin_url && (
                              <a 
                                href={contact.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                              >
                                <LinkedinIcon className="h-3 w-3" />
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

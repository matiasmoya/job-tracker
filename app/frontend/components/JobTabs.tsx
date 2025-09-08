import React from 'react'
import { router } from '@inertiajs/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageSquare, Calendar, CheckSquare, User } from 'lucide-react'

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

interface Message {
  id: number
  content: string
  direction: string
  sent_at: string
  contact_name: string
  short_content: string
}

interface Task {
  id: number
  title: string
  notes?: string
  completed: boolean
  due_date?: string
  created_at: string
}

interface Interview {
  id: number
  round_number: number
  interview_type: string
  scheduled_at: string
  duration: string
  performance_score?: number
  enjoyment_score?: number
  notes?: string
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
  messages?: Message[]
  tasks?: Task[]
  interviews?: Interview[]
}

interface JobTabsProps {
  job: Job
}

// Helper function to create activity items from job data
const createActivityItems = (job: Job) => {
  const activities: any[] = []
  
  // Add messages
  if (job.messages) {
    job.messages.forEach(message => {
      activities.push({
        id: `message-${message.id}`,
        type: 'message',
        title: `${message.direction === 'sent' ? 'Message sent' : 'Message received'}`,
        description: `${message.direction === 'sent' ? 'To' : 'From'} ${message.contact_name}: ${message.short_content}`,
        timestamp: message.sent_at,
        icon: MessageSquare,
        link_id: message.id
      })
    })
  }
  
  // Add tasks
  if (job.tasks) {
    job.tasks.forEach(task => {
      activities.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.completed ? `Task completed: ${task.title}` : `Task created: ${task.title}`,
        description: task.description || 'No description provided',
        timestamp: task.created_at,
        icon: CheckSquare,
        link_id: task.id,
        completed: task.completed
      })
    })
  }
  
  // Add interviews
  if (job.interviews) {
    job.interviews.forEach(interview => {
      activities.push({
        id: `interview-${interview.id}`,
        type: 'interview',
        title: `${interview.interview_type} interview scheduled`,
        description: `Round ${interview.round_number} scheduled for ${interview.scheduled_at}`,
        timestamp: interview.scheduled_at,
        icon: Calendar,
        link_id: interview.id
      })
    })
  }
  
  // Sort by timestamp (most recent first)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export default function JobTabs({ job }: JobTabsProps) {
  const handleTaskToggle = (taskId: number) => {
    router.post(`/jobs/${job.id}/toggle_task`, { task_id: taskId }, {
      preserveScroll: true,
      preserveState: true
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-100 text-blue-800'
      case 'message':
        return 'bg-green-100 text-green-800'
      case 'interview':
        return 'bg-purple-100 text-purple-800'
      case 'task':
        return 'bg-yellow-100 text-yellow-800'
      case 'contact':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Tabs defaultValue="tracking" className="flex-1 flex flex-col">
      <div className="px-6 py-3 border-b border-border">
        <TabsList className="h-10">
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="description" className="flex-1 p-6 mt-0">
        <div className="space-y-6">
          {job.description ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">No job description available</p>
                  <p className="text-xs mt-1">Add one by editing this job</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Company:</span>
                  <p className="mt-1">{job.company.name}</p>
                </div>
                
                {job.location && (
                  <div>
                    <span className="font-medium text-muted-foreground">Location:</span>
                    <p className="mt-1">{job.location}</p>
                  </div>
                )}
                
                {job.salary && (
                  <div>
                    <span className="font-medium text-muted-foreground">Salary:</span>
                    <p className="mt-1">{job.salary}</p>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <p className="mt-1 capitalize">
                    {job.application_process?.status?.replace('_', ' ') || 'No Status'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tracking" className="flex-1 p-6 mt-0">
        <div className="space-y-6">
          {/* Messages Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <Badge variant="secondary">{job.messages?.length || 0}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {job.messages && job.messages.length > 0 ? (
                <div className="space-y-3">
                  {job.messages.map((message) => (
                    <div key={message.id} className="border-l-2 border-muted pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={message.direction === 'sent' ? 'default' : 'secondary'} className="text-xs">
                            {message.direction === 'sent' ? 'Sent' : 'Received'}
                          </Badge>
                          <span className="text-sm font-medium">
                            {message.direction === 'sent' ? 'To' : 'From'} {message.contact_name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(message.sent_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{message.short_content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages recorded yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Interviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Interviews
                </CardTitle>
                <Badge variant="secondary">{job.interviews?.length || 0}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {job.interviews && job.interviews.length > 0 ? (
                <div className="space-y-3">
                  {job.interviews.map((interview) => (
                    <div key={interview.id} className="border-l-2 border-muted pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">
                            Round {interview.round_number}: {interview.interview_type}
                          </span>
                          {interview.performance_score && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Performance: {interview.performance_score}/5
                              </Badge>
                              {interview.enjoyment_score && (
                                <Badge variant="outline" className="text-xs">
                                  Enjoyment: {interview.enjoyment_score}/5
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{interview.scheduled_at}</span>
                      </div>
                      {interview.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{interview.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No interviews scheduled yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Tasks
                </CardTitle>
                <div className="flex items-center gap-2">
                  {job.tasks && job.tasks.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {job.tasks.filter(t => t.completed).length}/{job.tasks.length} completed
                    </Badge>
                  )}
                  <Badge variant="secondary">{job.tasks?.length || 0}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {job.tasks && job.tasks.length > 0 ? (
                <div className="space-y-2">
                  {job.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 py-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-sm font-medium cursor-pointer ${
                            task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {task.title}
                        </label>
                        {task.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {task.notes}
                          </p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {task.due_date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks created yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

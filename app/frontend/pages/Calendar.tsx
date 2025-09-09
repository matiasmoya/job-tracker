import { useState, useMemo } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/assets/calendar.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, CheckCircleIcon, ClockIcon, BuildingIcon, UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import InterviewDetailsDialog from '@/components/InterviewDetailsDialog'
import TaskDetailsDialog from '@/components/TaskDetailsDialog'

const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string | null
  type: 'interview' | 'task'
  data: {
    [key: string]: any
  }
}

interface InterviewEventData {
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
  contacts: Array<{
    id: number
    name: string
    title: string | null
    email: string | null
    phone: string | null
    linkedin_url: string | null
  }>
}

interface TaskEventData {
  task_id: number
  title: string
  completed: boolean
  overdue: boolean
  status: string
  notes?: string | null
  due_date?: string | null
  application_process_id?: number | null
  job_title?: string | null
  company_name?: string | null
}

interface CalendarPageProps {
  events: CalendarEvent[]
  current_date: string
}

// Custom event component for better styling
const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const isInterview = event.type === 'interview'
  const isTask = event.type === 'task'
  
  return (
    <div className={cn(
      "text-xs p-1 rounded-sm border-l-2",
      isInterview && "bg-primary/10 border-primary text-primary-foreground",
      isTask && "bg-muted border-muted-foreground text-muted-foreground",
      isTask && event.data.completed && "bg-success/10 border-success text-success-foreground",
      isTask && event.data.overdue && "bg-destructive/10 border-destructive text-destructive-foreground"
    )}>
      <div className="font-medium truncate">{event.title}</div>
      {isInterview && (
        <div className="text-xs opacity-75">
          {event.data.company}
        </div>
      )}
    </div>
  )
}

// Agenda view component for listing events
const AgendaView = ({ 
  events, 
  currentDate, 
  onEventClick 
}: { 
  events: CalendarEvent[], 
  currentDate: Date,
  onEventClick: (event: CalendarEvent) => void 
}) => {
  const filteredEvents = useMemo(() => {
    const weekStart = moment(currentDate).startOf('week')
    const weekEnd = moment(currentDate).endOf('week')
    
    return events.filter(event => {
      const eventStart = moment(event.start)
      return eventStart.isBetween(weekStart, weekEnd, null, '[]')
    }).sort((a, b) => moment(a.start).diff(moment(b.start)))
  }, [events, currentDate])
  
  const groupedEvents = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {}
    filteredEvents.forEach(event => {
      const dateKey = moment(event.start).format('YYYY-MM-DD')
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(event)
    })
    return grouped
  }, [filteredEvents])
  
  return (
    <div className="space-y-4">
      {Object.keys(groupedEvents).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CalendarIcon className="mx-auto h-8 w-8 mb-2" />
          <p>No events scheduled for this week</p>
        </div>
      ) : (
        Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <Card key={date}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {moment(date).format('dddd, MMMM Do')}
              </CardTitle>
              <CardDescription>
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayEvents.map(event => (
                <div 
                  key={event.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex-shrink-0">
                    {event.type === 'interview' ? (
                      <UserIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <CheckCircleIcon className={cn(
                        "h-4 w-4",
                        event.data.completed ? "text-green-600" : "text-muted-foreground",
                        event.data.overdue && "text-destructive"
                      )} />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <Badge variant={event.type === 'interview' ? 'default' : 'secondary'}>
                        {event.type}
                      </Badge>
                      {event.data.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Completed
                        </Badge>
                      )}
                      {event.data.overdue && (
                        <Badge variant="destructive">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <ClockIcon className="h-3 w-3" />
                      <span>{moment(event.start).format('h:mm A')}</span>
                      {event.end && (
                        <>
                          <span>-</span>
                          <span>{moment(event.end).format('h:mm A')}</span>
                        </>
                      )}
                    </div>
                    {event.type === 'interview' && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <BuildingIcon className="h-3 w-3" />
                        <span>{event.data.company} - {event.data.job_title}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export default function CalendarPage({ events, current_date }: CalendarPageProps) {
  const [view, setView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date(current_date))
  
  // Dialog states
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedInterviewData, setSelectedInterviewData] = useState<InterviewEventData | null>(null)
  const [selectedTaskData, setSelectedTaskData] = useState<TaskEventData | null>(null)
  
  // Local state for events to allow updates
  const [localEvents, setLocalEvents] = useState(events)
  
  // Event handlers
  const handleEventSelect = (event: CalendarEvent) => {
    if (event.type === 'interview') {
      setSelectedInterviewData(event.data as InterviewEventData)
      setInterviewDialogOpen(true)
    } else if (event.type === 'task') {
      setSelectedTaskData(event.data as TaskEventData)
      setTaskDialogOpen(true)
    }
  }
  
  const handleTaskUpdate = (taskId: number, updates: { completed: boolean; status: string }) => {
    setLocalEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === `task-${taskId}`) {
          return {
            ...event,
            data: {
              ...event.data,
              completed: updates.completed,
              status: updates.status
            }
          }
        }
        return event
      })
    )
  }

  // Convert string dates to Date objects for react-big-calendar
  const formattedEvents = useMemo(() => {
    return localEvents.map(event => ({
      ...event,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : new Date(event.start)
    }))
  }, [localEvents])
  
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad'
    let borderColor = '#265985'
    
    if (event.type === 'interview') {
      backgroundColor = 'hsl(var(--primary))'
      borderColor = 'hsl(var(--primary))'
    } else if (event.type === 'task') {
      if (event.data.completed) {
        backgroundColor = 'hsl(var(--success))'
        borderColor = 'hsl(var(--success))'
      } else if (event.data.overdue) {
        backgroundColor = 'hsl(var(--destructive))'
        borderColor = 'hsl(var(--destructive))'
      } else {
        backgroundColor = 'hsl(var(--muted))'
        borderColor = 'hsl(var(--muted-foreground))'
      }
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px'
      }
    }
  }
  
  const formats = {
    timeGutterFormat: 'h A',
    eventTimeRangeFormat: ({ start, end }: { start: Date, end: Date }) => {
      return `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A')}`
    },
    agendaTimeRangeFormat: ({ start, end }: { start: Date, end: Date }) => {
      return `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A')}`
    },
  }
  
  const viewButtons = [
    { view: Views.MONTH, label: 'Month' },
    { view: Views.WEEK, label: 'Week' },
    { view: Views.DAY, label: 'Day' },
    { view: 'agenda' as View, label: 'Agenda' },
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your interviews and tasks
          </p>
        </div>
        <div className="flex gap-2">
          {viewButtons.map(({ view: viewType, label }) => (
            <Button
              key={viewType}
              variant={view === viewType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(viewType)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <Card>
        <CardContent className="p-6">
          {view === 'agenda' ? (
            <AgendaView 
              events={formattedEvents} 
              currentDate={currentDate} 
              onEventClick={handleEventSelect}
            />
          ) : (
            <div style={{ height: '700px' }}>
              <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                view={view}
                onView={setView}
                date={currentDate}
                onNavigate={setCurrentDate}
                onSelectEvent={handleEventSelect}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: EventComponent,
                }}
                formats={formats}
                className="rbc-calendar-custom"
                popup
                showMultiDayTimes
                step={60}
                timeslots={1}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary"></div>
          <span>Interviews</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-muted-foreground"></div>
          <span>Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-600"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-destructive"></div>
          <span>Overdue</span>
        </div>
      </div>
      
      {/* Dialogs */}
      <InterviewDetailsDialog
        open={interviewDialogOpen}
        onOpenChange={setInterviewDialogOpen}
        interviewData={selectedInterviewData}
      />
      
      <TaskDetailsDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        taskData={selectedTaskData}
        onUpdated={(updates) => {
          if (selectedTaskData) {
            handleTaskUpdate(selectedTaskData.task_id, updates)
          }
        }}
      />
    </div>
  )
}

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, CheckCircle2 } from 'lucide-react'

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  due_date?: string
  created_at: string
}

interface JobTasksListProps {
  tasks: Task[]
  jobId: number
  onTaskToggle: (taskId: number, completed: boolean) => void
}

export default function JobTasksList({ tasks, jobId, onTaskToggle }: JobTasksListProps) {
  const [updatingTasks, setUpdatingTasks] = useState<Set<number>>(new Set())

  const handleTaskToggle = async (taskId: number, currentCompleted: boolean) => {
    if (updatingTasks.has(taskId)) return

    setUpdatingTasks(prev => new Set([...prev, taskId]))
    
    try {
      const response = await fetch(`/jobs/${jobId}/toggle_task`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({ task_id: taskId })
      })

      const result = await response.json()
      
      if (result.success) {
        onTaskToggle(taskId, result.completed)
      } else {
        console.error('Failed to toggle task:', result.errors)
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <CheckCircle2 className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No tasks yet</p>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

  return (
    <div className="space-y-4">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-orange-500" />
            <h4 className="font-medium text-sm">Pending</h4>
            <Badge variant="secondary" className="text-xs">
              {pendingTasks.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isUpdating={updatingTasks.has(task.id)}
                onToggle={() => handleTaskToggle(task.id, task.completed)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <h4 className="font-medium text-sm">Completed</h4>
            <Badge variant="secondary" className="text-xs">
              {completedTasks.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isUpdating={updatingTasks.has(task.id)}
                onToggle={() => handleTaskToggle(task.id, task.completed)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface TaskItemProps {
  task: Task
  isUpdating: boolean
  onToggle: () => void
}

function TaskItem({ task, isUpdating, onToggle }: TaskItemProps) {
  return (
    <div className={`
      flex items-start gap-3 p-3 rounded-lg border transition-all
      ${task.completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
      }
      ${isUpdating ? 'opacity-50' : ''}
    `}>
      <div className="flex items-center pt-0.5">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          disabled={isUpdating}
          className={isUpdating ? 'animate-pulse' : ''}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className={`
          font-medium text-sm
          ${task.completed 
            ? 'line-through text-muted-foreground' 
            : 'text-foreground'
          }
        `}>
          {task.title}
        </div>

        {task.description && (
          <div className={`
            text-xs mt-1
            ${task.completed 
              ? 'text-muted-foreground/70' 
              : 'text-muted-foreground'
            }
          `}>
            {task.description}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          {task.due_date && (
            <div className={`
              flex items-center gap-1 text-xs
              ${task.completed 
                ? 'text-muted-foreground/70' 
                : 'text-muted-foreground'
              }
            `}>
              <Calendar className="h-3 w-3" />
              <span>Due: {task.due_date}</span>
            </div>
          )}

          <div className={`
            text-xs
            ${task.completed 
              ? 'text-muted-foreground/70' 
              : 'text-muted-foreground'
            }
          `}>
            Created: {task.created_at}
          </div>
        </div>
      </div>
    </div>
  )
}

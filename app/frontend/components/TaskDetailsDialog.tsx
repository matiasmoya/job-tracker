import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, CheckCircle2Icon, BriefcaseIcon } from 'lucide-react'

interface TaskData {
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

interface TaskDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskData: TaskData | null
  onUpdated?: (updated: { completed: boolean; status: string }) => void
}

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  taskData,
  onUpdated,
}: TaskDetailsDialogProps) {
  const [saving, setSaving] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(taskData?.completed ?? false)

  if (!taskData) return null

  const onToggleCompleted = async (checked: boolean) => {
    setLocalCompleted(!!checked)
    setSaving(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const response = await fetch(`/calendar/tasks/${taskData.task_id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({ task: { completed: !!checked } }),
      })
      const json = await response.json()
      if (json.success) {
        onUpdated?.({ completed: json.task.completed, status: json.task.status })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2Icon className="h-5 w-5 text-primary" />
            Task Details
          </DialogTitle>
          <DialogDescription>View and update the task</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="text-lg font-medium">{taskData.title}</div>
            {(taskData.company_name || taskData.job_title) && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4" />
                <span>
                  {taskData.job_title && taskData.company_name 
                    ? `${taskData.job_title} at ${taskData.company_name}`
                    : taskData.job_title || taskData.company_name
                  }
                </span>
              </div>
            )}
          </div>

          {taskData.notes && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
              <div className="text-sm whitespace-pre-wrap">{taskData.notes}</div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Due: {taskData.due_date || '—'}</span>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Checkbox id="completed" checked={localCompleted} onCheckedChange={onToggleCompleted} disabled={saving} />
            <label htmlFor="completed" className="text-sm leading-none">
              Mark as completed
            </label>
          </div>
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


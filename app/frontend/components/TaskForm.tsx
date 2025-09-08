import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'

interface TaskFormProps {
  jobId: number
  applicationProcessId: number
  onCancel: () => void
  onSuccess?: () => void
}

export default function TaskForm({ jobId, applicationProcessId, onCancel, onSuccess }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    due_date: '',
    completed: false
  })
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const newErrors: any = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    const submitData = {
      task: {
        title: formData.title,
        notes: formData.notes,
        due_date: formData.due_date || null,
        completed: formData.completed
      }
    }
    
    router.post(`/jobs/${jobId}/tasks`, submitData, {
      onSuccess: () => {
        setFormData({
          title: '',
          notes: '',
          due_date: '',
          completed: false
        })
        setErrors({})
        if (onSuccess) onSuccess()
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
      preserveScroll: true
    })
  }

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Add Task</SheetTitle>
        <SheetDescription>
          Create a task to track for this job application.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }))
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: '' }))
              }
            }}
            placeholder="e.g., Send follow-up email"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about the task..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={formData.completed}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, completed: checked as boolean }))
            }
          />
          <Label htmlFor="completed" className="text-sm font-normal">
            Mark as completed
          </Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

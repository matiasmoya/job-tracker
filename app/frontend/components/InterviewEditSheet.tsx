import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  Save,
  Trash2
} from 'lucide-react'

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

interface InterviewEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  interview: Interview | null
  jobId: number
}

const interviewTypes = [
  'Phone Screen',
  'Technical',
  'Behavioral',
  'System Design',
  'Coding',
  'Panel',
  'Hiring Manager',
  'Culture Fit',
  'Final Round',
  'Other'
]

export default function InterviewEditSheet({ 
  open, 
  onOpenChange, 
  interview, 
  jobId 
}: InterviewEditSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    round_number: '',
    interview_type: '',
    scheduled_at: '',
    duration: '60',
    performance_score: [3],
    enjoyment_score: [3],
    notes: ''
  })
  const [errors, setErrors] = useState<any>({})

  // Initialize form data when interview changes
  useEffect(() => {
    if (interview) {
      // Convert scheduled_at to datetime-local format if needed
      const scheduledAt = interview.scheduled_at
      let datetimeLocal = ''
      
      try {
        // Try to parse the date and format for datetime-local input
        const date = new Date(scheduledAt)
        if (!isNaN(date.getTime())) {
          datetimeLocal = date.toISOString().slice(0, 16)
        }
      } catch {
        datetimeLocal = scheduledAt
      }

      setFormData({
        round_number: interview.round_number.toString(),
        interview_type: interview.interview_type,
        scheduled_at: datetimeLocal,
        duration: interview.duration || '60',
        performance_score: [interview.performance_score || 3],
        enjoyment_score: [interview.enjoyment_score || 3],
        notes: interview.notes || ''
      })
    }
  }, [interview])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!interview) return
    
    // Validate
    const newErrors: any = {}
    if (!formData.interview_type) {
      newErrors.interview_type = 'Interview type is required'
    }
    if (!formData.scheduled_at) {
      newErrors.scheduled_at = 'Date and time are required'
    }
    if (!formData.round_number || parseInt(formData.round_number) < 1) {
      newErrors.round_number = 'Round number must be at least 1'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    const submitData = {
      interview: {
        round_number: parseInt(formData.round_number),
        interview_type: formData.interview_type,
        scheduled_at: formData.scheduled_at,
        duration: parseInt(formData.duration),
        performance_score: formData.performance_score[0],
        enjoyment_score: formData.enjoyment_score[0],
        notes: formData.notes
      }
    }
    
    router.patch(`/jobs/${jobId}/interviews/${interview.id}`, submitData, {
      onSuccess: () => {
        setErrors({})
        onOpenChange(false)
      },
      onError: (errors) => {
        setErrors(errors)
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
      preserveScroll: true
    })
  }

  const handleDelete = () => {
    if (!interview) return
    
    if (confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      setIsDeleting(true)
      
      router.delete(`/jobs/${jobId}/interviews/${interview.id}`, {
        onSuccess: () => {
          onOpenChange(false)
        },
        onFinish: () => {
          setIsDeleting(false)
        },
        preserveScroll: true
      })
    }
  }

  if (!interview) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <SheetTitle className="text-xl">
                Edit Interview
              </SheetTitle>
              <SheetDescription>
                Update the details for this interview
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Current Interview Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Round {interview.round_number}: {interview.interview_type}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                <span>{interview.scheduled_at}</span>
              </div>
              {interview.performance_score && (
                <Badge variant="outline" className="text-xs">
                  Performance: {interview.performance_score}/5
                </Badge>
              )}
              {interview.enjoyment_score && (
                <Badge variant="outline" className="text-xs">
                  Enjoyment: {interview.enjoyment_score}/5
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="round_number">Round Number *</Label>
                <Input
                  id="round_number"
                  type="number"
                  min="1"
                  value={formData.round_number}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, round_number: e.target.value }))
                    if (errors.round_number) {
                      setErrors(prev => ({ ...prev, round_number: '' }))
                    }
                  }}
                />
                {errors.round_number && (
                  <p className="text-sm text-destructive">{errors.round_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="interview_type">Type *</Label>
                <Select
                  value={formData.interview_type}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, interview_type: value }))
                    if (errors.interview_type) {
                      setErrors(prev => ({ ...prev, interview_type: '' }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.interview_type && (
                  <p className="text-sm text-destructive">{errors.interview_type}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Date & Time *</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))
                    if (errors.scheduled_at) {
                      setErrors(prev => ({ ...prev, scheduled_at: '' }))
                    }
                  }}
                />
                {errors.scheduled_at && (
                  <p className="text-sm text-destructive">{errors.scheduled_at}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="performance_score">
                Performance Score: {formData.performance_score[0]}/5
              </Label>
              <Slider
                id="performance_score"
                min={1}
                max={5}
                step={1}
                value={formData.performance_score}
                onValueChange={(value) => setFormData(prev => ({ ...prev, performance_score: value }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enjoyment_score">
                Enjoyment Score: {formData.enjoyment_score[0]}/5
              </Label>
              <Slider
                id="enjoyment_score"
                min={1}
                max={5}
                step={1}
                value={formData.enjoyment_score}
                onValueChange={(value) => setFormData(prev => ({ ...prev, enjoyment_score: value }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Disliked</span>
                <span>Neutral</span>
                <span>Loved it</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about the interview..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>

            <Separator />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Interview
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

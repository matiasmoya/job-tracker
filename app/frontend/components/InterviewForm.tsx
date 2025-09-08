import { useState } from 'react'
import { router } from '@inertiajs/react'
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
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'

interface InterviewFormProps {
  jobId: number
  applicationProcessId: number
  onCancel: () => void
  onSuccess?: () => void
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

export default function InterviewForm({ jobId, applicationProcessId, onCancel, onSuccess }: InterviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    round_number: '1',
    interview_type: '',
    scheduled_at: '',
    duration: '60',
    performance_score: [3],
    enjoyment_score: [3],
    notes: ''
  })
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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
    
    router.post(`/jobs/${jobId}/interviews`, submitData, {
      onSuccess: () => {
        setFormData({
          round_number: '1',
          interview_type: '',
          scheduled_at: '',
          duration: '60',
          performance_score: [3],
          enjoyment_score: [3],
          notes: ''
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
        <SheetTitle>Schedule Interview</SheetTitle>
        <SheetDescription>
          Add details about an upcoming or completed interview.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              <p className="text-sm text-red-600">{errors.round_number}</p>
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
              <p className="text-sm text-red-600">{errors.interview_type}</p>
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
              <p className="text-sm text-red-600">{errors.scheduled_at}</p>
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
          <p className="text-xs text-muted-foreground">
            How well did you perform in the interview?
          </p>
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
          <p className="text-xs text-muted-foreground">
            How much did you enjoy the interview experience?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Interview notes, questions asked, impressions..."
            rows={4}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Schedule Interview'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

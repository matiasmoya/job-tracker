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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Contact {
  id: number
  name: string
  role?: string
  email?: string
}

interface MessageFormProps {
  jobId: number
  applicationProcessId: number
  contacts: Contact[]
  onCancel: () => void
  onSuccess?: () => void
}

export default function MessageForm({ jobId, applicationProcessId, contacts, onCancel, onSuccess }: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    direction: 'sent',
    contact_id: '',
    sent_at: new Date().toISOString().split('T')[0], // Default to today
  })
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const newErrors: any = {}
    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required'
    }
    if (!formData.contact_id) {
      newErrors.contact_id = 'Contact is required'
    }
    if (!formData.sent_at) {
      newErrors.sent_at = 'Date is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    const submitData = {
      message: {
        content: formData.content,
        direction: formData.direction,
        contact_id: parseInt(formData.contact_id),
        sent_at: formData.sent_at
      }
    }
    
    router.post(`/jobs/${jobId}/messages`, submitData, {
      onSuccess: () => {
        setFormData({
          content: '',
          direction: 'sent',
          contact_id: '',
          sent_at: new Date().toISOString().split('T')[0],
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
        <SheetTitle>Add Message</SheetTitle>
        <SheetDescription>
          Record a message sent or received for this job application.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Direction</Label>
          <RadioGroup
            value={formData.direction}
            onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sent" id="sent" />
              <Label htmlFor="sent">Sent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="received" id="received" />
              <Label htmlFor="received">Received</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact *</Label>
          <Select
            value={formData.contact_id}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, contact_id: value }))
              if (errors.contact_id) {
                setErrors(prev => ({ ...prev, contact_id: '' }))
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id.toString()}>
                  {contact.name} {contact.role && `(${contact.role})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contact_id && (
            <p className="text-sm text-red-600">{errors.contact_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sent_at">Date *</Label>
          <Input
            id="sent_at"
            type="date"
            value={formData.sent_at}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, sent_at: e.target.value }))
              if (errors.sent_at) {
                setErrors(prev => ({ ...prev, sent_at: '' }))
              }
            }}
          />
          {errors.sent_at && (
            <p className="text-sm text-red-600">{errors.sent_at}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Message Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, content: e.target.value }))
              if (errors.content) {
                setErrors(prev => ({ ...prev, content: '' }))
              }
            }}
            placeholder="Enter the message content..."
            rows={24}
            className="min-h-[300px]"
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Message'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

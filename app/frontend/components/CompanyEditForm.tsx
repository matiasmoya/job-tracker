import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface CompanyFormData {
  name: string
  industry: string
  website: string
  linkedin_url: string
  notes: string
  tech_stack: string
}

interface Company {
  id: number
  name: string
  industry: string
  website: string
  linkedin_url: string
  notes: string
  tech_stack: string
}

interface CompanyEditFormProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CompanyEditForm({ company, open, onOpenChange }: CompanyEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    website: '',
    linkedin_url: '',
    notes: '',
    tech_stack: '',
  })
  const [errors, setErrors] = useState<Partial<CompanyFormData>>({})

  // Load company data when company prop changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        website: company.website || '',
        linkedin_url: company.linkedin_url || '',
        notes: company.notes || '',
        tech_stack: company.tech_stack || '',
      })
    }
  }, [company])

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<CompanyFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }

    if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
      newErrors.linkedin_url = 'Please enter a valid LinkedIn URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !company) {
      return
    }

    setIsSubmitting(true)

    router.patch(`/companies/${company.id}`, { company: formData }, {
      onSuccess: () => {
        onOpenChange(false)
        setErrors({})
      },
      onError: (errors) => {
        setErrors(errors)
      },
      onFinish: () => {
        setIsSubmitting(false)
      }
    })
  }

  const resetForm = () => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        website: company.website || '',
        linkedin_url: company.linkedin_url || '',
        notes: company.notes || '',
        tech_stack: company.tech_stack || '',
      })
    }
    setErrors({})
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  if (!company) return null

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Company</SheetTitle>
          <SheetDescription>
            Update company information and details.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Company Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., TechCorp Solutions"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-industry">Industry</Label>
            <Input
              id="edit-industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="e.g., Technology, Finance, Healthcare"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-website">Website</Label>
            <Input
              id="edit-website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://company.com"
              type="url"
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-linkedin_url">LinkedIn URL</Label>
            <Input
              id="edit-linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/company/example"
              type="url"
              className={errors.linkedin_url ? 'border-red-500' : ''}
            />
            {errors.linkedin_url && (
              <p className="text-sm text-red-500">{errors.linkedin_url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tech_stack">Tech Stack</Label>
            <Textarea
              id="edit-tech_stack"
              value={formData.tech_stack}
              onChange={(e) => handleInputChange('tech_stack', e.target.value)}
              placeholder="e.g., React, Node.js, PostgreSQL, AWS"
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about the company..."
              className="resize-none"
              rows={3}
            />
          </div>

          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

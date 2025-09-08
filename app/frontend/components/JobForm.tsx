import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select'
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TagInput } from '@/components/ui/tag-input'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Plus, X } from 'lucide-react'

interface JobFormData {
  title: string
  description: string
  location: string
  salary: string
  source: string
  tech_stack: string[]
  company_id: string
  contact_ids: string[]
  new_contact?: NewContactData
  new_company?: NewCompanyData
}

interface NewContactData {
  name: string
  role: string
  email: string
  linkedin_url: string
}

interface NewCompanyData {
  name: string
  industry: string
  website: string
  linkedin_url: string
}

interface Company {
  id: number
  name: string
  website?: string
}

interface Contact {
  id: number
  name: string
  role?: string
  email?: string
  company_id: number
  company_name: string
}

interface ApplicationProcess {
  id: number
  status: string
  applied_on?: string
  created_at: string
  updated_at: string
}

interface Job {
  id: number
  title: string
  company: Company
  application_process: ApplicationProcess
  location?: string
  salary?: string
  source?: string
  tech_stack?: string[]
  description?: string
  created_at: string
  updated_at: string
  contacts?: Contact[]
}

interface JobFormProps {
  companies: Company[]
  contacts: Contact[]
  job?: Job | null
  onSubmit?: (data: JobFormData) => void
  onCancel: () => void
}

export default function JobForm({ companies, contacts, job, onSubmit, onCancel }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewContact, setShowNewContact] = useState(false)
  const [showNewCompany, setShowNewCompany] = useState(false)
  
  // Initialize form data with job data if editing
  const [formData, setFormData] = useState<JobFormData>({
    title: job?.title || '',
    description: job?.description || '',
    location: job?.location || '',
    salary: job?.salary || '',
    source: job?.source || '',
    tech_stack: job?.tech_stack || [],
    company_id: job?.company?.id?.toString() || '',
    contact_ids: job?.contacts?.map(c => c.id.toString()) || [],
    new_contact: {
      name: '',
      role: '',
      email: '',
      linkedin_url: ''
    },
    new_company: {
      name: '',
      industry: '',
      website: '',
      linkedin_url: ''
    }
  })
  const [errors, setErrors] = useState<any>({})

  // Load job data when editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        source: job.source || '',
        salary: job.salary || '',
        tech_stack: job.tech_stack || [],
        company_id: job.company.id.toString(),
        contact_ids: job.contacts?.map(c => c.id.toString()) || [],
        new_contact: {
          name: '',
          role: '',
          email: '',
          linkedin_url: ''
        },
        new_company: {
          name: '',
          industry: '',
          website: '',
          linkedin_url: ''
        }
      })
    }
  }, [job])

  const handleInputChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    // Reset contact selection when company changes
    if (field === 'company_id') {
      setFormData(prev => ({ ...prev, contact_ids: [] }))
      setShowNewContact(false)
    }
  }
  
  const handleCompanySelectChange = (value: string) => {
    if (value === 'new') {
      setShowNewCompany(true)
      // Don't clear company_id here, keep the previous selection
    } else {
      setShowNewCompany(false)
      setFormData(prev => ({ 
        ...prev, 
        company_id: value,
        contact_ids: [] // Reset contacts when company changes
      }))
      setShowNewContact(false)
    }
  }
  
  const handleNewCompanyChange = (field: keyof NewCompanyData, value: string) => {
    setFormData(prev => ({
      ...prev,
      new_company: {
        ...prev.new_company!,
        [field]: value
      }
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    }

    if (!formData.company_id && !showNewCompany) {
      newErrors.company_id = 'Company is required'
    }
    
    if (showNewCompany && !formData.new_company?.name?.trim()) {
      newErrors['new_company.name'] = 'Company name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Validate new contact if provided
    if (formData.new_contact?.name?.trim()) {
      // Contact data exists, will be included in submission
    }

    // Build submit data consistently
    const submitData: any = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      salary: formData.salary,
      source: formData.source,
      tech_stack: formData.tech_stack.join(','),  // Convert array to comma-separated string
      contact_ids: formData.contact_ids,
      company_id: formData.company_id,
      new_contact: formData.new_contact,
      new_company: formData.new_company
    }
    
    if (onSubmit) {
      // Pass data to parent handler
      onSubmit(submitData)
      return
    }

    // Fallback to direct router submission
    setIsSubmitting(true)
    
    // Transform data for Rails controller
    const railsSubmitData: any = {
      title: submitData.title,
      description: submitData.description,
      location: submitData.location,
      salary: submitData.salary,
      source: submitData.source,
      tech_stack: submitData.tech_stack,  // Already a comma-separated string
      contact_ids: submitData.contact_ids.map((id: string) => parseInt(id, 10))
    }
    
    // Add company_id or new_company_attributes based on what's selected
    if (showNewCompany && submitData.new_company?.name) {
      railsSubmitData.new_company_attributes = submitData.new_company
    } else {
      railsSubmitData.company_id = parseInt(submitData.company_id, 10)
    }
    
    // Add new_contact_attributes if creating a new contact
    if (submitData.new_contact?.name?.trim()) {
      railsSubmitData.new_contact_attributes = submitData.new_contact
    }

    const url = job ? `/jobs/${job.id}` : '/jobs'
    const method = job ? 'patch' : 'post'

    router[method](url, { job_opening: railsSubmitData }, {
      onSuccess: () => {
        if (!job) {
          // Reset form only for new jobs
          setFormData({
            title: '',
            description: '',
            location: '',
            salary: '',
            source: '',
            tech_stack: [],
            company_id: '',
            contact_ids: [],
            new_contact: {
              name: '',
              role: '',
              email: '',
              linkedin_url: ''
            },
            new_company: {
              name: '',
              industry: '',
              website: '',
              linkedin_url: ''
            }
          })
          setShowNewCompany(false)
          setShowNewContact(false)
        }
        setErrors({})
      }
    })
  }

  // Filter contacts by selected company
  const filteredContacts = formData.company_id 
    ? contacts.filter(c => c.company_id === parseInt(formData.company_id))
    : []

  const handleContactChange = (value: string) => {
    if (value === 'new') {
      setShowNewContact(true)
    } else {
      // Toggle contact selection
      const currentIds = formData.contact_ids || []
      if (currentIds.includes(value)) {
        setFormData(prev => ({
          ...prev,
          contact_ids: currentIds.filter(id => id !== value)
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          contact_ids: [...currentIds, value]
        }))
      }
    }
  }

  const handleRemoveContact = (contactId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only allow immediate removal when editing an existing job
    if (!job) {
      // For new jobs, just update the form state
      setFormData(prev => ({
        ...prev,
        contact_ids: prev.contact_ids.filter(id => id !== contactId)
      }))
      return
    }
    
    // For existing jobs, immediately update on the server
    const newContactIds = formData.contact_ids.filter(id => id !== contactId)
    
    // Update local state immediately for UI feedback
    setFormData(prev => ({
      ...prev,
      contact_ids: newContactIds
    }))
    
    // Send update to server
    const submitData: any = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      source: formData.source,
      salary: formData.salary,
      company_id: parseInt(formData.company_id, 10),
      contact_ids: newContactIds.map(id => parseInt(id, 10))
    }
    
    router.patch(`/jobs/${job.id}`, { job_opening: submitData }, {
      preserveState: true,
      preserveScroll: true,
      onError: () => {
        // On error, restore the contact
        setFormData(prev => ({
          ...prev,
          contact_ids: [...prev.contact_ids, contactId]
        }))
      }
    })
  }

  const handleNewContactChange = (field: keyof NewContactData, value: string) => {
    setFormData(prev => ({
      ...prev,
      new_contact: {
        ...prev.new_contact!,
        [field]: value
      }
    }))
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <SheetHeader>
          <SheetTitle>{job ? 'Edit Job' : 'New Job'}</SheetTitle>
          <SheetDescription>
            {job ? 'Update the job details below.' : 'Add a new job opportunity to track.'}
          </SheetDescription>
        </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          {!showNewCompany ? (
            <div className="space-y-2">
              <select
                id="company"
                value={formData.company_id}
                onChange={(e) => handleCompanySelectChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id.toString()}>
                    {company.name}
                  </option>
                ))}
                <option value="new">➕ Add new company</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm">Creating new company</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNewCompany(false)
                  setFormData(prev => ({ ...prev, company_id: '' }))
                }}
              >
                <X className="h-4 w-4" />
                <span className="ml-1">Cancel</span>
              </Button>
            </div>
          )}
          {errors.company_id && (
            <p className="text-sm text-red-600">{errors.company_id}</p>
          )}
          {errors['new_company.name'] && (
            <p className="text-sm text-red-600">{errors['new_company.name']}</p>
          )}
        </div>

        {/* New Company Form */}
        {showNewCompany && (
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">New Company Details</h4>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-xs">Name *</Label>
                <Input
                  id="company_name"
                  type="text"
                  value={formData.new_company?.name || ''}
                  onChange={(e) => handleNewCompanyChange('name', e.target.value)}
                  placeholder="e.g. Tech Innovations Inc."
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_industry" className="text-xs">Industry</Label>
                <Input
                  id="company_industry"
                  type="text"
                  value={formData.new_company?.industry || ''}
                  onChange={(e) => handleNewCompanyChange('industry', e.target.value)}
                  placeholder="e.g. Technology, Finance, Healthcare"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_website" className="text-xs">Website</Label>
                <Input
                  id="company_website"
                  type="url"
                  value={formData.new_company?.website || ''}
                  onChange={(e) => handleNewCompanyChange('website', e.target.value)}
                  placeholder="https://company.com"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_linkedin" className="text-xs">LinkedIn URL</Label>
                <Input
                  id="company_linkedin"
                  type="url"
                  value={formData.new_company?.linkedin_url || ''}
                  onChange={(e) => handleNewCompanyChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company/example"
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Selection */}
        {formData.company_id && !showNewCompany && (
          <div className="space-y-2">
            <Label htmlFor="contacts">Contacts</Label>
            {filteredContacts.length > 0 ? (
              <div className="space-y-2">
                <Select onValueChange={handleContactChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select or add contacts" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredContacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id.toString()}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.contact_ids.includes(contact.id.toString())}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span>{contact.name} {contact.role && `(${contact.role})`}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add new contact</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Selected contacts display */}
                {formData.contact_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.contact_ids.map(id => {
                      const contact = contacts.find(c => c.id.toString() === id)
                      if (!contact) return null
                      return (
                        <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                          <span>{contact.name}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveContact(id, e)}
                            className="ml-1 p-0.5 hover:text-destructive focus:outline-none"
                            aria-label={`Remove ${contact.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewContact(true)}
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add new contact
              </Button>
            )}
          </div>
        )}

        {/* New Contact Form */}
        {showNewContact && formData.company_id && (
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">New Contact</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewContact(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="text-xs">Name *</Label>
                <Input
                  id="contact_name"
                  type="text"
                  value={formData.new_contact?.name || ''}
                  onChange={(e) => handleNewContactChange('name', e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_role" className="text-xs">Role</Label>
                <Input
                  id="contact_role"
                  type="text"
                  value={formData.new_contact?.role || ''}
                  onChange={(e) => handleNewContactChange('role', e.target.value)}
                  placeholder="e.g. Hiring Manager"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-xs">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.new_contact?.email || ''}
                  onChange={(e) => handleNewContactChange('email', e.target.value)}
                  placeholder="jane.smith@company.com"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_linkedin" className="text-xs">LinkedIn URL</Label>
                <Input
                  id="contact_linkedin"
                  type="url"
                  value={formData.new_contact?.linkedin_url || ''}
                  onChange={(e) => handleNewContactChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/janesmith"
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            type="url"
            value={formData?.source || ''}
            onChange={(e) => handleInputChange('source', e.target.value)}
            placeholder="Job post URL or referral link"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g. San Francisco, CA (Remote)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary Range</Label>
          <Input
            id="salary"
            type="text"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            placeholder="e.g. $120,000 - $150,000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tech_stack">Tech Stack</Label>
          <TagInput
            value={formData.tech_stack}
            onChange={(tags) => setFormData(prev => ({ ...prev, tech_stack: tags }))}
            placeholder="e.g. React, Node.js, PostgreSQL (press Enter or comma to add)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <MinimalTiptapEditor
            value={formData.description}
            onChange={(value) => handleInputChange('description', value as string)}
            placeholder="Job description, requirements, or notes..."
            output="html"
            editorClassName="min-h-[150px] max-h-[400px] overflow-y-auto"
            editorContentClassName="p-3"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting 
              ? (job ? 'Updating...' : 'Creating...') 
              : (job ? 'Update Job' : 'Create Job')
            }
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
      </div>
    </TooltipProvider>
  )
}

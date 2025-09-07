import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/components/AppLayout'
import ContactsTable from '@/components/ContactsTable'
import ContactForm from '@/components/ContactForm'
import ContactEditForm from '@/components/ContactEditForm'
import { ThemeProvider } from '@/components/ThemeProvider'

interface Contact {
  id: number
  name: string
  role: string | null
  email: string | null
  linkedin_url: string | null
  notes: string | null
  company: {
    id: number
    name: string
  }
  created_at: string
}

interface Company {
  id: number
  name: string
}

interface ContactsProps {
  contacts: Contact[]
  companies: Company[]
}

export default function Contacts({ contacts, companies }: ContactsProps) {
  const [editingContact, setEditingContact] = useState<any>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  const handleContactClick = async (contact: Contact) => {
    try {
      const response = await fetch(`/contacts/${contact.id}`)
      const fullContactData = await response.json()
      setEditingContact(fullContactData)
      setIsEditFormOpen(true)
    } catch (error) {
      console.error('Failed to fetch contact data:', error)
    }
  }

  const handleEditFormClose = () => {
    setIsEditFormOpen(false)
    setEditingContact(null)
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="job-tracker-theme">
      <AppLayout>
        <Head title="Contacts" />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground">
                Manage contacts and track relationships with people at companies.
              </p>
            </div>
            <ContactForm companies={companies} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                All Contacts
              </h2>
              <div className="text-sm text-muted-foreground">
                {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
              </div>
            </div>
            
            <ContactsTable contacts={contacts} onContactClick={handleContactClick} />
          </div>
        </div>

        <ContactEditForm 
          contact={editingContact}
          companies={companies}
          open={isEditFormOpen}
          onOpenChange={handleEditFormClose}
        />
      </AppLayout>
    </ThemeProvider>
  )
}

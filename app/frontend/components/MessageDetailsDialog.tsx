import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquareIcon, 
  CalendarIcon, 
  UserIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  MailIcon,
  LinkedinIcon
} from 'lucide-react'

interface MessageData {
  id: number
  content: string
  direction: string
  sent_at: string
  contact_name: string
  contact_role?: string | null
  contact_email?: string | null
  contact_linkedin_url?: string | null
  short_content: string
}

interface MessageDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageData: MessageData | null
}

export default function MessageDetailsDialog({ 
  open, 
  onOpenChange, 
  messageData 
}: MessageDetailsDialogProps) {
  if (!messageData) return null

  const isSent = messageData.direction === 'sent'
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isSent ? 'bg-primary/10' : 'bg-secondary/10'
              }`}>
                {isSent ? (
                  <ArrowRightIcon className="h-5 w-5 text-primary" />
                ) : (
                  <ArrowLeftIcon className="h-5 w-5 text-secondary-foreground" />
                )}
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <DialogTitle className="text-xl">
                {isSent ? 'Message Sent' : 'Message Received'}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isSent ? 'To' : 'From'} {messageData.contact_name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={isSent ? 'default' : 'secondary'}>
                {isSent ? 'Sent' : 'Received'}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDateTime(messageData.sent_at)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact</h3>
            <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium">{messageData.contact_name}</h4>
                {messageData.contact_role && (
                  <p className="text-sm text-muted-foreground">{messageData.contact_role}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-2">
                  {messageData.contact_email && (
                    <a 
                      href={`mailto:${messageData.contact_email}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <MailIcon className="h-3 w-3" />
                      {messageData.contact_email}
                    </a>
                  )}
                  {messageData.contact_linkedin_url && (
                    <a 
                      href={messageData.contact_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <LinkedinIcon className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Message Content */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Message Content</h3>
            <div className="p-4 rounded-lg bg-muted/30 border">
              <div className="text-sm whitespace-pre-wrap break-words">
                {messageData.content}
              </div>
            </div>
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, Inbox, Calendar } from 'lucide-react'

interface Message {
  id: number
  content: string
  direction: 'sent' | 'received'
  sent_at: string
  contact_name: string
  short_content: string
}

interface JobConversationDialogProps {
  message: Message | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function JobConversationDialog({ 
  message, 
  open, 
  onOpenChange 
}: JobConversationDialogProps) {
  if (!message) return null

  const directionIcon = message.direction === 'sent' ? Send : Inbox
  const DirectionIcon = directionIcon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation with {message.contact_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Message Header */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <DirectionIcon className="h-4 w-4" />
                <Badge 
                  variant={message.direction === 'sent' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {message.direction === 'sent' ? 'Sent' : 'Received'}
                </Badge>
                <span className="text-sm font-medium">
                  {message.direction === 'sent' ? 'To' : 'From'} {message.contact_name}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{message.sent_at}</span>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Message Content</h4>
              <div className="prose prose-sm max-w-none">
                <div className="p-4 bg-card rounded-lg border whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>

            {/* Message Actions/Info */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                Message ID: {message.id}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {message.direction === 'sent' ? 'Outgoing' : 'Incoming'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

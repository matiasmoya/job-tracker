import React, { useEffect, useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquareIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface MessagesExpandedSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: MessageData[]
  jobTitle: string
  companyName: string
}

export default function MessagesExpandedSheet({
  open,
  onOpenChange,
  messages,
  jobTitle,
  companyName
}: MessagesExpandedSheetProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const formatDateTime = (dateString: string) => {
    console.log(dateString)
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  // Group messages by date for better organization
  const groupedMessages = React.useMemo(() => {
    const groups: { [key: string]: MessageData[] } = {}
    
    // Sort messages chronologically (oldest first for chat view)
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
    )
    
    sortedMessages.forEach(message => {
      const dateKey = new Date(message.sent_at).toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    )
  }, [messages])

  // Scroll to bottom when sheet opens or messages change
  useEffect(() => {
    if (open && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [open, messages])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquareIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <SheetTitle className="text-xl">Message History</SheetTitle>
              <SheetDescription className="mt-1">
                {jobTitle} at {companyName}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Messages Container */}
        <div className="flex-1 flex flex-col min-h-0 -mx-6">
          <div className="flex-1 px-6 overflow-y-auto" ref={scrollAreaRef}>
            <div className="space-y-6 py-4">
              {groupedMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquareIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No messages in this conversation</p>
                </div>
              ) : (
                groupedMessages.map(([dateKey, dayMessages]) => (
                  <div key={dateKey} className="space-y-4">
                    {/* Date Header */}
                    <div className="flex items-center justify-center">
                      <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        {formatDateHeader(dateKey)}
                      </div>
                    </div>

                    {/* Messages for this date */}
                    <div className="space-y-3">
                      {dayMessages.map((message, index) => {
                        const isSent = message.direction === 'sent'
                        const isFirstInSequence = index === 0 || dayMessages[index - 1].direction !== message.direction
                        const isLastInSequence = index === dayMessages.length - 1 || dayMessages[index + 1].direction !== message.direction
                        const isConsecutive = !isFirstInSequence

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3 max-w-[80%]",
                              isSent ? "ml-auto flex-row-reverse" : "mr-auto",
                              isConsecutive && "-mt-1" // Tighter spacing for consecutive messages
                            )}
                          >
                            {/* Avatar */}
                            {!isSent && isFirstInSequence && (
                              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 self-end">
                                <UserIcon className="h-4 w-4 text-secondary-foreground" />
                              </div>
                            )}
                            
                            {!isSent && !isFirstInSequence && (
                              <div className="w-8 h-8 flex-shrink-0" />
                            )}

                            {/* Message Bubble */}
                            <div className="flex flex-col space-y-1 min-w-0 flex-1">
                              {/* Contact name for received messages (first in sequence) */}
                              {!isSent && isFirstInSequence && (
                                <div className="text-xs text-muted-foreground px-3">
                                  {message.contact_name}
                                  {message.contact_role && ` • ${message.contact_role}`}
                                </div>
                              )}

                              {/* Message Content */}
                              <div
                                className={cn(
                                  "px-4 py-3 max-w-full break-words shadow-sm",
                                  isSent
                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                                    : "bg-muted text-foreground rounded-2xl rounded-bl-md",
                                  isFirstInSequence && isSent && "rounded-tr-md",
                                  isFirstInSequence && !isSent && "rounded-tl-md",
                                  isLastInSequence && isSent && "rounded-br-xl",
                                  isLastInSequence && !isSent && "rounded-bl-xl"
                                )}
                              >
                                <div className={cn(
                                  "text-sm whitespace-pre-wrap leading-relaxed",
                                  isSent ? "text-right" : "text-left"
                                )}>
                                  {message.content}
                                </div>
                              </div>

                              {/* Timestamp (last in sequence) */}
                              {isLastInSequence && (
                                <div className={cn(
                                  "text-xs text-muted-foreground px-1",
                                  isSent ? "text-right" : "text-left"
                                )}>
                                  {formatDateTime(message.sent_at)}
                                </div>
                              )}
                            </div>

                            {/* Sent message indicator */}
                            {isSent && isFirstInSequence && (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 self-end">
                                <ArrowRightIcon className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            
                            {isSent && !isFirstInSequence && (
                              <div className="w-8 h-8 flex-shrink-0" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {messages.filter(m => m.direction === 'sent').length} sent
              </Badge>
              <Badge variant="outline" className="text-xs">
                {messages.filter(m => m.direction === 'received').length} received
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs">
              {messages.length} total message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

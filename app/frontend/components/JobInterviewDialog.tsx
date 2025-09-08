import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { VideoIcon, Calendar, Clock, Star, Heart, FileText } from 'lucide-react'

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

interface JobInterviewDialogProps {
  interview: Interview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function JobInterviewDialog({ 
  interview, 
  open, 
  onOpenChange 
}: JobInterviewDialogProps) {
  if (!interview) return null

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'technical':
        return FileText
      case 'behavioral':
        return Heart
      case 'system_design':
        return FileText
      default:
        return VideoIcon
    }
  }

  const TypeIcon = getTypeIcon(interview.interview_type)

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatInterviewType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5" />
            Round {interview.round_number}: {formatInterviewType(interview.interview_type)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Interview Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Scheduled</div>
                    <div className="text-sm font-medium">{interview.scheduled_at}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="text-sm font-medium">{interview.duration}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Round {interview.round_number}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {formatInterviewType(interview.interview_type)}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Interview ID</div>
                  <div className="text-sm font-mono">#{interview.id}</div>
                </div>
              </div>
            </div>

            {/* Scores Section */}
            {(interview.performance_score || interview.enjoyment_score) && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Interview Scores
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {interview.performance_score && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Performance</span>
                        <span className={`text-lg font-bold ${getScoreColor(interview.performance_score)}`}>
                          {interview.performance_score}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            interview.performance_score >= 8 ? 'bg-green-500' :
                            interview.performance_score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(interview.performance_score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {interview.enjoyment_score && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Enjoyment</span>
                        <span className={`text-lg font-bold ${getScoreColor(interview.enjoyment_score)}`}>
                          {interview.enjoyment_score}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            interview.enjoyment_score >= 8 ? 'bg-green-500' :
                            interview.enjoyment_score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(interview.enjoyment_score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {interview.performance_score && interview.enjoyment_score && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Score</span>
                      <span className="text-xl font-bold text-primary">
                        {((interview.performance_score + interview.enjoyment_score) / 2).toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes Section */}
            {interview.notes && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Interview Notes
                </h4>
                <div className="p-4 bg-card rounded-lg border">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {interview.notes}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                This was the {interview.round_number === 1 ? '1st' : 
                            interview.round_number === 2 ? '2nd' : 
                            interview.round_number === 3 ? '3rd' : 
                            `${interview.round_number}th`} interview round for this application.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

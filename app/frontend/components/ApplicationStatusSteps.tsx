import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Check, Circle, Clock, FileText, MessageSquare, Trophy, X, Archive } from 'lucide-react'

interface ApplicationStatusStepsProps {
  currentStatus: string
  appliedOn?: string
  onStatusChange: (newStatus: string) => void
}

const statusSteps = [
  { key: 'draft', label: 'Draft', icon: FileText, description: 'Planning and preparing' },
  { key: 'applied', label: 'Applied', icon: MessageSquare, description: 'Application submitted' },
  { key: 'in_review', label: 'In Review', icon: Clock, description: 'Under consideration' },
  { key: 'interviewing', label: 'Interviewing', icon: Circle, description: 'Interview process' },
  { key: 'offer', label: 'Offer', icon: Trophy, description: 'Offer received' },
  { key: 'rejected', label: 'Rejected', icon: X, description: 'Application rejected' },
  { key: 'closed', label: 'Closed', icon: Archive, description: 'Process completed' }
]

export default function ApplicationStatusSteps({ 
  currentStatus,
  appliedOn, 
  onStatusChange 
}: ApplicationStatusStepsProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const currentStatusIndex = statusSteps.findIndex(step => step.key === currentStatus)

  const handleStatusClick = (statusKey: string) => {
    if (statusKey === currentStatus || isUpdating) return
    onStatusChange(statusKey)
  }

  const getStepState = (stepIndex: number, stepKey: string) => {
    if (stepKey === currentStatus) return 'current'
    if (stepIndex < currentStatusIndex) return 'completed'
    if (stepKey === 'rejected' || stepKey === 'closed') return 'terminal'
    return 'upcoming'
  }

  const getStepStyles = (state: string, stepKey: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500'
      case 'current':
        return 'bg-blue-500 text-white border-blue-500'
      case 'terminal':
        if (stepKey === 'rejected') return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
        if (stepKey === 'closed') return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
        return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
      default:
        return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
    }
  }

  const isClickable = (stepKey: string) => {
    return stepKey !== currentStatus && !isUpdating
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Application Progress</h3>
        {appliedOn && (
          <span className="text-sm text-muted-foreground">
            Applied on {new Date(appliedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Status Steps */}
      <div className="flex flex-wrap gap-2">
        {statusSteps.map((step, index) => {
          const state = getStepState(index, step.key)
          const Icon = step.icon
          const isUpdatingThis = isUpdating === step.key

          return (
            <Button
              key={step.key}
              variant="outline"
              size="sm"
              onClick={() => handleStatusClick(step.key)}
              disabled={!isClickable(step.key)}
              className={`
                flex items-center gap-2 transition-all
                ${getStepStyles(state, step.key)}
                ${isClickable(step.key) ? 'cursor-pointer' : 'cursor-default'}
                ${isUpdatingThis ? 'opacity-50' : ''}
              `}
            >
              {state === 'completed' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Icon className={`h-3 w-3 ${isUpdatingThis ? 'animate-pulse' : ''}`} />
              )}
              <span className="text-xs font-medium">{step.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Progress Line */}
      <div className="relative">
        <div className="absolute top-0 h-0.5 bg-gray-200 w-full"></div>
        <div 
          className="absolute top-0 h-0.5 bg-blue-500 transition-all duration-300"
          style={{ 
            width: `${Math.max(0, (currentStatusIndex / (statusSteps.length - 1)) * 100)}%` 
          }}
        ></div>
      </div>

      {/* Status Details */}
      {currentStatusIndex >= 0 && (
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              Current Status
            </Badge>
            <span className="font-medium text-sm">
              {statusSteps[currentStatusIndex].label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {statusSteps[currentStatusIndex].description}
          </p>
          
          {/* Additional status info */}
          <div className="mt-2 space-y-1">
            {appliedOn && (
              <div className="text-xs text-muted-foreground">
                Applied on: {new Date(appliedOn).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

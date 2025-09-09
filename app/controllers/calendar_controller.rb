class CalendarController < ApplicationController
  def index
    # Fetch all interviews with their associated data including contacts
    interviews = Interview.includes(
      :application_process,
      job_opening: [ :company, { contacts: [] } ]
    ).order(:scheduled_at)

    # Fetch all tasks with their associated data
    tasks = Task.includes(
      :application_process,
      application_process: { job_opening: [ :company ] }
    ).where.not(due_date: nil).order(:due_date)

    # Format interviews for the calendar
    formatted_interviews = interviews.map do |interview|
      {
        id: "interview-#{interview.id}",
        title: interview.display_title,
        start: interview.event_starts_at,
        end: interview.event_ends_at,
        type: "interview",
        data: {
          interview_id: interview.id,
          company_name: interview.company.name,
          job_title: interview.job_opening.title,
          job_opening_id: interview.job_opening.id,
          interview_type: interview.interview_type.humanize,
          round_number: interview.round_number,
          duration: interview.duration_display,
          performance_score: interview.performance_score,
          enjoyment_score: interview.enjoyment_score,
          scheduled_at: interview.scheduled_at.strftime("%B %d, %Y at %I:%M %p"),
          contacts: interview.job_opening.contacts.map do |contact|
            {
              id: contact.id,
              name: contact.name,
              title: contact.role,
              email: contact.email,
              linkedin_url: contact.linkedin_url
            }
          end
        }
      }
    end

    # Format tasks for the calendar
    formatted_tasks = tasks.map do |task|
      {
        id: "task-#{task.id}",
        title: task.display_title,
        start: task.event_starts_at,
        end: task.event_ends_at,
        type: "task",
        data: {
          task_id: task.id,
          title: task.title,
          completed: task.is_completed?,
          overdue: task.is_overdue?,
          status: task.status_display,
          notes: task.notes,
          due_date: task.due_date&.strftime("%B %d, %Y"),
          application_process_id: task.application_process&.id,
          job_title: task.application_process&.job_opening&.title,
          company_name: task.application_process&.job_opening&.company&.name
        }
      }
    end

    # Combine all events
    events = formatted_interviews + formatted_tasks

    render inertia: "Calendar", props: {
      events: events,
      current_date: Date.current.iso8601
    }
  end

  def update_task
    task = Task.find(params[:id])

    if task.update(task_params)
      render json: { success: true, task: {
        id: task.id,
        completed: task.is_completed?,
        status: task.status_display
      } }
    else
      render json: { success: false, errors: task.errors.full_messages }
    end
  end

  private

  def task_params
    params.require(:task).permit(:completed)
  end
end

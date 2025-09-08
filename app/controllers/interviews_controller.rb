class InterviewsController < ApplicationController
  allow_unauthenticated_access
  before_action :find_job
  
  def create
    @interview = @job.application_process.interviews.build(interview_params)
    
    if @interview.save
      redirect_to jobs_path(job_id: @job.id), notice: "Interview scheduled successfully."
    else
      redirect_to jobs_path(job_id: @job.id), alert: @interview.errors.full_messages.join(", ")
    end
  end
  
  private
  
  def find_job
    @job = JobOpening.find(params[:job_id])
  end
  
  def interview_params
    params.require(:interview).permit(:round_number, :interview_type, :scheduled_at, 
                                      :duration, :performance_score, :enjoyment_score, :notes)
  end
end

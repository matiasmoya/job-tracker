class InterviewsController < ApplicationController
  before_action :find_job
  before_action :find_interview, only: [:update, :destroy]

  def create
    @interview = @job.application_process.interviews.build(interview_params)

    if @interview.save
      redirect_to jobs_path(job_id: @job.id), notice: "Interview scheduled successfully."
    else
      redirect_to jobs_path(job_id: @job.id), alert: @interview.errors.full_messages.join(", ")
    end
  end

  def update
    if @interview.update(interview_params)
      redirect_to jobs_path(job_id: @job.id), notice: "Interview updated successfully."
    else
      redirect_to jobs_path(job_id: @job.id), alert: @interview.errors.full_messages.join(", ")
    end
  end

  def destroy
    @interview.destroy
    redirect_to jobs_path(job_id: @job.id), notice: "Interview deleted successfully."
  end

  private

  def find_job
    @job = JobOpening.find(params[:job_id])
  end

  def find_interview
    @interview = @job.application_process.interviews.find(params[:id])
  end

  def interview_params
    params.require(:interview).permit(:round_number, :interview_type, :scheduled_at,
                                      :duration, :performance_score, :enjoyment_score, :notes)
  end
end

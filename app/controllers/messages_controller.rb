class MessagesController < ApplicationController
  allow_unauthenticated_access
  before_action :find_job
  
  def create
    @message = @job.application_process.messages.build(message_params)
    
    if @message.save
      redirect_to jobs_path(job_id: @job.id), notice: "Message added successfully."
    else
      redirect_to jobs_path(job_id: @job.id), alert: @message.errors.full_messages.join(", ")
    end
  end
  
  private
  
  def find_job
    @job = JobOpening.find(params[:job_id])
  end
  
  def message_params
    params.require(:message).permit(:content, :direction, :contact_id, :sent_at)
  end
end

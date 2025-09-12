class DirectMessagesController < ApplicationController
  before_action :find_job

  def create
    @direct_message = @job.application_process.direct_messages.build(direct_message_params)

    if @direct_message.save
      redirect_to jobs_path(job_id: @job.id), notice: "Message added successfully."
    else
      redirect_to jobs_path(job_id: @job.id), alert: @direct_message.errors.full_messages.join(", ")
    end
  end

  private

  def find_job
    @job = JobOpening.find(params[:job_id])
  end

  def direct_message_params
    params.require(:direct_message).permit(:content, :direction, :contact_id, :sent_at)
  end
end

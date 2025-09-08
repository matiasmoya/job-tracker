class TasksController < ApplicationController
  before_action :find_job

  def create
    @task = @job.application_process.tasks.build(task_params)
    @task.user = Current.user if Current.user

    if @task.save
      redirect_to jobs_path(job_id: @job.id), notice: "Task added successfully."
    else
      Rails.logger.error "Task save failed: #{@task.errors.full_messages.join(', ')}"
      redirect_to jobs_path(job_id: @job.id), alert: @task.errors.full_messages.join(", ")
    end
  end

  private

  def find_job
    @job = JobOpening.find(params[:job_id])
  end

  def task_params
    params.require(:task).permit(:title, :notes, :due_date, :completed)
  end
end

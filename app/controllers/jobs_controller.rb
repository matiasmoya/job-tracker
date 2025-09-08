class JobsController < ApplicationController
  before_action :find_job, only: [ :show, :update ]
  skip_before_action :verify_authenticity_token, if: :json_request?

  private

  def json_request?
    request.format.json?
  end

  public

  def index
        Rails.logger.info("CURRENT USER: #{Current.user.inspect}")
    Rails.logger.info("CURRENT USER: #{Current.user.inspect}")
    Rails.logger.info("CURRENT USER: #{Current.user.inspect}")
    Rails.logger.info("CURRENT USER: #{Current.user.inspect}")
    Rails.logger.info("CURRENT USER: #{Current.user.inspect}")
    Rails.logger.info("CURRENT USER: #{Current.user.inspect}")
    @jobs = JobOpening.includes(:company, application_process: [ :interviews, :messages, :tasks ])
                     .order(updated_at: :desc)

    @companies = Company.order(:name)
    @contacts = Contact.includes(:company).order(:name)

    # Get the selected job or default to the most recently updated
    selected_job_id = params[:job_id]
    @selected_job = if selected_job_id.present?
                      @jobs.find_by(id: selected_job_id)
    else
                      @jobs.first
    end

    render inertia: "Jobs", props: {
      jobs: @jobs.map do |job|
        {
          id: job.id,
          title: job.title,
          company: {
            id: job.company.id,
            name: job.company.name,
            website: job.company.website
          },
          application_process: job.application_process ? {
            id: job.application_process.id,
            status: job.application_process.status,
            applied_on: job.application_process.applied_on&.iso8601,
            created_at: job.application_process.created_at.iso8601,
            updated_at: job.application_process.updated_at.iso8601
          } : nil,
          description: job.description,
          location: job.location,
          salary: job.salary,
          tech_stack: job.tech_stack.to_s.split(',').map(&:strip).reject(&:empty?),
          created_at: job.created_at.iso8601,
          updated_at: job.updated_at.iso8601
        }
      end,
      companies: @companies.map { |c| { id: c.id, name: c.name, website: c.website } },
      contacts: @contacts.map { |c| {
        id: c.id,
        name: c.name,
        role: c.role,
        email: c.email,
        company_id: c.company_id,
        company_name: c.company.name
      } },
      selectedJob: @selected_job ? serialize_job_for_details(@selected_job) : nil,
      showForm: params[:creating_new] == "true"
    }
  end

  def create
    # Handle new company creation if provided
    if params[:job_opening][:new_company_attributes].present?
      company_attrs = params[:job_opening][:new_company_attributes]
      if company_attrs[:name].present?
        new_company = Company.create!(
          name: company_attrs[:name],
          industry: company_attrs[:industry],
          website: company_attrs[:website],
          linkedin_url: company_attrs[:linkedin_url]
        )
        params[:job_opening][:company_id] = new_company.id
      end
    end

    @job = JobOpening.new(job_params.except(:contact_ids, :new_contact_attributes, :new_company_attributes))

    if @job.save
      # Create associated ApplicationProcess
      @job.create_application_process!(status: "draft")

      # Collect all contact IDs to associate
      contact_ids_to_associate = []

      # Add existing contact IDs if provided
      if params[:job_opening].key?(:contact_ids)
        contact_ids_to_associate = params[:job_opening][:contact_ids] || []
      end

      # Handle new contact creation and add to the list
      if params[:job_opening][:new_contact_attributes].present?
        contact_attrs = params[:job_opening][:new_contact_attributes]
        if contact_attrs[:name].present?
          new_contact = Contact.create!(
            name: contact_attrs[:name],
            role: contact_attrs[:role],
            email: contact_attrs[:email],
            linkedin_url: contact_attrs[:linkedin_url],
            company_id: @job.company_id
          )
          contact_ids_to_associate << new_contact.id
        end
      end

      # Associate all contacts at once
      @job.contact_ids = contact_ids_to_associate

      respond_to do |format|
        format.html { redirect_to jobs_path(job_id: @job.id), notice: "Job was successfully created." }
        format.json { render json: serialize_job_for_details(@job), status: :created }
      end
    else
      respond_to do |format|
        format.html { redirect_to jobs_path(creating_new: "true"), alert: @job.errors.full_messages.join(", ") }
        format.json { render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def show
    respond_to do |format|
      # For Inertia requests, redirect to index with the job selected
      format.html { redirect_to jobs_path(job_id: @job.id) }
      # For JSON API requests, return the job details
      format.json { render json: serialize_job_for_details(@job) }
    end
  end

  def update
    # Handle new company creation if provided
    if params[:job_opening][:new_company_attributes].present?
      company_attrs = params[:job_opening][:new_company_attributes]
      if company_attrs[:name].present?
        new_company = Company.create!(
          name: company_attrs[:name],
          industry: company_attrs[:industry],
          website: company_attrs[:website],
          linkedin_url: company_attrs[:linkedin_url]
        )
        params[:job_opening][:company_id] = new_company.id
      end
    end

    if @job.update(job_params.except(:contact_ids, :new_contact_attributes, :new_company_attributes))
      # Collect all contact IDs to associate
      contact_ids_to_associate = []

      # Add existing contact IDs if provided
      if params[:job_opening].key?(:contact_ids)
        contact_ids_to_associate = params[:job_opening][:contact_ids] || []
      end

      # Handle new contact creation and add to the list
      if params[:job_opening][:new_contact_attributes].present?
        contact_attrs = params[:job_opening][:new_contact_attributes]
        if contact_attrs[:name].present?
          new_contact = Contact.create!(
            name: contact_attrs[:name],
            role: contact_attrs[:role],
            email: contact_attrs[:email],
            linkedin_url: contact_attrs[:linkedin_url],
            company_id: @job.company_id
          )
          # Only add if not already in the list
          unless contact_ids_to_associate.map(&:to_i).include?(new_contact.id)
            contact_ids_to_associate << new_contact.id
          end
        end
      end

      # Associate all contacts at once
      @job.contact_ids = contact_ids_to_associate

      respond_to do |format|
        format.html { redirect_to jobs_path(job_id: @job.id), notice: "Job was successfully updated." }
        format.json { render json: serialize_job_for_details(@job) }
      end
    else
      respond_to do |format|
        format.html { redirect_to jobs_path(job_id: @job.id), alert: @job.errors.full_messages.join(", ") }
        format.json { render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def update_status
    @job = JobOpening.find(params[:id])
    @application_process = @job.application_process || @job.create_application_process!

    old_status = @application_process.status
    new_status = params[:status]

    # Handle applied_on date logic
    if old_status == "draft" && new_status == "applied"
      @application_process.applied_on = Date.current
    elsif new_status == "draft" && old_status != "draft"
      @application_process.applied_on = nil
    end

    if @application_process.update(status: new_status)
      respond_to do |format|
        format.json { render json: {
          success: true,
          status: @application_process.status,
          applied_on: @application_process.applied_on
        } }
        format.html { redirect_back(fallback_location: jobs_path(job_id: @job.id)) }
      end
    else
      respond_to do |format|
        format.json { render json: {
          success: false,
          errors: @application_process.errors.full_messages
        }, status: 422 }
        format.html { redirect_back(fallback_location: jobs_path(job_id: @job.id), alert: @application_process.errors.full_messages.join(", ")) }
      end
    end
  end

  def toggle_task
    @job = JobOpening.find(params[:id])
    task = Task.find(params[:task_id])
    
    if task.update(completed: !task.completed)
      redirect_to jobs_path(job_id: @job.id)
    else
      redirect_to jobs_path(job_id: @job.id), alert: "Failed to update task"
    end
  end

  private

  def find_job
    @job = JobOpening.find(params[:id])
  end

  def job_params
    params.require(:job_opening).permit(
      :title, :description, :company_id, :location, :salary, :tech_stack,
      contact_ids: [],
      new_contact_attributes: [:name, :role, :email, :linkedin_url],
      new_company_attributes: [:name, :industry, :website, :linkedin_url]
    )
  end

  def serialize_job_for_details(job)
    application_process = job.application_process

    # If there's no application process, create one for this response
    unless application_process
      application_process = job.create_application_process!(status: "draft")
    end

    {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      tech_stack: job.tech_stack.to_s.split(',').map(&:strip).reject(&:empty?),
      company: {
        id: job.company.id,
        name: job.company.name,
        website: job.company.website
      },
      application_process: {
        id: application_process.id,
        status: application_process.status,
        applied_on: application_process.applied_on&.iso8601,
        created_at: application_process.created_at&.iso8601,
        updated_at: application_process.updated_at&.iso8601
      },
      created_at: job.created_at.iso8601,
      updated_at: job.updated_at.iso8601,
      contacts: job.contacts.map do |contact|
        {
          id: contact.id,
          name: contact.name,
          role: contact.role,
          email: contact.email,
          linkedin_url: contact.linkedin_url,
          company_id: contact.company_id
        }
      end,
      messages: application_process.messages.includes(:contact).order(:sent_at).map do |message|
        {
          id: message.id,
          content: message.content,
          direction: message.direction,
          sent_at: message.formatted_sent_at,
          contact_name: message.contact.name,
          short_content: message.short_content(100)
        }
      end,
      tasks: application_process.tasks.order(:created_at).map do |task|
        {
          id: task.id,
          title: task.title,
          notes: task.notes,
          completed: task.completed,
          due_date: task.due_date&.strftime("%B %d, %Y"),
          created_at: task.created_at.strftime("%B %d, %Y")
        }
      end,
      interviews: application_process.interviews.order(:scheduled_at).map do |interview|
        {
          id: interview.id,
          round_number: interview.round_number,
          interview_type: interview.interview_type,
          scheduled_at: interview.scheduled_at.strftime("%B %d, %Y at %I:%M %p"),
          duration: interview.duration_display,
          performance_score: interview.performance_score,
          enjoyment_score: interview.enjoyment_score,
          notes: interview.notes
        }
      end
    }
  end
end

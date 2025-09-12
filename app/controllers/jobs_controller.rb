class JobsController < ApplicationController
  before_action :find_job, only: [ :show, :update ]
  skip_before_action :verify_authenticity_token, if: :json_request?

  private

  def json_request?
    request.format.json?
  end

  public

  def index
    # Single SQL query for the lightweight list (jobs + company + application_process)
    @jobs = JobOpening
              .left_joins(:company, :application_process)
              .select(
                "job_openings.id",
                "job_openings.title",
                "job_openings.description",
                "job_openings.location",
                "job_openings.salary",
                "job_openings.source",
                "job_openings.tech_stack",
                "job_openings.created_at",
                "job_openings.updated_at",
                "companies.id   AS company_id",
                "companies.name AS company_name",
                "companies.website AS company_website",
                "application_processes.id         AS ap_id",
                "application_processes.status     AS ap_status",
                "application_processes.applied_on AS ap_applied_on",
                "application_processes.created_at AS ap_created_at",
                "application_processes.updated_at AS ap_updated_at"
              )
              .order("application_processes.updated_at DESC")

    @companies = Company.order(:name)                               # (Could cache)
    @contacts  = Contact.includes(:company).order(:name)            # 1 (contacts) + 1 (companies) query

    selected_job_id = params[:job_id].presence || @jobs.first&.id
    @selected_job = nil

    if selected_job_id
      # Heavy load only for the selected job (isolated; uses joins for direct_messages.contacts to cut queries)
      @selected_job = JobOpening
        .where(id: selected_job_id)
        .eager_load( # eager_load -> single LEFT OUTER JOIN tree; fine for 1 record
          :company,
          :contacts,
          application_process: [
    { direct_messages: :contact },
            :tasks,
            :interviews
          ]
        ).first
    end

    render inertia: "Jobs", props: {
      jobs: @jobs.map { |row|
        {
          id: row.id,
          title: row.title,
          company: {
            id: row.company_id,
            name: row.company_name,
            website: row.company_website
          },
          application_process: row.ap_id && {
            id: row.ap_id,
              status: row.ap_status,
              applied_on: row.ap_applied_on&.iso8601,
              created_at: row.ap_created_at&.iso8601,
              updated_at: row.ap_updated_at&.iso8601
          },
          description: row.description,
          location: row.location,
          salary: row.salary,
          tech_stack: row.tech_stack.to_s.split(",").map(&:strip).reject(&:empty?),
          created_at: row.created_at.iso8601,
          updated_at: row.updated_at.iso8601
        }
      },
      companies: @companies.map { |c| { id: c.id, name: c.name, website: c.website } },
      contacts: @contacts.map { |c|
        {
          id: c.id,
          name: c.name,
          role: c.role,
          email: c.email,
          company_id: c.company_id,
          company_name: c.company.name
        }
      },
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

  def destroy
    @job = JobOpening.find(params[:id])

    if @job.destroy
      redirect_to jobs_path, notice: "Job was successfully deleted."
    else
      redirect_to jobs_path(job_id: @job.id), alert: "Failed to delete job."
    end
  end

  private

  def find_job
    @job = JobOpening.find(params[:id])
  end

  def job_params
    params.require(:job_opening).permit(
      :title, :description, :company_id, :location, :salary, :tech_stack,
      :source, contact_ids: [],
      new_contact_attributes: [ :name, :role, :email, :linkedin_url ],
      new_company_attributes: [ :name, :industry, :website, :linkedin_url ]
    )
  end

  def serialize_job_for_details(job)
    ap = job.application_process # assume created at job creation; no creation here

    {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      source: job.source,
      tech_stack: job.tech_stack.to_s.split(",").map(&:strip).reject(&:empty?),
      company: {
        id: job.company.id,
        name: job.company.name,
        website: job.company.website
      },
      application_process: ap && {
        id: ap.id,
        status: ap.status,
        applied_on: ap.applied_on&.iso8601,
        created_at: ap.created_at&.iso8601,
        updated_at: ap.updated_at&.iso8601
      },
      created_at: job.created_at.iso8601,
      updated_at: job.updated_at.iso8601,
      contacts: job.contacts.map { |contact|
        {
          id: contact.id,
          name: contact.name,
          role: contact.role,
          email: contact.email,
          linkedin_url: contact.linkedin_url,
          company_id: contact.company_id
        }
      },
  messages: (ap&.direct_messages || []).sort_by(&:sent_at).map { |m|
        {
          id: m.id,
          content: m.content,
          direction: m.direction,
          sent_at: m.formatted_sent_at,
          contact_name: m.contact&.name,
          contact_role: m.contact&.role,
          contact_email: m.contact&.email,
          contact_linkedin_url: m.contact&.linkedin_url,
          short_content: m.short_content(100)
        }
      },
      tasks: (ap&.tasks || []).sort_by(&:created_at).map { |t|
        {
          id: t.id,
          title: t.title,
          notes: t.notes,
          completed: t.completed,
          due_date: t.due_date&.strftime("%B %d, %Y"),
          created_at: t.created_at.strftime("%B %d, %Y")
        }
      },
      interviews: (ap&.interviews || []).sort_by(&:scheduled_at).map { |iv|
        {
          id: iv.id,
          round_number: iv.round_number,
          interview_type: iv.interview_type,
          scheduled_at: iv.scheduled_at.iso8601,
          duration: iv.duration_display,
          performance_score: iv.performance_score,
          enjoyment_score: iv.enjoyment_score,
          notes: iv.notes
        }
      }
    }
  end
end

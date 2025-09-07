class CompaniesController < ApplicationController
  before_action :require_authentication

  def index
    @companies = Company.includes(:job_openings, :contacts)
                        .order(:name)

    render inertia: "Companies", props: {
      companies: @companies.map do |company|
        {
          id: company.id,
          name: company.name,
          industry: company.industry,
          website: company.website,
          linkedin_url: company.linkedin_url,
          notes: company.notes,
          tech_stack: company.tech_stack,
          job_openings_count: company.job_openings.count,
          contacts_count: company.contacts.count,
          created_at: company.created_at.strftime("%B %d, %Y")
        }
      end
    }
  end

  def create
    @company = Company.new(company_params)

    if @company.save
      redirect_to companies_path, notice: "Company was successfully created."
    else
      redirect_to companies_path, alert: @company.errors.full_messages.join(", ")
    end
  end

  private

  def company_params
    params.require(:company).permit(:name, :industry, :website, :linkedin_url, :notes, :tech_stack)
  end
end

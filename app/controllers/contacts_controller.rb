class ContactsController < ApplicationController
  before_action :find_contact, only: [ :show, :update ]

  def index
    @contacts = Contact.includes(:company)
                      .order(:name)

    render inertia: "Contacts", props: {
      contacts: @contacts.map do |contact|
        {
          id: contact.id,
          name: contact.name,
          role: contact.role,
          email: contact.email,
          linkedin_url: contact.linkedin_url,
          notes: contact.notes,
          company: {
            id: contact.company.id,
            name: contact.company.name
          },
          created_at: contact.created_at.strftime("%B %d, %Y")
        }
      end,
      companies: Company.order(:name).map do |company|
        {
          id: company.id,
          name: company.name
        }
      end
    }
  end

  def create
    @contact = Contact.new(contact_params)

    if @contact.save
      redirect_to contacts_path, notice: "Contact was successfully created."
    else
      redirect_to contacts_path, alert: @contact.errors.full_messages.join(", ")
    end
  end

  def show
    render json: {
      id: @contact.id,
      name: @contact.name,
      role: @contact.role,
      email: @contact.email,
      linkedin_url: @contact.linkedin_url,
      notes: @contact.notes,
      company_id: @contact.company_id
    }
  end

  def update
    if @contact.update(contact_params)
      redirect_to contacts_path, notice: "Contact was successfully updated."
    else
      redirect_to contacts_path, alert: @contact.errors.full_messages.join(", ")
    end
  end

  private

  def find_contact
    @contact = Contact.find(params[:id])
  end

  def contact_params
    params.require(:contact).permit(:name, :role, :email, :linkedin_url, :notes, :company_id)
  end
end

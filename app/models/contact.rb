class Contact < ApplicationRecord
  # Associations
  belongs_to :company
  has_many :messages, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { maximum: 255 }
  validates :role, length: { maximum: 255 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :linkedin_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }, allow_blank: true

  # Scopes
  scope :by_role, ->(role) { where(role: role) }
  scope :with_email, -> { where.not(email: [ nil, "" ]) }

  # Instance methods
  def display_name
    name
  end

  def full_contact_info
    info = [ name ]
    info << "(#{role})" if role.present?
    info << "at #{company.name}" if company
    info.join(" ")
  end
end

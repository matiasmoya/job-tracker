class Company < ApplicationRecord
  # Associations
  has_many :job_openings, dependent: :destroy
  has_many :contacts, dependent: :destroy
  has_many :application_processes, through: :job_openings

  # Validations
  validates :name, presence: true, length: { maximum: 255 }
  validates :industry, length: { maximum: 255 }
  validates :website, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true }
  validates :linkedin_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true }

  # Scopes
  scope :by_industry, ->(industry) { where(industry: industry) }
  scope :with_openings, -> { joins(:job_openings).distinct }

  # Instance methods
  def display_name
    name
  end

  def active_applications_count
    application_processes.where.not(status: ['rejected', 'closed']).count
  end
end

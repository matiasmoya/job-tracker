class JobOpening < ApplicationRecord
  # Associations
  belongs_to :company
  has_one :application_process, dependent: :destroy
  has_many :content_ideas, dependent: :destroy
  has_many :interviews, through: :application_process
  has_many :job_opening_contacts, dependent: :destroy
  has_many :contacts, through: :job_opening_contacts

  # Nested attributes for creating new contacts
  accepts_nested_attributes_for :contacts

  # Default values
  after_initialize :set_defaults, if: :new_record?

  def set_defaults
    self.is_public ||= true
  end

  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :source, length: { maximum: 255 }
  validates :match_score, inclusion: { in: 0..100 }, allow_nil: true
  validates :interest_score, inclusion: { in: 0..100 }, allow_nil: true
  validates :is_public, inclusion: { in: [ true, false ] }

  # Scopes
  scope :public_postings, -> { where(is_public: true) }
  scope :private_outreach, -> { where(is_public: false) }
  scope :by_source, ->(source) { where(source: source) }
  scope :high_match, -> { where(match_score: 80..100) }
  scope :high_interest, -> { where(interest_score: 80..100) }

  # Instance methods
  def display_title
    "#{title} at #{company.name}"
  end

  def has_application?
    application_process.present?
  end

  def application_status
    application_process&.status || "not_applied"
  end

  def score_summary
    scores = []
    scores << "Match: #{match_score}%" if match_score
    scores << "Interest: #{interest_score}%" if interest_score
    scores.join(", ")
  end
end

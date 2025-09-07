class Message < ApplicationRecord
  # Associations
  belongs_to :contact
  belongs_to :application_process
  has_one :company, through: :contact
  has_one :job_opening, through: :application_process

  # Enums - temporarily disabled due to Rails 8 enum issues
  # enum direction: { sent: 0, received: 1 }

  # Validations
  validates :direction, presence: true
  validates :content, presence: true
  validates :sent_at, presence: true

  # Class methods to simulate enum functionality
  def self.directions
    { "sent" => 0, "received" => 1 }
  end

  # Scopes
  scope :recent, -> { where("sent_at >= ?", 7.days.ago) }
  scope :ordered_by_date, -> { order(:sent_at) }
  scope :sent_messages, -> { where(direction: "sent") }
  scope :received_messages, -> { where(direction: "received") }

  # Instance methods
  def display_direction
    direction == "sent" ? "To" : "From"
  end

  def short_content(limit = 100)
    return content if content.length <= limit
    "#{content[0..limit-3]}..."
  end

  def days_ago
    return 0 unless sent_at
    (Date.current - sent_at.to_date).to_i
  end

  def formatted_sent_at
    sent_at.strftime("%B %d, %Y at %I:%M %p")
  end
end

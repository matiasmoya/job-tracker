class Interview < ApplicationRecord
  # Associations
  belongs_to :application_process
  has_one :job_opening, through: :application_process
  has_one :company, through: :job_opening

  # Validations
  validates :round_number, presence: true, numericality: { greater_than: 0 }
  validates :interview_type, presence: true, length: { maximum: 255 }
  validates :scheduled_at, presence: true
  validates :duration, numericality: { greater_than: 0 }, allow_nil: true
  validates :performance_score, inclusion: { in: 0..10 }, allow_nil: true
  validates :enjoyment_score, inclusion: { in: 0..10 }, allow_nil: true
  validate :scheduled_at_not_in_past, on: :create

  # Scopes
  scope :upcoming, -> { where("scheduled_at > ?", Time.current) }
  scope :past, -> { where("scheduled_at <= ?", Time.current) }
  scope :by_type, ->(type) { where(interview_type: type) }
  scope :ordered_by_round, -> { order(:round_number) }
  scope :recent, -> { where("scheduled_at >= ?", 7.days.ago) }

  # Class methods
  def self.common_interview_types
    [ "technical", "behavioral", "cultural", "hr_screening", "system_design", "take_home", "final_round" ]
  end

  # Instance methods
  def display_title
    "Round #{round_number}: #{interview_type.humanize}"
  end

  def duration_display
    return "Not specified" unless duration

    hours = duration / 60
    minutes = duration % 60

    if hours > 0 && minutes > 0
      "#{hours}h #{minutes}m"
    elsif hours > 0
      "#{hours}h"
    else
      "#{minutes}m"
    end
  end

  def is_upcoming?
    scheduled_at > Time.current
  end

  def is_completed?
    scheduled_at <= Time.current
  end

  def has_scores?
    performance_score.present? || enjoyment_score.present?
  end

  def average_score
    return nil unless performance_score && enjoyment_score
    (performance_score + enjoyment_score) / 2.0
  end

  private

  def scheduled_at_not_in_past
    return unless scheduled_at

    if scheduled_at <= Time.current
      errors.add(:scheduled_at, "cannot be in the past")
    end
  end
end

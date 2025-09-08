class ApplicationProcess < ApplicationRecord
  belongs_to :job_opening
  has_many :interviews, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_one :company, through: :job_opening

  enum :status, {
    draft: "draft",
    applied: "applied",
    in_review: "in_review",
    interviewing: "interviewing",
    offer: "offer",
    rejected: "rejected",
    closed: "closed"
  }

  validates :status, presence: true
  validates :applied_on, presence: true, if: -> { status != "draft" }
  validate :follow_up_dates_logical_order

  scope :active, -> { where.not(status: [ "rejected", "closed" ]) }
  scope :needs_follow_up, -> { where("next_follow_up_on <= ?", Date.current) }
  scope :recent_applications, -> { where("applied_on >= ?", 30.days.ago) }

  def days_since_applied
    return nil unless applied_on
    (Date.current - applied_on).to_i
  end

  def needs_follow_up?
    next_follow_up_on && next_follow_up_on <= Date.current
  end

  def interview_count
    interviews.count
  end

  def latest_interview
    interviews.order(:scheduled_at).last
  end

  def status_display
    status.humanize
  end

  private

  def follow_up_dates_logical_order
    return unless last_follow_up_on && next_follow_up_on

    if last_follow_up_on > next_follow_up_on
      errors.add(:next_follow_up_on, "must be after last follow up date")
    end
  end
end

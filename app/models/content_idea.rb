class ContentIdea < ApplicationRecord
  belongs_to :job_opening, optional: true
  has_one :company, through: :job_opening

  enum :idea_type, blog_post: 0, project: 1

  validates :title, presence: true, length: { maximum: 255 }
  validates :idea_type, presence: true
  validates :urgency_score, inclusion: { in: 0..10 }, allow_nil: true
  validates :interest_score, inclusion: { in: 0..10 }, allow_nil: true

  scope :blog_posts, -> { where(idea_type: "blog_post") }
  scope :projects, -> { where(idea_type: "project") }
  scope :scheduled, -> { where.not(scheduled_for: nil) }
  scope :urgent, -> { where("urgency_score >= ?", 7) }
  scope :high_interest, -> { where("interest_score >= ?", 7) }
  scope :due_soon, -> { where("scheduled_for <= ?", 7.days.from_now) }
  scope :overdue, -> { where("scheduled_for < ?", Date.current) }

  def display_title
    title
  end

  def platforms_list
    return "Not specified" if platforms.blank?
    platforms
  end

  def tags_list
    return "No tags" if tags.blank?
    tags
  end

  def is_scheduled?
    scheduled_for.present?
  end

  def is_overdue?
    scheduled_for && scheduled_for < Date.current
  end

  def days_until_due
    return nil unless scheduled_for
    (scheduled_for - Date.current).to_i
  end

  def priority_score
    return 0 unless urgency_score && interest_score
    (urgency_score + interest_score) / 2.0
  end
end

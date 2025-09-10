class Task < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :application_process, optional: true, touch: true

  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :completed, inclusion: { in: [ true, false ] }

  # Scopes
  scope :completed, -> { where(completed: true) }
  scope :incomplete, -> { where(completed: false) }
  scope :due_today, -> { where(due_date: Date.current) }
  scope :due_soon, -> { where("due_date <= ?", 7.days.from_now) }
  scope :overdue, -> { where("due_date < ? AND completed = ?", Date.current, false) }
  scope :ordered_by_due_date, -> { order(:due_date) }
  scope :recent, -> { where("created_at >= ?", 7.days.ago) }

  # Instance methods
  def display_title
    title
  end

  def is_completed?
    completed
  end

  def is_overdue?
    due_date && due_date < Date.current && !completed
  end

  def is_due_today?
    due_date == Date.current
  end

  def is_due_soon?
    due_date && due_date <= 7.days.from_now && due_date >= Date.current
  end

  def days_until_due
    return nil unless due_date
    (due_date - Date.current).to_i
  end

  def complete!
    update!(completed: true)
  end

  def reopen!
    update!(completed: false)
  end

  def status_display
    return "Completed" if completed?
    return "Overdue" if is_overdue?
    return "Due Today" if is_due_today?
    return "Due Soon" if is_due_soon?
    "Pending"
  end

  def event_starts_at
    return nil unless due_date
    (due_date.to_datetime + 12.hours).iso8601
  end

  def event_ends_at
    return nil unless due_date
    (due_date.to_datetime + 13.hours).iso8601
  end
end

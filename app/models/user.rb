class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :tasks, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  # Instance methods
  def incomplete_tasks_count
    tasks.incomplete.count
  end

  def overdue_tasks_count
    tasks.overdue.count
  end
end

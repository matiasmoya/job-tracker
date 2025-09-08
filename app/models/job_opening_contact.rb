class JobOpeningContact < ApplicationRecord
  belongs_to :job_opening
  belongs_to :contact
  
  validates :job_opening_id, uniqueness: { scope: :contact_id }
end

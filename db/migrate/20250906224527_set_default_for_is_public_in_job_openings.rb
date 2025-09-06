class SetDefaultForIsPublicInJobOpenings < ActiveRecord::Migration[8.1]
  def change
    change_column_default :job_openings, :is_public, from: nil, to: true
  end
end

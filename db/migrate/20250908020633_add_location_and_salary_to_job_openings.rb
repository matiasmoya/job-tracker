class AddLocationAndSalaryToJobOpenings < ActiveRecord::Migration[8.1]
  def change
    add_column :job_openings, :location, :string
    add_column :job_openings, :salary, :string
  end
end

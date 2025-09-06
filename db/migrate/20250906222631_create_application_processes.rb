class CreateApplicationProcesses < ActiveRecord::Migration[8.1]
  def change
    create_table :application_processes do |t|
      t.integer :status
      t.date :applied_on
      t.date :job_posted_on
      t.date :last_follow_up_on
      t.date :next_follow_up_on
      t.references :job_opening, null: false, foreign_key: true

      t.timestamps
    end
  end
end

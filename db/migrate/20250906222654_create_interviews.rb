class CreateInterviews < ActiveRecord::Migration[8.1]
  def change
    create_table :interviews do |t|
      t.integer :round_number
      t.string :interview_type
      t.datetime :scheduled_at
      t.integer :duration
      t.text :notes
      t.text :transcript
      t.integer :performance_score
      t.integer :enjoyment_score
      t.references :application_process, null: false, foreign_key: true

      t.timestamps
    end
  end
end

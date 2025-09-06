class CreateContentIdeas < ActiveRecord::Migration[8.1]
  def change
    create_table :content_ideas do |t|
      t.string :title
      t.string :idea_type
      t.string :platforms
      t.date :scheduled_for
      t.integer :urgency_score
      t.integer :interest_score
      t.string :tags
      t.references :job_opening, null: false, foreign_key: true

      t.timestamps
    end
  end
end

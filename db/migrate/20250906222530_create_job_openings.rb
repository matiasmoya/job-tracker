class CreateJobOpenings < ActiveRecord::Migration[8.1]
  def change
    create_table :job_openings do |t|
      t.string :title
      t.text :description
      t.string :source
      t.text :tech_stack
      t.text :values
      t.integer :match_score
      t.integer :interest_score
      t.boolean :is_public
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end

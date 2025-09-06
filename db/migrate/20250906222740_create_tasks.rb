class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.date :due_date
      t.boolean :completed
      t.text :notes
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

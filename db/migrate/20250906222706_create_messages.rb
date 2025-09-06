class CreateMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :messages do |t|
      t.string :direction
      t.text :content
      t.datetime :sent_at
      t.references :contact, null: false, foreign_key: true
      t.references :application_process, null: false, foreign_key: true

      t.timestamps
    end
  end
end

class CreateContacts < ActiveRecord::Migration[8.1]
  def change
    create_table :contacts do |t|
      t.string :name
      t.string :role
      t.string :email
      t.string :linkedin_url
      t.text :notes
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end

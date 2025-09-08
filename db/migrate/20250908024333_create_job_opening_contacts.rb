class CreateJobOpeningContacts < ActiveRecord::Migration[8.1]
  def change
    create_table :job_opening_contacts do |t|
      t.references :job_opening, null: false, foreign_key: true
      t.references :contact, null: false, foreign_key: true

      t.timestamps
    end

    add_index :job_opening_contacts, [ :job_opening_id, :contact_id ], unique: true, name: 'idx_job_opening_contacts_unique'
  end
end

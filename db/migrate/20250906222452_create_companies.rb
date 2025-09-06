class CreateCompanies < ActiveRecord::Migration[8.1]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :industry
      t.string :website
      t.string :linkedin_url
      t.text :notes
      t.text :tech_stack

      t.timestamps
    end
  end
end

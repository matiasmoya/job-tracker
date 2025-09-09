class ChangeDirectionColumnTypeInMessages < ActiveRecord::Migration[8.1]
  def change
    change_column :messages, :direction, :integer
  end
end

class SetDefaultForCompletedInTasks < ActiveRecord::Migration[8.1]
  def change
    change_column_default :tasks, :completed, from: nil, to: false
  end
end

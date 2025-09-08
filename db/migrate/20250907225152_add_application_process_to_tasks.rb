class AddApplicationProcessToTasks < ActiveRecord::Migration[8.1]
  def change
  add_reference :tasks, :application_process, null: true, foreign_key: true, index: true
  end
end

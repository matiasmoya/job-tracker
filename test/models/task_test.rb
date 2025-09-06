require "test_helper"

class TaskTest < ActiveSupport::TestCase
  def setup
    @task = tasks(:one)
  end

  test "fixture is valid" do
    assert @task.valid?, @task.errors.full_messages.to_sentence
  end

  test "requires title" do
    @task.title = nil
    assert_not @task.valid?
  end

  test "completed inclusion" do
    @task.completed = nil
    assert_not @task.valid?
  end

  test "scopes" do
    assert Task.incomplete.all? { |t| t.completed == false }
    assert Task.completed.all? { |t| t.completed == true }
  end

  test "is_completed? mirrors completed" do
    refute @task.is_completed?
    @task.update!(completed: true)
    assert @task.is_completed?
  end

  test "overdue logic" do
    @task.update!(due_date: Date.yesterday, completed: false)
    assert @task.is_overdue?
  end

  test "due today logic" do
    @task.update!(due_date: Date.current)
    assert @task.is_due_today?
  end

  test "due soon logic" do
    @task.update!(due_date: 3.days.from_now.to_date)
    assert @task.is_due_soon?
  end

  test "days_until_due" do
    @task.update!(due_date: Date.current + 2)
    assert_equal 2, @task.days_until_due
  end

  test "complete! and reopen!" do
    @task.complete!
    assert @task.completed
    @task.reopen!
    refute @task.completed
  end

  test "status_display variants" do
    @task.update!(due_date: Date.current + 5)
    assert_equal "Due Soon", @task.status_display
    @task.update!(due_date: Date.current)
    assert_equal "Due Today", @task.status_display
    @task.update!(due_date: Date.yesterday)
    assert_equal "Overdue", @task.status_display
    @task.update!(completed: true, due_date: Date.current + 2)
    assert_equal "Completed", @task.status_display
  end
end

require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "downcases and strips email_address" do
    user = User.new(email_address: " DOWNCASED@EXAMPLE.COM ", password: "password", password_confirmation: "password")
    assert_equal "downcased@example.com", user.email_address
  end

  test "incomplete_tasks_count returns number" do
    user = users(:one)
    assert user.incomplete_tasks_count >= 0
  end

  test "overdue_tasks_count returns number" do
    user = users(:one)
    assert user.overdue_tasks_count >= 0
  end
end

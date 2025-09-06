require "test_helper"

class SessionTest < ActiveSupport::TestCase
  def setup
    @session = sessions(:one_session)
  end

  test "fixture valid" do
    assert @session.valid?
  end

  test "belongs to user" do
    assert_instance_of User, @session.user
  end
end

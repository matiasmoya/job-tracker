require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    sign_in(@user)
  end

  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password" }
    assert_redirected_to root_url
    follow_redirect!
  end

  test "should get index" do
    get root_url
    assert_response :success
  end
end

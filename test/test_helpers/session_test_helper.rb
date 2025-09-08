module SessionTestHelper
  def sign_in_as(user)
    Current.session = user.sessions.create!

    ActionDispatch::TestRequest.create.cookie_jar.tap do |cookie_jar|
      cookie_jar.signed[:session_id] = Current.session.id
      cookies[:session_id] = cookie_jar[:session_id]
    end
  end

  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password" }
    assert_redirected_to root_url
    follow_redirect!
  end

  def sign_out
    Current.session&.destroy!
    cookies.delete(:session_id)
  end
end

require "test_helper"

class CompaniesControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as(users(:one))
  end

  test "should get index" do
    get companies_url
    assert_response :success
  end

  test "should create company" do
    assert_difference("Company.count") do
      post companies_url, params: {
        company: {
          name: "Test Company",
          industry: "Technology"
        }
      }
    end
    assert_redirected_to companies_url
  end
end

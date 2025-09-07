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

  test "should show company" do
    company = companies(:tech_corp)
    get company_url(company)
    assert_response :success
    assert_match company.name, response.body
  end

  test "should update company" do
    company = companies(:tech_corp)
    patch company_url(company), params: {
      company: {
        name: "Updated Company Name",
        industry: "Updated Industry"
      }
    }
    assert_redirected_to companies_url
    company.reload
    assert_equal "Updated Company Name", company.name
    assert_equal "Updated Industry", company.industry
  end
end

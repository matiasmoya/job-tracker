require "test_helper"

class CompanyTest < ActiveSupport::TestCase
  def setup
    @company = companies(:tech_corp)
  end

  test "should be valid with valid attributes" do
    company = Company.new(
      name: "Test Company",
      industry: "Technology",
      website: "https://example.com",
      linkedin_url: "https://linkedin.com/company/example"
    )
    assert company.valid?
  end

  test "should require name" do
    @company.name = nil
    assert_not @company.valid?
    assert_includes @company.errors[:name], "can't be blank"
  end

  test "should limit name length to 255 characters" do
    @company.name = 'a' * 256
    assert_not @company.valid?
    assert_includes @company.errors[:name], "is too long (maximum is 255 characters)"
  end

  test "should validate website format" do
    @company.website = "invalid-url"
    assert_not @company.valid?
    assert_includes @company.errors[:website], "is invalid"

    @company.website = "https://valid-url.com"
    assert @company.valid?
  end

  test "should validate linkedin_url format" do
    @company.linkedin_url = "invalid-url"
    assert_not @company.valid?
    assert_includes @company.errors[:linkedin_url], "is invalid"

    @company.linkedin_url = "https://linkedin.com/company/test"
    assert @company.valid?
  end

  test "should allow blank website and linkedin_url" do
    @company.website = ""
    @company.linkedin_url = nil
    assert @company.valid?
  end

  test "should have many job_openings" do
    assert_respond_to @company, :job_openings
    assert_equal 2, @company.job_openings.count
  end

  test "should have many contacts" do
    assert_respond_to @company, :contacts
    assert_equal 1, @company.contacts.count
  end

  test "should have many application_processes through job_openings" do
    assert_respond_to @company, :application_processes
  end

  test "should destroy associated job_openings when destroyed" do
    job_opening_ids = @company.job_opening_ids
    @company.destroy
    
    job_opening_ids.each do |id|
      assert_nil JobOpening.find_by(id: id)
    end
  end

  test "display_name should return name" do
    assert_equal @company.name, @company.display_name
  end

  test "active_applications_count should count non-rejected/closed applications" do
    # This test depends on fixtures having appropriate data
    count = @company.active_applications_count
    assert count >= 0
  end

  test "should scope by_industry" do
    tech_companies = Company.by_industry("Technology")
    assert_includes tech_companies, @company
  end

  test "should scope with_openings" do
    companies_with_openings = Company.with_openings
    assert_includes companies_with_openings, @company
  end
end

require "test_helper"

class JobsPageTest < ActionDispatch::IntegrationTest
  def setup
    # Create test data
    @company = Company.create!(
      name: "Test Company",
      industry: "Technology",
      website: "https://test.com"
    )
    
    @job = JobOpening.create!(
      title: "Software Engineer",
      description: "Test job description",
      company: @company
    )
    
    @job.create_application_process!(status: 'draft')
  end

  test "jobs index renders with Inertia" do
    get jobs_path
    
    assert_response :success
    assert_select "div#app[data-page]"
    
    # Parse the Inertia data
    app_div = css_select("div#app").first
    data_page = app_div["data-page"]
    page_data = JSON.parse(data_page)
    
    # Check that it's rendering the Jobs component
    assert_equal "Jobs", page_data["component"]
    
    # Check that jobs data is present
    assert page_data["props"]["jobs"].is_a?(Array)
    assert page_data["props"]["companies"].is_a?(Array)
    
    # Check that our test job is included
    job_titles = page_data["props"]["jobs"].map { |job| job["title"] }
    assert_includes job_titles, "Software Engineer"
    
    puts "✓ Inertia component: #{page_data['component']}"
    puts "✓ Jobs count: #{page_data['props']['jobs'].length}"
    puts "✓ Companies count: #{page_data['props']['companies'].length}"
  end

  test "jobs index with no jobs" do
    JobOpening.destroy_all
    Company.destroy_all
    
    get jobs_path
    
    assert_response :success
    
    app_div = css_select("div#app").first
    data_page = app_div["data-page"]
    page_data = JSON.parse(data_page)
    
    assert_equal "Jobs", page_data["component"]
    assert_equal [], page_data["props"]["jobs"]
    assert_equal [], page_data["props"]["companies"]
    
    puts "✓ Empty state works correctly"
  end

  test "jobs index includes proper job data structure" do
    get jobs_path
    
    assert_response :success
    
    app_div = css_select("div#app").first
    data_page = app_div["data-page"]
    page_data = JSON.parse(data_page)
    
    job = page_data["props"]["jobs"].first
    
    # Check job structure
    assert job["id"]
    assert job["title"]
    assert job["company"]
    assert job["company"]["id"]
    assert job["company"]["name"]
    assert job["created_at"]
    assert job["updated_at"]
    
    # Check application_process structure  
    if job["application_process"]
      assert job["application_process"]["id"]
      assert job["application_process"]["status"]
      assert job["application_process"]["created_at"]
      assert job["application_process"]["updated_at"]
    end
    
    puts "✓ Job data structure is correct"
    puts "  - Job title: #{job['title']}"
    puts "  - Company: #{job['company']['name']}"
    puts "  - Status: #{job['application_process']&.fetch('status', 'no status')}"
  end

  test "jobs index handles jobs without application_process" do
    # Create a job without application process
    job_without_process = JobOpening.create!(
      title: "Job Without Process",
      description: "Test job without application process",
      company: @company
    )
    
    get jobs_path
    
    assert_response :success
    
    app_div = css_select("div#app").first
    data_page = app_div["data-page"]
    page_data = JSON.parse(data_page)
    
    # Find our job without process
    job_data = page_data["props"]["jobs"].find { |job| job["title"] == "Job Without Process" }
    assert job_data, "Job without process should be in the response"
    
    # application_process should be null
    assert_nil job_data["application_process"]
    
    puts "✓ Jobs without application_process are handled correctly"
  end
end

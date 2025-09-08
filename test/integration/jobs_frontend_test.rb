require "test_helper"

class JobsFrontendTest < ActionDispatch::IntegrationTest
  def setup
    sign_in_as(users(:one))
    @company = Company.create!(
      name: "Frontend Test Company",
      industry: "Technology"
    )
  end

  test "jobs page renders without JavaScript errors when jobs have null application_process" do
    # Clear existing data to ensure clean test
    JobOpening.destroy_all

    # Create multiple jobs with different application_process states
    job_with_process = JobOpening.create!(
      title: "Job With Process",
      description: "Has application process",
      company: @company
    )
    job_with_process.create_application_process!(status: "applied", applied_on: 3.days.ago)

    job_without_process = JobOpening.create!(
      title: "Job Without Process",
      description: "No application process",
      company: @company
    )

    # Make request to jobs page
    get jobs_path
    assert_response :success

    # Parse the Inertia data that will be sent to React
    app_div = css_select("div#app").first
    data_page = app_div["data-page"]
    page_data = JSON.parse(data_page)

    # Verify the component and props structure
    assert_equal "Jobs", page_data["component"]
    assert_equal 2, page_data["props"]["jobs"].length

    # Find both jobs in the response
    job_with_data = page_data["props"]["jobs"].find { |job| job["title"] == "Job With Process" }
    job_without_data = page_data["props"]["jobs"].find { |job| job["title"] == "Job Without Process" }

    assert job_with_data, "Job with process should be present"
    assert job_without_data, "Job without process should be present"

    # Verify job with process has proper application_process
    assert job_with_data["application_process"], "Should have application_process"
    assert_equal "applied", job_with_data["application_process"]["status"]
    assert job_with_data["application_process"]["applied_on"]

    # Verify job without process has null application_process
    assert_nil job_without_data["application_process"], "Should have null application_process"
  end

  test "jobs page can handle edge case where job has empty company data" do
    # Clear existing data to ensure clean test
    JobOpening.destroy_all

    # Create a job with minimal data
    JobOpening.create!(
      title: "Minimal Job",
      description: "Very basic job",
      company: @company
    )

    get jobs_path
    assert_response :success

    app_div = css_select("div#app").first
    data_page = app_div["data-page"]
    page_data = JSON.parse(data_page)

    minimal_job_data = page_data["props"]["jobs"].find { |job| job["title"] == "Minimal Job" }
    assert minimal_job_data, "Minimal job should be present"

    # Verify required fields are present
    assert minimal_job_data["id"]
    assert minimal_job_data["title"]
    assert minimal_job_data["company"]
    assert minimal_job_data["company"]["id"]
    assert minimal_job_data["company"]["name"]
    assert minimal_job_data["created_at"]
    assert minimal_job_data["updated_at"]
  end
end

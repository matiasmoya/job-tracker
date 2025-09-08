require "test_helper"

class JobsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:one)
    sign_in @user
    @company = companies(:tech_corp)
    @job = job_openings(:senior_rails_dev)

    # Ensure application process exists with a valid status
    if @job.application_process.nil?
      @job.create_application_process!(status: "draft")
    end
  end

  test "should get index" do
    get jobs_url
    assert_response :success
  end

  test "should create job" do
    assert_difference("JobOpening.count") do
      post jobs_url, params: {
        job_opening: {
          title: "Test Engineer",
          company_id: @company.id,
          description: "Testing is important"
        }
      }
    end

    assert_response :redirect
  end

  test "should update job" do
    patch job_url(@job), params: {
      job_opening: {
        title: "Updated Title",
        description: "Updated description"
      }
    }

    assert_response :redirect
    @job.reload
    assert_equal "Updated Title", @job.title
  end

  test "should update status" do
    patch status_job_path(@job), params: { status: "in_review" }

    assert_response :redirect
    @job.application_process.reload
    assert_equal "in_review", @job.application_process.status
  end

  private

  def sign_in(user)
    post session_url, params: {
      email_address: user.email_address,
      password: "password"
    }
  end
end

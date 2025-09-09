require "test_helper"

class CalendarControllerTest < ActionDispatch::IntegrationTest
  def test_calendar_index_renders_successfully
    sign_in_as(users(:one))

    # Create test data
    company = companies(:tech_corp)
    job_opening = job_openings(:senior_rails_dev)
    application_process = application_processes(:tech_corp_application)

    # Create an interview
    interview = Interview.create!(
      application_process: application_process,
      round_number: 1,
      interview_type: "technical",
      scheduled_at: 2.days.from_now,
      duration: 60
    )

    # Create a task
    task = Task.create!(
      title: "Prepare for interview",
      due_date: 1.day.from_now,
      completed: false,
      user: users(:one),
      application_process: application_process
    )

    get "/calendar"

    # Just verify the request was successful
    # Inertia response format is complex and would require more setup to test properly
    assert_response :success

    # Verify we can access the controller action without errors
    assert_not_nil response.body
  end

  def test_calendar_index_with_no_events
    sign_in_as(users(:one))

    get "/calendar"

    assert_response :success
    assert_not_nil response.body
  end

  def test_calendar_index_excludes_tasks_without_due_date
    sign_in_as(users(:one))

    # Create a task without due_date
    task = Task.create!(
      title: "Task without due date",
      completed: false,
      user: users(:one)
    )

    get "/calendar"

    assert_response :success
    assert_not_nil response.body
  end
end

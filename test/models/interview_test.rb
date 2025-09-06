require "test_helper"

class InterviewTest < ActiveSupport::TestCase
  def setup
    @application_process = application_processes(:tech_corp_application)
    # Set enum string explicitly to avoid fixture evaluation issues
    @application_process.status = "applied"
    @interview = Interview.new(
      application_process: @application_process,
      round_number: 1,
      interview_type: "technical",
      scheduled_at: 2.days.from_now,
      duration: 90,
      performance_score: 8,
      enjoyment_score: 9
    )
  end

  test "is valid with valid attributes" do
    assert @interview.valid?, @interview.errors.full_messages.to_sentence
  end

  test "requires round_number > 0" do
    @interview.round_number = 0
    assert_not @interview.valid?
  end

  test "requires interview_type" do
    @interview.interview_type = nil
    assert_not @interview.valid?
  end

  test "requires scheduled_at" do
    @interview.scheduled_at = nil
    assert_not @interview.valid?
  end

  test "duration must be positive" do
    @interview.duration = -10
    assert_not @interview.valid?
  end

  test "scores within range" do
    @interview.performance_score = 11
    assert_not @interview.valid?
  end

  test "scheduled_at cannot be in past on create" do
    past = Interview.new(
      application_process: @application_process,
      round_number: 1,
      interview_type: "technical",
      scheduled_at: 1.day.ago
    )
    assert_not past.valid?
  end

  test "is_upcoming? and is_completed?" do
    assert @interview.is_upcoming?
    refute @interview.is_completed?
  end

  test "has_scores?" do
    assert @interview.has_scores?
  end

  test "average_score" do
    assert_in_delta 8.5, @interview.average_score, 0.01
  end

  test "display_title formats" do
    assert_match "Round 1", @interview.display_title
  end

  test "duration_display humanizes" do
    assert_equal "1h 30m", @interview.duration_display
  end

  test "scopes upcoming and past" do
    @interview.save!
    assert Interview.upcoming.include?(@interview)
    @interview.update!(scheduled_at: 1.hour.ago)
    assert Interview.past.include?(@interview)
  end
end

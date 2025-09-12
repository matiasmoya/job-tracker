require "test_helper"

class ApplicationProcessTest < ActiveSupport::TestCase
  def setup
    @application_process = application_processes(:tech_corp_application)
    @application_process.status = "applied"
  end

  test "should be valid with valid attributes" do
    valid = @application_process.valid?
    assert valid, @application_process.errors.full_messages.to_sentence
  end

  test "should require status" do
    @application_process.status = nil
    assert_not @application_process.valid?
    assert_includes @application_process.errors[:status], "can't be blank"
  end

  test "should require applied_on when not draft" do
    @application_process.status = "applied"
    @application_process.applied_on = nil
    assert_not @application_process.valid?
    assert_includes @application_process.errors[:applied_on], "can't be blank"
  end

  test "should not require applied_on when draft" do
    @application_process.status = "draft"
    @application_process.applied_on = nil
    assert @application_process.valid?
  end

  test "should validate follow up dates logical order" do
    @application_process.last_follow_up_on = Date.current
    @application_process.next_follow_up_on = Date.current - 1.day
    assert_not @application_process.valid?
    assert_includes @application_process.errors[:next_follow_up_on], "must be after last follow up date"
  end

  test "should belong to job_opening" do
    assert_respond_to @application_process, :job_opening
    assert_instance_of JobOpening, @application_process.job_opening
  end

  test "should have many interviews" do
    assert_respond_to @application_process, :interviews
  end

  test "should have many messages" do
    assert_respond_to @application_process, :direct_messages
  end

  test "should have company through job_opening" do
    assert_respond_to @application_process, :company
    assert_equal @application_process.job_opening.company, @application_process.company
  end

  test "should have status enum" do
    assert ApplicationProcess.statuses.keys.include?("draft")
    assert ApplicationProcess.statuses.keys.include?("applied")
    assert ApplicationProcess.statuses.keys.include?("rejected")
  end

  test "days_since_applied should calculate correctly" do
    @application_process.applied_on = 5.days.ago.to_date
    assert_equal 5, @application_process.days_since_applied
  end

  test "days_since_applied should return nil when not applied" do
    @application_process.applied_on = nil
    assert_nil @application_process.days_since_applied
  end

  test "needs_follow_up should return true when overdue" do
    @application_process.next_follow_up_on = Date.current - 1.day
    assert @application_process.needs_follow_up?
  end

  test "needs_follow_up should return false when not overdue" do
    @application_process.next_follow_up_on = Date.current + 1.day
    assert_not @application_process.needs_follow_up?
  end

  test "should scope active applications" do
    active_apps = ApplicationProcess.active
    active_apps.each do |app|
      assert_not [ "rejected", "closed" ].include?(app.status)
    end
  end

  test "should scope applications needing follow up" do
    @application_process.update(next_follow_up_on: Date.current)
    needing_followup = ApplicationProcess.needs_follow_up
    assert_includes needing_followup, @application_process
  end

  test "status_display should humanize status" do
    @application_process.status = "in_review"
    assert_equal "In review", @application_process.status_display
  end
end

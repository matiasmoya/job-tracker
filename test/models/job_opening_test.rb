require "test_helper"

class JobOpeningTest < ActiveSupport::TestCase
  def setup
    @job_opening = job_openings(:senior_rails_dev)
  end

  test "fixture is valid" do
    assert @job_opening.valid?, @job_opening.errors.full_messages.to_sentence
  end

  test "requires title" do
    @job_opening.title = nil
    assert_not @job_opening.valid?
    assert_includes @job_opening.errors[:title], "can't be blank"
  end

  test "title length constraint" do
    @job_opening.title = "a" * 256
    assert_not @job_opening.valid?
  end

  test "match_score must be within range" do
    @job_opening.match_score = 101
    assert_not @job_opening.valid?
    @job_opening.match_score = -1
    assert_not @job_opening.valid?
  end

  test "interest_score must be within range" do
    @job_opening.interest_score = 101
    assert_not @job_opening.valid?
  end

  test "is_public inclusion" do
    @job_opening.is_public = nil
    assert_not @job_opening.valid?
  end

  test "associations" do
    assert_respond_to @job_opening, :company
    assert_instance_of Company, @job_opening.company
    assert_respond_to @job_opening, :application_process
    assert_respond_to @job_opening, :content_ideas
  end

  test "display_title combines title and company" do
    assert_match @job_opening.company.name, @job_opening.display_title
  end

  test "has_application? reflects presence" do
    with_app = application_processes(:tech_corp_application).job_opening
    assert with_app.has_application?
    refute job_openings(:tech_lead).has_application?
  end

  test "application_status returns status or not_applied" do
    with_app = application_processes(:tech_corp_application).job_opening
    with_app.application_process.status = "applied"
    assert_equal "applied", with_app.application_status
    assert_equal "not_applied", job_openings(:tech_lead).application_status
  end

  test "score_summary builds string" do
    summary = @job_opening.score_summary
    assert_includes summary, "Match:"
    assert_includes summary, "Interest:"
  end

  test "scopes" do
    assert_includes JobOpening.public_postings, job_openings(:senior_rails_dev)
    assert_includes JobOpening.private_outreach, job_openings(:tech_lead)
    assert JobOpening.by_source("LinkedIn").all? { |j| j.source == "LinkedIn" }
    assert JobOpening.high_match.all? { |j| j.match_score >= 80 }
    assert JobOpening.high_interest.all? { |j| j.interest_score >= 80 }
  end
end

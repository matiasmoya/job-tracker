require "test_helper"

class ContentIdeaTest < ActiveSupport::TestCase
  def setup
    # Build instead of fixture (fixture file empty); set enum manually due to symbol issue
    @idea = ContentIdea.new(
      title: "Build portfolio project",
      idea_type: "project",
      urgency_score: 8,
      interest_score: 9,
      job_opening: job_openings(:senior_rails_dev),
      platforms: [ "GitHub", "Personal Blog" ],
      tags: [ "Portfolio", "Showcase" ],
      scheduled_for: 3.days.from_now.to_date
    )
  end

  test "is valid with valid attributes" do
    assert @idea.valid?, @idea.errors.full_messages.to_sentence
  end

  test "requires title" do
    @idea.title = nil
    assert_not @idea.valid?
  end

  test "requires idea_type" do
    @idea.idea_type = nil
    assert_not @idea.valid?
  end

  test "enum idea_type" do
    assert ContentIdea.idea_types.keys.include?("blog_post")
    assert ContentIdea.idea_types.keys.include?("project")
  end

  test "urgency_score within range" do
    @idea.urgency_score = 11
    assert_not @idea.valid?
  end

  test "interest_score within range" do
    @idea.interest_score = -1
    assert_not @idea.valid?
  end

  test "scopes" do
    @idea.save!
    assert_includes ContentIdea.projects, @idea
    @idea.update!(idea_type: "blog_post")
    assert_includes ContentIdea.blog_posts, @idea
  end

  test "platforms_list works" do
    assert_match "GitHub", @idea.platforms_list
  end

  test "tags_list works" do
    assert_match "Portfolio", @idea.tags_list
  end

  test "is_scheduled? true" do
    assert @idea.is_scheduled?
  end

  test "is_overdue? false" do
    refute @idea.is_overdue?
  end

  test "days_until_due positive" do
    assert @idea.days_until_due > 0
  end

  test "priority_score averages" do
    assert_in_delta 8.5, @idea.priority_score, 0.01
  end
end

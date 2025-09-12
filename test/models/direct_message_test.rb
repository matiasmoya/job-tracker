require "test_helper"

class DirectMessageTest < ActiveSupport::TestCase
  def setup
    @application_process = application_processes(:tech_corp_application)
    @application_process.status = "applied"
    @contact = contacts(:john_recruiter)
    @direct_message = DirectMessage.new(
      application_process: @application_process,
      contact: @contact,
      direction: "sent",
      content: "Thanks for the update, looking forward to next steps.",
      sent_at: Time.current - 2.hours
    )
  end

  test "is valid with valid attributes" do
    assert @direct_message.valid?, @direct_message.errors.full_messages.to_sentence
  end

  test "requires direction" do
    @direct_message.direction = nil
    assert_not @direct_message.valid?
  end

  test "requires content" do
    @direct_message.content = nil
    assert_not @direct_message.valid?
  end

  test "requires sent_at" do
    @direct_message.sent_at = nil
    assert_not @direct_message.valid?
  end

  test "directions class method" do
  assert_equal({ "sent" => 0, "received" => 1 }, DirectMessage.directions)
  end

  test "display_direction" do
    assert_equal "To", @direct_message.display_direction
    @direct_message.direction = "received"
    assert_equal "From", @direct_message.display_direction
  end

  test "short_content truncates" do
    @direct_message.content = "a" * 120
    assert_match "...", @direct_message.short_content(50)
  end

  test "days_ago calculates" do
    assert @direct_message.days_ago >= 0
  end

  test "scopes recent and ordering" do
    @direct_message.save!
  assert_includes DirectMessage.recent, @direct_message
  assert DirectMessage.ordered_by_date.first.sent_at <= DirectMessage.ordered_by_date.last.sent_at
  end

  test "scopes sent and received" do
    @direct_message.save!
  assert_includes DirectMessage.sent_messages, @direct_message
    @direct_message.update!(direction: "received")
  assert_includes DirectMessage.received_messages, @direct_message
  end
end

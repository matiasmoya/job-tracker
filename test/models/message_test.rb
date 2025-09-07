require "test_helper"

class MessageTest < ActiveSupport::TestCase
  def setup
    @application_process = application_processes(:tech_corp_application)
    @application_process.status = "applied"
    @contact = contacts(:john_recruiter)
    @message = Message.new(
      application_process: @application_process,
      contact: @contact,
      direction: "sent",
      content: "Thanks for the update, looking forward to next steps.",
      sent_at: Time.current - 2.hours
    )
  end

  test "is valid with valid attributes" do
    assert @message.valid?, @message.errors.full_messages.to_sentence
  end

  test "requires direction" do
    @message.direction = nil
    assert_not @message.valid?
  end

  test "requires content" do
    @message.content = nil
    assert_not @message.valid?
  end

  test "requires sent_at" do
    @message.sent_at = nil
    assert_not @message.valid?
  end

  test "directions class method" do
    assert_equal({ "sent" => 0, "received" => 1 }, Message.directions)
  end

  test "display_direction" do
    assert_equal "To", @message.display_direction
    @message.direction = "received"
    assert_equal "From", @message.display_direction
  end

  test "short_content truncates" do
    @message.content = "a" * 120
    assert_match "...", @message.short_content(50)
  end

  test "days_ago calculates" do
    assert @message.days_ago >= 0
  end

  test "scopes recent and ordering" do
    @message.save!
    assert_includes Message.recent, @message
    assert Message.ordered_by_date.first.sent_at <= Message.ordered_by_date.last.sent_at
  end

  test "scopes sent and received" do
    @message.save!
    assert_includes Message.sent_messages, @message
    @message.update!(direction: "received")
    assert_includes Message.received_messages, @message
  end
end

require "test_helper"

class ContactTest < ActiveSupport::TestCase
  def setup
    @contact = contacts(:john_recruiter)
  end

  test "fixture is valid" do
    assert @contact.valid?, @contact.errors.full_messages.to_sentence
  end

  test "requires name" do
    @contact.name = nil
    assert_not @contact.valid?
    assert_includes @contact.errors[:name], "can't be blank"
  end

  test "email format validation" do
    @contact.email = "bad-email"
    assert_not @contact.valid?
    assert_includes @contact.errors[:email], "is invalid"
  end

  test "linkedin_url format validation" do
    @contact.linkedin_url = "not a url"
    assert_not @contact.valid?
  end

  test "associations" do
    assert_instance_of Company, @contact.company
    assert_respond_to @contact, :messages
  end

  test "scopes" do
    assert Contact.by_role("Technical Recruiter").include?(@contact)
    assert Contact.with_email.all? { |c| c.email.present? }
  end

  test "display_name returns name" do
    assert_equal @contact.name, @contact.display_name
  end

  test "full_contact_info builds string" do
    info = @contact.full_contact_info
    assert_includes info, @contact.name
    assert_includes info, @contact.company.name
  end
end

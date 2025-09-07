require "test_helper"

class ContactsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as(users(:one))
  end

  test "should get index" do
    get contacts_url
    assert_response :success
  end

  test "should create contact" do
    assert_difference("Contact.count") do
      post contacts_url, params: {
        contact: {
          name: "Test Contact",
          role: "Developer",
          email: "test@example.com",
          company_id: companies(:tech_corp).id
        }
      }
    end
    assert_redirected_to contacts_url
  end

  test "should show contact" do
    contact = contacts(:john_recruiter)
    get contact_url(contact)
    assert_response :success
    assert_match contact.name, response.body
  end

  test "should update contact" do
    contact = contacts(:john_recruiter)
    patch contact_url(contact), params: {
      contact: {
        name: "Updated Contact Name",
        role: "Updated Role",
        email: "updated@example.com"
      }
    }
    assert_redirected_to contacts_url
    contact.reload
    assert_equal "Updated Contact Name", contact.name
    assert_equal "Updated Role", contact.role
    assert_equal "updated@example.com", contact.email
  end

  test "should require name for creation" do
    assert_no_difference("Contact.count") do
      post contacts_url, params: {
        contact: {
          name: "",
          company_id: companies(:tech_corp).id
        }
      }
    end
    assert_redirected_to contacts_url
  end

  test "should require company_id for creation" do
    assert_no_difference("Contact.count") do
      post contacts_url, params: {
        contact: {
          name: "Test Contact"
        }
      }
    end
    assert_redirected_to contacts_url
  end
end

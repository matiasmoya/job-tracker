# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_09_06_224547) do
  create_table "application_processes", force: :cascade do |t|
    t.date "applied_on"
    t.datetime "created_at", null: false
    t.integer "job_opening_id", null: false
    t.date "job_posted_on"
    t.date "last_follow_up_on"
    t.date "next_follow_up_on"
    t.string "status"
    t.datetime "updated_at", null: false
    t.index ["job_opening_id"], name: "index_application_processes_on_job_opening_id"
  end

  create_table "companies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "industry"
    t.string "linkedin_url"
    t.string "name"
    t.text "notes"
    t.text "tech_stack"
    t.datetime "updated_at", null: false
    t.string "website"
  end

  create_table "contacts", force: :cascade do |t|
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.string "email"
    t.string "linkedin_url"
    t.string "name"
    t.text "notes"
    t.string "role"
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_contacts_on_company_id"
  end

  create_table "content_ideas", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "idea_type"
    t.integer "interest_score"
    t.integer "job_opening_id", null: false
    t.string "platforms"
    t.date "scheduled_for"
    t.string "tags"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "urgency_score"
    t.index ["job_opening_id"], name: "index_content_ideas_on_job_opening_id"
  end

  create_table "interviews", force: :cascade do |t|
    t.integer "application_process_id", null: false
    t.datetime "created_at", null: false
    t.integer "duration"
    t.integer "enjoyment_score"
    t.string "interview_type"
    t.text "notes"
    t.integer "performance_score"
    t.integer "round_number"
    t.datetime "scheduled_at"
    t.text "transcript"
    t.datetime "updated_at", null: false
    t.index ["application_process_id"], name: "index_interviews_on_application_process_id"
  end

  create_table "job_openings", force: :cascade do |t|
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "interest_score"
    t.boolean "is_public", default: true
    t.integer "match_score"
    t.string "source"
    t.text "tech_stack"
    t.string "title"
    t.datetime "updated_at", null: false
    t.text "values"
    t.index ["company_id"], name: "index_job_openings_on_company_id"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "application_process_id", null: false
    t.integer "contact_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.string "direction"
    t.datetime "sent_at"
    t.datetime "updated_at", null: false
    t.index ["application_process_id"], name: "index_messages_on_application_process_id"
    t.index ["contact_id"], name: "index_messages_on_contact_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "ip_address"
    t.datetime "updated_at", null: false
    t.string "user_agent"
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.boolean "completed", default: false
    t.datetime "created_at", null: false
    t.date "due_date"
    t.text "notes"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  add_foreign_key "application_processes", "job_openings"
  add_foreign_key "contacts", "companies"
  add_foreign_key "content_ideas", "job_openings"
  add_foreign_key "interviews", "application_processes"
  add_foreign_key "job_openings", "companies"
  add_foreign_key "messages", "application_processes"
  add_foreign_key "messages", "contacts"
  add_foreign_key "sessions", "users"
  add_foreign_key "tasks", "users"
end

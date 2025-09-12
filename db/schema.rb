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

ActiveRecord::Schema[8.1].define(version: 2025_09_12_131500) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "application_processes", force: :cascade do |t|
    t.date "applied_on"
    t.timestamptz "created_at"
    t.bigint "job_opening_id"
    t.date "job_posted_on"
    t.date "last_follow_up_on"
    t.date "next_follow_up_on"
    t.text "status"
    t.timestamptz "updated_at"
    t.index ["job_opening_id"], name: "idx_16405_index_application_processes_on_job_opening_id"
  end

  create_table "companies", force: :cascade do |t|
    t.timestamptz "created_at"
    t.text "industry"
    t.text "linkedin_url"
    t.text "name"
    t.text "notes"
    t.text "tech_stack"
    t.timestamptz "updated_at"
    t.text "website"
  end

  create_table "contacts", force: :cascade do |t|
    t.bigint "company_id"
    t.timestamptz "created_at"
    t.text "email"
    t.text "linkedin_url"
    t.text "name"
    t.text "notes"
    t.text "role"
    t.timestamptz "updated_at"
    t.index ["company_id"], name: "idx_16412_index_contacts_on_company_id"
  end

  create_table "content_ideas", force: :cascade do |t|
    t.timestamptz "created_at"
    t.text "idea_type"
    t.bigint "interest_score"
    t.bigint "job_opening_id"
    t.text "platforms"
    t.date "scheduled_for"
    t.text "tags"
    t.text "title"
    t.timestamptz "updated_at"
    t.bigint "urgency_score"
    t.index ["job_opening_id"], name: "idx_16419_index_content_ideas_on_job_opening_id"
  end

  create_table "direct_messages", force: :cascade do |t|
    t.integer "application_process_id", null: false
    t.integer "contact_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.integer "direction"
    t.datetime "sent_at"
    t.datetime "updated_at", null: false
    t.index ["application_process_id"], name: "index_direct_messages_on_application_process_id"
    t.index ["contact_id"], name: "index_direct_messages_on_contact_id"
  end

  create_table "interviews", force: :cascade do |t|
    t.bigint "application_process_id"
    t.timestamptz "created_at"
    t.bigint "duration"
    t.bigint "enjoyment_score"
    t.text "interview_type"
    t.text "notes"
    t.bigint "performance_score"
    t.bigint "round_number"
    t.timestamptz "scheduled_at"
    t.text "transcript"
    t.timestamptz "updated_at"
    t.index ["application_process_id"], name: "idx_16426_index_interviews_on_application_process_id"
  end

  create_table "job_opening_contacts", force: :cascade do |t|
    t.bigint "contact_id"
    t.timestamptz "created_at"
    t.bigint "job_opening_id"
    t.timestamptz "updated_at"
    t.index ["contact_id"], name: "idx_16433_index_job_opening_contacts_on_contact_id"
    t.index ["job_opening_id", "contact_id"], name: "idx_16433_idx_job_opening_contacts_unique", unique: true
    t.index ["job_opening_id"], name: "idx_16433_index_job_opening_contacts_on_job_opening_id"
  end

  create_table "job_openings", force: :cascade do |t|
    t.bigint "company_id"
    t.timestamptz "created_at"
    t.text "description"
    t.bigint "interest_score"
    t.boolean "is_public", default: true
    t.text "location"
    t.bigint "match_score"
    t.text "salary"
    t.text "source"
    t.text "tech_stack"
    t.text "title"
    t.timestamptz "updated_at"
    t.text "values"
    t.index ["company_id"], name: "idx_16438_index_job_openings_on_company_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.timestamptz "created_at"
    t.text "ip_address"
    t.timestamptz "updated_at"
    t.text "user_agent"
    t.bigint "user_id"
    t.index ["user_id"], name: "idx_16446_index_sessions_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "application_process_id"
    t.boolean "completed", default: false
    t.timestamptz "created_at"
    t.date "due_date"
    t.text "notes"
    t.text "title"
    t.timestamptz "updated_at"
    t.bigint "user_id"
    t.index ["application_process_id"], name: "idx_16453_index_tasks_on_application_process_id"
    t.index ["user_id"], name: "idx_16453_index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.timestamptz "created_at"
    t.text "email_address"
    t.text "password_digest"
    t.timestamptz "updated_at"
    t.index ["email_address"], name: "idx_16398_index_users_on_email_address", unique: true
  end

  add_foreign_key "application_processes", "job_openings", name: "application_processes_job_opening_id_fkey"
  add_foreign_key "contacts", "companies", name: "contacts_company_id_fkey"
  add_foreign_key "content_ideas", "job_openings", name: "content_ideas_job_opening_id_fkey"
  add_foreign_key "direct_messages", "application_processes"
  add_foreign_key "direct_messages", "contacts"
  add_foreign_key "interviews", "application_processes", name: "interviews_application_process_id_fkey"
  add_foreign_key "job_opening_contacts", "contacts", name: "job_opening_contacts_contact_id_fkey"
  add_foreign_key "job_opening_contacts", "job_openings", name: "job_opening_contacts_job_opening_id_fkey"
  add_foreign_key "job_openings", "companies", name: "job_openings_company_id_fkey"
  add_foreign_key "sessions", "users", name: "sessions_user_id_fkey"
  add_foreign_key "tasks", "application_processes", name: "tasks_application_process_id_fkey"
  add_foreign_key "tasks", "users", name: "tasks_user_id_fkey"
end

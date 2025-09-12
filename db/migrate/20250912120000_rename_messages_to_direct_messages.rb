class RenameMessagesToDirectMessages < ActiveRecord::Migration[8.1]
  def up
    return unless table_exists?(:messages)

    create_table :direct_messages do |t|
      t.integer :application_process_id, null: false
      t.integer :contact_id, null: false
      t.text :content
      t.datetime :created_at, null: false
      t.integer :direction
      t.datetime :sent_at
      t.datetime :updated_at, null: false
    end

    add_index :direct_messages, :application_process_id, name: "index_direct_messages_on_application_process_id"
    add_index :direct_messages, :contact_id, name: "index_direct_messages_on_contact_id"
    add_foreign_key :direct_messages, :application_processes
    add_foreign_key :direct_messages, :contacts

    execute <<~SQL
      INSERT INTO direct_messages (id, application_process_id, contact_id, content, created_at, direction, sent_at, updated_at)
      SELECT id, application_process_id, contact_id, content, created_at, direction, sent_at, updated_at FROM messages;
    SQL

    drop_table :messages
  end

  def down
    return unless table_exists?(:direct_messages)

    create_table :messages do |t|
      t.integer :application_process_id, null: false
      t.integer :contact_id, null: false
      t.text :content
      t.datetime :created_at, null: false
      t.integer :direction
      t.datetime :sent_at
      t.datetime :updated_at, null: false
    end

    add_index :messages, :application_process_id, name: "index_messages_on_application_process_id"
    add_index :messages, :contact_id, name: "index_messages_on_contact_id"
    add_foreign_key :messages, :application_processes
    add_foreign_key :messages, :contacts

    execute <<~SQL
      INSERT INTO messages (id, application_process_id, contact_id, content, created_at, direction, sent_at, updated_at)
      SELECT id, application_process_id, contact_id, content, created_at, direction, sent_at, updated_at FROM direct_messages;
    SQL

    drop_table :direct_messages
  end
end

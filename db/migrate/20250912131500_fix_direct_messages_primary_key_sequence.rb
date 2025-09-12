class FixDirectMessagesPrimaryKeySequence < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL
      SELECT setval(
        pg_get_serial_sequence('direct_messages','id'),
        COALESCE((SELECT MAX(id) FROM direct_messages), 0),
        true
      );
    SQL
  end

  def down
    # No-op: sequence value will advance naturally
  end
end

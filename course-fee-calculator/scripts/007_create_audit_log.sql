-- Create audit log table for tracking data modifications
-- This table records all INSERT, UPDATE, and DELETE operations on processed_schedule_data

CREATE TABLE IF NOT EXISTS data_modification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL DEFAULT 'processed_schedule_data',
  record_id UUID,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  modified_at TIMESTAMP DEFAULT NOW(),
  modified_by TEXT
);

-- Enable Row Level Security
ALTER TABLE data_modification_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (single-user system)
CREATE POLICY "Allow all operations on data_modification_logs"
ON data_modification_logs FOR ALL USING (true);

-- Create index for faster queries
CREATE INDEX idx_data_modification_logs_record_id ON data_modification_logs(record_id);
CREATE INDEX idx_data_modification_logs_operation_type ON data_modification_logs(operation_type);
CREATE INDEX idx_data_modification_logs_modified_at ON data_modification_logs(modified_at DESC);

-- Add comment for documentation
COMMENT ON TABLE data_modification_logs IS 'Audit log table to track all modifications to processed_schedule_data';
COMMENT ON COLUMN data_modification_logs.operation_type IS 'Type of operation: INSERT, UPDATE, or DELETE';
COMMENT ON COLUMN data_modification_logs.old_values IS 'JSON object containing values before the change (for UPDATE and DELETE)';
COMMENT ON COLUMN data_modification_logs.new_values IS 'JSON object containing values after the change (for INSERT and UPDATE)';

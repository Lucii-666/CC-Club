/*
  # Create component returns table

  1. New Tables
    - `component_returns` table for tracking component returns
    - Records condition and verification details

  2. Security
    - Enable RLS on component_returns table
    - Add policies for return access and management
*/

CREATE TABLE IF NOT EXISTS component_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES component_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  component_id uuid NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  quantity_returned integer NOT NULL CHECK (quantity_returned > 0),
  condition component_condition DEFAULT 'good'::component_condition NOT NULL,
  return_date timestamptz DEFAULT now(),
  verified_by uuid REFERENCES users(id),
  verified_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_component_returns_request_id ON component_returns(request_id);

-- Enable RLS
ALTER TABLE component_returns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own returns"
  ON component_returns
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all returns"
  ON component_returns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can create returns"
  ON component_returns
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update returns"
  ON component_returns
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
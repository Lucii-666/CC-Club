/*
  # Create component requests table

  1. New Tables
    - `component_requests` table for component borrowing requests
    - Tracks request lifecycle and approvals

  2. Security
    - Enable RLS on component_requests table
    - Add policies for request access and management
*/

CREATE TABLE IF NOT EXISTS component_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  component_id uuid NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  purpose text NOT NULL,
  expected_return_date date NOT NULL,
  status request_status DEFAULT 'pending'::request_status NOT NULL,
  request_date timestamptz DEFAULT now(),
  approved_by uuid REFERENCES users(id),
  approved_date timestamptz,
  issued_date timestamptz,
  returned_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_component_requests_user_id ON component_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_component_requests_component_id ON component_requests(component_id);
CREATE INDEX IF NOT EXISTS idx_component_requests_status ON component_requests(status);

-- Enable RLS
ALTER TABLE component_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own requests"
  ON component_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all requests"
  ON component_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Students can create requests"
  ON component_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update requests"
  ON component_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Function to update component quantities when request status changes
CREATE OR REPLACE FUNCTION update_component_quantities()
RETURNS trigger AS $$
BEGIN
  -- Handle status changes
  IF TG_OP = 'UPDATE' THEN
    -- If request was approved and is now issued
    IF OLD.status = 'approved' AND NEW.status = 'issued' THEN
      UPDATE components
      SET 
        available_quantity = available_quantity - NEW.quantity,
        issued_quantity = issued_quantity + NEW.quantity
      WHERE id = NEW.component_id;
    END IF;
    
    -- If request was issued and is now returned
    IF OLD.status = 'issued' AND NEW.status = 'returned' THEN
      UPDATE components
      SET 
        issued_quantity = issued_quantity - NEW.quantity,
        available_quantity = available_quantity + NEW.quantity
      WHERE id = NEW.component_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for component quantity updates
CREATE TRIGGER update_component_quantities_trigger
  AFTER INSERT OR UPDATE ON component_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_component_quantities();

-- Trigger for updated_at
CREATE TRIGGER update_component_requests_updated_at
  BEFORE UPDATE ON component_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
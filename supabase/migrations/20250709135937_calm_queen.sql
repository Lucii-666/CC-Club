/*
  # Create components table

  1. New Tables
    - `components` table for electronic components inventory
    - Tracks quantities, specifications, and metadata

  2. Security
    - Enable RLS on components table
    - Add policies for component access and management
*/

CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  specifications jsonb DEFAULT '{}'::jsonb,
  total_quantity integer DEFAULT 0 NOT NULL,
  available_quantity integer DEFAULT 0 NOT NULL,
  issued_quantity integer DEFAULT 0 NOT NULL,
  damaged_quantity integer DEFAULT 0 NOT NULL,
  image_url text,
  low_stock_threshold integer DEFAULT 5 NOT NULL,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  CONSTRAINT positive_quantities CHECK (
    total_quantity >= 0 AND
    available_quantity >= 0 AND
    issued_quantity >= 0 AND
    damaged_quantity >= 0 AND
    total_quantity = (available_quantity + issued_quantity + damaged_quantity)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_available_quantity ON components(available_quantity);

-- Enable RLS
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view components"
  ON components
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage components"
  ON components
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
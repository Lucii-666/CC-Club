/*
  # Create custom enum types

  1. Enums
    - user_role: student, admin, super_admin
    - request_status: pending, approved, rejected, issued, returned
    - component_condition: good, damaged, missing
    - notification_type: info, success, warning, error
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'admin', 'super_admin');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'issued', 'returned');
CREATE TYPE component_condition AS ENUM ('good', 'damaged', 'missing');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
USE school_announcements;

-- Add level and profession columns to users table
ALTER TABLE users 
ADD COLUMN level VARCHAR(50) DEFAULT NULL,
ADD COLUMN profession VARCHAR(50) DEFAULT 'student';

-- Update existing admin user
UPDATE users SET profession = 'admin' WHERE role = 'admin';

-- Add target_audience column to announcements table
ALTER TABLE announcements 
ADD COLUMN target_audience VARCHAR(50) DEFAULT 'all';

-- Update existing announcements to be visible to all
UPDATE announcements SET target_audience = 'all';
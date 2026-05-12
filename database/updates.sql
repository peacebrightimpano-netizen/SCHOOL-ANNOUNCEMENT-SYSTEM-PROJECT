USE school_announcements;

-- Drop old columns if they exist and recreate cleanly
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS profession VARCHAR(50) DEFAULT 'student';

-- Update admin
UPDATE users SET profession = 'admin' WHERE role = 'admin';

-- Add target columns to announcements
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS target_audience VARCHAR(50) DEFAULT 'all',
ADD COLUMN IF NOT EXISTS target_user_id INT DEFAULT NULL,
FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Update existing announcements
UPDATE announcements SET target_audience = 'all';
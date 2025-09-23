-- Comprehensive SQL Script to Fix Constraint Issues
-- Run this in your Supabase SQL Editor to fix phone and email constraint problems

-- 1. Fix Phone Field Constraints
DO $$ 
BEGIN
    -- Drop unique constraint on phone field if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'students' 
        AND constraint_name = 'students_phone_key'
        AND constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE students DROP CONSTRAINT students_phone_key;
        RAISE NOTICE 'Successfully dropped unique constraint on phone field';
    ELSE
        RAISE NOTICE 'No unique constraint found on phone field';
    END IF;
    
    -- Drop unique index on phone field if it exists
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'students' AND indexname = 'idx_students_phone'
    ) THEN
        DROP INDEX idx_students_phone;
        RAISE NOTICE 'Successfully dropped unique index on phone field';
    ELSE
        RAISE NOTICE 'No unique index found on phone field';
    END IF;
    
    -- Make phone field nullable if it's not already
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' 
        AND column_name = 'phone' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE students ALTER COLUMN phone DROP NOT NULL;
        RAISE NOTICE 'Successfully made phone field nullable';
    ELSE
        RAISE NOTICE 'Phone field is already nullable';
    END IF;
    
    -- Set phone field default to NULL
    ALTER TABLE students ALTER COLUMN phone SET DEFAULT NULL;
    
    -- Convert existing empty strings to NULL
    UPDATE students SET phone = NULL WHERE phone = '';
    RAISE NOTICE 'Converted empty phone strings to NULL';
END $$;

-- 2. Verify Email Field Constraints
DO $$ 
BEGIN
    -- Check if email field has proper unique constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'students' 
        AND constraint_name = 'students_email_key'
        AND constraint_type = 'UNIQUE'
    ) THEN
        -- Add unique constraint on email if it doesn't exist
        ALTER TABLE students ADD CONSTRAINT students_email_key UNIQUE (email);
        RAISE NOTICE 'Added unique constraint on email field';
    ELSE
        RAISE NOTICE 'Email field already has unique constraint';
    END IF;
    
    -- Ensure email field is NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' 
        AND column_name = 'email' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE students ALTER COLUMN email SET NOT NULL;
        RAISE NOTICE 'Made email field NOT NULL';
    ELSE
        RAISE NOTICE 'Email field is already NOT NULL';
    END IF;
END $$;

-- 3. Clean up any duplicate email entries (if they exist)
-- This will keep the first occurrence and remove duplicates
DELETE FROM students 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM students 
    GROUP BY email
);

-- 4. Verify the final table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    CASE 
        WHEN constraint_name IS NOT NULL THEN constraint_type
        ELSE 'No constraint'
    END as constraint_type
FROM information_schema.columns c
LEFT JOIN information_schema.table_constraints tc 
    ON c.table_name = tc.table_name 
    AND c.column_name = tc.column_name
WHERE c.table_name = 'students' 
    AND c.column_name IN ('email', 'phone')
ORDER BY c.ordinal_position;

-- 5. Show current constraints on the students table
SELECT 
    constraint_name,
    constraint_type,
    column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'students'
ORDER BY tc.constraint_name;

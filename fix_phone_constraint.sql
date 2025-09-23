-- SQL Script to Fix Phone Field Constraint Issue
-- Run this in your Supabase SQL Editor if you have phone field constraint issues

-- Check if there's a unique constraint on phone field
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'students' 
        AND constraint_name = 'students_phone_key'
        AND constraint_type = 'UNIQUE'
    ) THEN
        -- Drop the unique constraint on phone field
        ALTER TABLE students DROP CONSTRAINT students_phone_key;
        RAISE NOTICE 'Successfully dropped unique constraint on phone field';
    ELSE
        RAISE NOTICE 'No unique constraint found on phone field';
    END IF;
END $$;

-- Check if there's a unique index on phone field
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'students' AND indexname = 'idx_students_phone'
    ) THEN
        -- Drop the unique index on phone field
        DROP INDEX idx_students_phone;
        RAISE NOTICE 'Successfully dropped unique index on phone field';
    ELSE
        RAISE NOTICE 'No unique index found on phone field';
    END IF;
END $$;

-- Update phone field to allow NULL values and remove any NOT NULL constraint
DO $$ 
BEGIN
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
END $$;

-- Set phone field default to NULL
ALTER TABLE students ALTER COLUMN phone SET DEFAULT NULL;

-- Update any existing empty strings to NULL
UPDATE students SET phone = NULL WHERE phone = '';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name = 'phone';

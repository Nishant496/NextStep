-- SQL Script to Drop roll_no Column from Existing Database
-- Run this in your Supabase SQL Editor if you have an existing database with roll_no column

-- Drop roll_no column if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'roll_no'
    ) THEN
        -- Drop the unique constraint first if it exists
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'students' 
            AND constraint_name = 'students_roll_no_key'
        ) THEN
            ALTER TABLE students DROP CONSTRAINT students_roll_no_key;
        END IF;
        
        -- Drop the index if it exists
        IF EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'students' AND indexname = 'idx_students_roll_no'
        ) THEN
            DROP INDEX idx_students_roll_no;
        END IF;
        
        -- Finally drop the column
        ALTER TABLE students DROP COLUMN roll_no;
        
        RAISE NOTICE 'Successfully dropped roll_no column and related constraints/indexes';
    ELSE
        RAISE NOTICE 'roll_no column does not exist in students table';
    END IF;
END $$;

-- Verify the column has been dropped
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;

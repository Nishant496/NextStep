-- Database Initialization Script for NextStep Application
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop roll_no column if it exists (for existing databases)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'roll_no'
    ) THEN
        ALTER TABLE students DROP COLUMN roll_no;
    END IF;
END $$;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    cgpa NUMERIC(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
    active_backlog INTEGER DEFAULT 0 CHECK (active_backlog >= 0),
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT NULL,
    linkedin_url TEXT,
    github_url TEXT,
    resume_pdf_url TEXT
);

-- Create programming_languages table
CREATE TABLE IF NOT EXISTS programming_languages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Create tools_framework table
CREATE TABLE IF NOT EXISTS tools_framework (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Create students_table (junction table for student-programming language relationships)
CREATE TABLE IF NOT EXISTS students_table (
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    language_id BIGINT REFERENCES programming_languages(id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, language_id)
);

-- Create student_tools (junction table for student-tools relationships)
CREATE TABLE IF NOT EXISTS student_tools (
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    tool_id BIGINT REFERENCES tools_framework(id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, tool_id)
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    cert_name TEXT NOT NULL,
    cert_pdf_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample programming languages
INSERT INTO programming_languages (name) VALUES
    ('C'),
    ('C++'),
    ('Java'),
    ('Python'),
    ('JavaScript'),
    ('TypeScript'),
    ('Go'),
    ('Rust'),
    ('PHP'),
    ('C#'),
    ('Ruby'),
    ('Swift'),
    ('Kotlin'),
    ('Scala'),
    ('R')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tools and frameworks
INSERT INTO tools_framework (name) VALUES
    ('React'),
    ('Node.js'),
    ('Flutter'),
    ('TensorFlow'),
    ('Docker'),
    ('Angular'),
    ('Vue.js'),
    ('Spring'),
    ('Django'),
    ('MongoDB'),
    ('PostgreSQL'),
    ('Redis'),
    ('Kubernetes'),
    ('AWS'),
    ('Azure'),
    ('Google Cloud'),
    ('Git'),
    ('Jenkins'),
    ('Jira'),
    ('Figma')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_certifications_student_id ON certifications(student_id);
CREATE INDEX IF NOT EXISTS idx_students_table_student_id ON students_table(student_id);
CREATE INDEX IF NOT EXISTS idx_student_tools_student_id ON student_tools(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE programming_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools_framework ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to programming languages" ON programming_languages
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tools and frameworks" ON tools_framework
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update their own data
CREATE POLICY "Allow authenticated users to insert students" ON students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update students" ON students
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to insert certifications" ON certifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert student language relations" ON students_table
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert student tool relations" ON student_tools
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a function to get student with all related data
CREATE OR REPLACE FUNCTION get_student_with_details(student_email TEXT)
RETURNS TABLE (
    student_data JSON,
    programming_languages JSON,
    tools_frameworks JSON,
    certifications JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        json_build_object(
            'id', s.id,
            'full_name', s.full_name,
            'department', s.department,
            'academic_year', s.academic_year,
            'cgpa', s.cgpa,
            'active_backlog', s.active_backlog,
            'email', s.email,
            'phone', s.phone,
            'linkedin_url', s.linkedin_url,
            'github_url', s.github_url,
            'resume_pdf_url', s.resume_pdf_url,
            'created_at', s.created_at
        ) as student_data,
        
        COALESCE(
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', pl.id,
                    'name', pl.name
                )
            ) FILTER (WHERE pl.id IS NOT NULL),
            '[]'::json
        ) as programming_languages,
        
        COALESCE(
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', tf.id,
                    'name', tf.name
            )
            ) FILTER (WHERE tf.id IS NOT NULL),
            '[]'::json
        ) as tools_frameworks,
        
        COALESCE(
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', c.id,
                    'cert_name', c.cert_name,
                    'cert_pdf_url', c.cert_pdf_url,
                    'uploaded_at', c.uploaded_at
                )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
        ) as certifications
        
    FROM students s
    LEFT JOIN students_table st ON s.id = st.student_id
    LEFT JOIN programming_languages pl ON st.language_id = pl.id
    LEFT JOIN student_tools st2 ON s.id = st2.student_id
    LEFT JOIN tools_framework tf ON st2.tool_id = tf.id
    LEFT JOIN certifications c ON s.id = c.student_id
    WHERE s.email = student_email
    GROUP BY s.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_student_with_details(TEXT) TO anon, authenticated;

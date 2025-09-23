# NextStep Supabase Integration Setup Guide

## 🚀 Overview
This guide will help you set up Supabase integration for your NextStep application to store student data from both Register.jsx and UserInput.jsx forms.

## 📋 Prerequisites
- Supabase account and project
- Node.js and npm installed
- Basic knowledge of SQL

## 🔧 Step-by-Step Setup

### 1. Database Initialization

#### Run the SQL Script in Supabase
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database_init.sql`
4. Click **Run** to execute the script

This will create:
- `students` table (main student information)
- `programming_languages` table (predefined languages)
- `tools_framework` table (predefined tools)
- `students_table` (junction table for student-language relationships)
- `student_tools` (junction table for student-tool relationships)
- `certifications` table (student certifications)
- Proper indexes and RLS policies

### 2. Environment Variables

#### Create .env.local file
Create a `.env.local` file in your project root with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://fogefgoeefwvbitxdmqk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ2VmZ29lZWZ3dmJpdHhkbXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0Mzk2ODAsImV4cCI6MjA3MTAxNTY4MH0.SkcUG-2PLlfY6GHUjluIyuyzS4w_fxBzCWtZyYmX2dg

# Environment
NODE_ENV=development
```

#### Important Notes:
- **Never commit `.env.local` to Git** (it's already in `.gitignore`)
- Use `.env.local` for local development
- Use `.env.production` for production builds
- The `VITE_` prefix makes variables available to the client-side code

### 3. Dependencies Installation
```bash
npm install @supabase/supabase-js
```

## 🗄️ Database Schema

### Students Table
- `id` - Primary key (auto-increment)
- `full_name` - Student's full name
- `roll_no` - Unique roll number
- `department` - Engineering department
- `academic_year` - Current academic year
- `cgpa` - Cumulative GPA (0.00-10.00)
- `active_backlog` - Number of active backlogs
- `email` - Student email (unique)
- `phone` - Contact number
- `linkedin_url` - LinkedIn profile URL
- `github_url` - GitHub profile URL
- `resume_pdf_url` - Resume file path
- `created_at` - Timestamp of creation

### Programming Languages Table
- `id` - Primary key
- `name` - Language name (unique)

### Tools & Frameworks Table
- `id` - Primary key
- `name` - Tool/framework name (unique)

### Junction Tables
- `students_table` - Links students to programming languages
- `student_tools` - Links students to tools/frameworks

### Certifications Table
- `id` - Primary key
- `student_id` - Foreign key to students
- `cert_name` - Certification name
- `cert_pdf_url` - Certificate file path
- `uploaded_at` - Upload timestamp

## 🔐 Row Level Security (RLS)
The database includes RLS policies for:
- Public read access to programming languages and tools
- Authenticated users can insert/update their own data
- Secure data access based on user authentication

## 📱 Application Flow

### 1. Registration (Register.jsx)
- User fills academic details
- Data saved to `students` table
- Student ID stored in Clerk metadata
- Redirects to dashboard

### 2. Profile Completion (UserInput.jsx)
- User fills additional information
- Updates student record with contact details
- Saves programming languages and tools
- Creates certification records
- Marks profile as complete

### 3. Dashboard Display
- Fetches student data from Supabase
- Displays comprehensive profile
- Shows skills, certifications, and resume info

## 🛠️ Database Operations

### Student Operations
```javascript
import { studentDB } from '../lib/supabase'

// Create student
const result = await studentDB.createStudent(studentData)

// Update student
const result = await studentDB.updateStudent(studentId, updateData)

// Get student by ID
const result = await studentDB.getStudentById(studentId)
```

### Programming Languages
```javascript
import { programmingLanguageDB } from '../lib/supabase'

// Save student languages
const result = await programmingLanguageDB.saveStudentLanguages(studentId, languageNames)
```

### Tools & Frameworks
```javascript
import { toolsFrameworkDB } from '../lib/supabase'

// Save student tools
const result = await toolsFrameworkDB.saveStudentTools(studentId, toolNames)
```

## 🚨 Important Notes

1. **File Uploads**: Currently stores file names only. For production, implement Supabase Storage for actual file uploads.

2. **Error Handling**: All database operations include comprehensive error handling and user feedback.

3. **Data Validation**: Client-side validation ensures data integrity before database operations.

4. **Security**: RLS policies ensure users can only access their own data.

## 🔍 Troubleshooting

### Common Issues

1. **"Student ID not found"**
   - Ensure user has completed registration first
   - Check Clerk metadata for `studentId`

2. **Database connection errors**
   - Verify Supabase URL and API key
   - Check network connectivity
   - Ensure RLS policies are properly configured

3. **Permission denied errors**
   - Verify RLS policies are enabled
   - Check user authentication status
   - Ensure proper table permissions

### Debug Mode
Enable console logging to debug database operations:
```javascript
// Check browser console for detailed error messages
console.log('Database operation result:', result)
```

## 📈 Performance Optimization

1. **Indexes**: Database includes indexes on frequently queried columns
2. **Batch Operations**: Programming languages and tools are saved in batches
3. **Lazy Loading**: Dashboard loads data only when needed
4. **Caching**: Consider implementing React Query for data caching

## 🔮 Future Enhancements

1. **File Storage**: Integrate Supabase Storage for resume and certificate uploads
2. **Real-time Updates**: Use Supabase real-time subscriptions for live data
3. **Advanced Queries**: Implement complex filtering and search functionality
4. **Data Export**: Add CSV/PDF export capabilities
5. **Analytics**: Dashboard analytics and insights

## 📞 Support

For technical support:
1. Check browser console for error messages
2. Verify Supabase project configuration
3. Review RLS policies and permissions
4. Test database connections in Supabase dashboard

---

**Happy Coding! 🎉**
Your NextStep application is now fully integrated with Supabase!

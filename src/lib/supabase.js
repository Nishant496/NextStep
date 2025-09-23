import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)



// Database operations for students
export const studentDB = {
  // Create a new student record
  async createStudent(studentData) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error creating student:', error)
      return { success: false, error: error.message }
    }
  },

  // Update student record
  async updateStudent(studentId, updateData) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', studentId)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error updating student:', error)
      return { success: false, error: error.message }
    }
  },

  // Get student by ID
  async getStudentById(studentId) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching student:', error)
      return { success: false, error: error.message }
    }
  },

  // Get student by email
  async getStudentByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching student by email:', error)
      return { success: false, error: error.message }
    }
  },



  // Get all students
  async getAllStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching students:', error)
      return { success: false, error: error.message }
    }
  }
}

// Enhanced database operations for programming languages
export const programmingLanguageDB = {
  // Get all programming languages
  async getAllLanguages() {
    try {
      const { data, error } = await supabase
        .from('programming_languages')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching programming languages:', error)
      return { success: false, error: error.message }
    }
  },

  // Create programming language relationship
  async createStudentLanguageRelation(studentId, languageId) {
    try {
      const { data, error } = await supabase
        .from('students_table')
        .insert([{
          student_id: studentId,
          language_id: languageId
        }])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error creating language relation:', error)
      return { success: false, error: error.message }
    }
  },

  // Save multiple programming languages for a student
  async saveStudentLanguages(studentId, languageNames) {
    try {
      // Get all available languages
      const { data: allLanguages, error: fetchError } = await supabase
        .from('programming_languages')
        .select('*')
      
      if (fetchError) throw fetchError

      // Create language relations
      const relations = []
      for (const langName of languageNames) {
        const language = allLanguages.find(l => l.name.toLowerCase() === langName.toLowerCase())
        if (language) {
          relations.push({
            student_id: studentId,
            language_id: language.id
          })
        }
      }

      if (relations.length > 0) {
        const { data, error } = await supabase
          .from('students_table')
          .insert(relations)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }

      return { success: true, data: [] }
    } catch (error) {
      console.error('Error saving student languages:', error)
      return { success: false, error: error.message }
    }
  }
}

// Enhanced database operations for tools and frameworks
export const toolsFrameworkDB = {
  // Get all tools and frameworks
  async getAllTools() {
    try {
      const { data, error } = await supabase
        .from('tools_framework')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching tools:', error)
      return { success: false, error: error.message }
    }
  },

  // Create tool relationship
  async createStudentToolRelation(studentId, toolId) {
    try {
      const { data, error } = await supabase
        .from('student_tools')
        .insert([{
          student_id: studentId,
          tool_id: toolId
        }])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error creating tool relation:', error)
      return { success: false, error: error.message }
    }
  },

  // Save multiple tools for a student
  async saveStudentTools(studentId, toolNames) {
    try {
      // Get all available tools
      const { data: allTools, error: fetchError } = await supabase
        .from('tools_framework')
        .select('*')
      
      if (fetchError) throw fetchError

      // Create tool relations
      const relations = []
      for (const toolName of toolNames) {
        const tool = allTools.find(t => t.name.toLowerCase() === toolName.toLowerCase())
        if (tool) {
          relations.push({
            student_id: studentId,
            tool_id: tool.id
          })
        }
      }

      if (relations.length > 0) {
        const { data, error } = await supabase
          .from('student_tools')
          .insert(relations)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }

      return { success: true, data: [] }
    } catch (error) {
      console.error('Error saving student tools:', error)
      return { success: false, error: error.message }
    }
  }
}

// Database operations for certifications
export const certificationDB = {
  // Create certification record
  async createCertification(certData) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert([certData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error creating certification:', error)
      return { success: false, error: error.message }
    }
  },

  // Get certifications by student ID
  async getCertificationsByStudent(studentId) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('student_id', studentId)
        .order('uploaded_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching certifications:', error)
      return { success: false, error: error.message }
    }
  }
}

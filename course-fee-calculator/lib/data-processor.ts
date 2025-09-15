// Data processing logic adapted from the Python file
export interface ScheduleData {
  title: string
  startdate: string
  enddate: string
  duration: string
  hours: number
  date: string
  name: string
  fee_per_hour: number
  graduated: string
  parent: string
  accompany_number: number
}

// Student profile interface (for students table - standard information only)
export interface StudentProfile {
  name: string
  fee_per_hour: number
  graduated: string
  parent: string
  accompany_number: number
  language: string
}

// Course data interface (for processed_schedule_data table - includes dynamic data)
export interface CourseData {
  name: string
  fee_per_hour: number
  graduated: string
  parent: string
  accompany_number: number
  hours: number
  date: string
  title?: string
}

// Complete student database based on your Python data
const STUDENT_DATABASE = [
  { name: "Aahana", fee_per_hour: 80, graduated: "Ongoing", parent: "Nisha", accompany_number: 0, language: "English" },
  { name: "Giselle 林亭萱", fee_per_hour: 120, graduated: "Ongoing", parent: "Giselle's Dad & Mum", accompany_number: 0, language: "English" },
  { name: "Samara", fee_per_hour: 80, graduated: "Ongoing", parent: "Samara's Mum", accompany_number: 0, language: "English" },
  { name: "Shiv", fee_per_hour: 80, graduated: "Ongoing", parent: "Smiti", accompany_number: 0, language: "English" },
  { name: "Sophia", fee_per_hour: 80, graduated: "Ongoing", parent: "Filzait", accompany_number: 0, language: "English" },
  { name: "Yuno", fee_per_hour: 80, graduated: "Ongoing", parent: "Yuno's Mum", accompany_number: 0, language: "English" },
  { name: "周毅", fee_per_hour: 50, graduated: "Ongoing", parent: "周太太", accompany_number: 0, language: "English" },
  { name: "育瑜", fee_per_hour: 100, graduated: "Ongoing", parent: "Yuyu's Mum", accompany_number: 0, language: "English" },
  { name: "补习中心", fee_per_hour: 60, graduated: "Ongoing", parent: "补习中心", accompany_number: 0, language: "English" },
  { name: "鼎恩", fee_per_hour: 70, graduated: "Ongoing", parent: "鼎恩妈妈", accompany_number: 0, language: "English" },
  { name: "Aaliya", fee_per_hour: 100, graduated: "Ongoing", parent: "Suruchi", accompany_number: 1, language: "English" },
  { name: "Zahia", fee_per_hour: 100, graduated: "Ongoing", parent: "Suruchi", accompany_number: 1, language: "English" },
  { name: "Aaron", fee_per_hour: 80, graduated: "Ongoing", parent: "Hui Mien", accompany_number: 2, language: "English" },
  { name: "Bono", fee_per_hour: 60, graduated: "Ongoing", parent: "Bono媽媽", accompany_number: 2, language: "English" },
  { name: "sheera", fee_per_hour: 60, graduated: "Ongoing", parent: "Hui Mien", accompany_number: 2, language: "English" },
  { name: "亚拉", fee_per_hour: 80, graduated: "Ongoing", parent: "Inoshi", accompany_number: 3, language: "English" },
  { name: "凯文", fee_per_hour: 80, graduated: "Ongoing", parent: "Inoshi", accompany_number: 3, language: "English" },
  { name: "景銓", fee_per_hour: 70, graduated: "Ongoing", parent: "Joyce", accompany_number: 4, language: "English" },
  { name: "銘浩", fee_per_hour: 70, graduated: "Ongoing", parent: "Joyce", accompany_number: 4, language: "English" },
  { name: "睿恩", fee_per_hour: 100, graduated: "Ongoing", parent: "睿恩爸爸", accompany_number: 5, language: "English" },
  { name: "睿洋", fee_per_hour: 100, graduated: "Ongoing", parent: "睿恩爸爸", accompany_number: 5, language: "English" },
  { name: "妍怡", fee_per_hour: 80, graduated: "Ongoing", parent: "Val", accompany_number: 6, language: "English" },
  { name: "彦俊", fee_per_hour: 80, graduated: "Ongoing", parent: "Val", accompany_number: 6, language: "English" },
  { name: "子樑", fee_per_hour: 80, graduated: "Ongoing", parent: "惠宁妈妈", accompany_number: 7, language: "Chinese" },
  { name: "惠宁", fee_per_hour: 80, graduated: "Ongoing", parent: "惠宁妈妈", accompany_number: 7, language: "Chinese" },
  { name: "jingjun", fee_per_hour: 80, graduated: "Ongoing", parent: "Mabel", accompany_number: 8, language: "English" },
  { name: "jingyang", fee_per_hour: 80, graduated: "Ongoing", parent: "Mabel", accompany_number: 8, language: "English" },
  { name: "Lauren", fee_per_hour: 80, graduated: "Graduated", parent: "Noelle", accompany_number: 0, language: "English" },
  { name: "勇君", fee_per_hour: 80, graduated: "Graduated", parent: "勇君婆婆", accompany_number: 0, language: "English" },
  { name: "祉萱", fee_per_hour: 80, graduated: "Graduated", parent: "Zhixuan's Mum", accompany_number: 0, language: "English" },
  { name: "杰乐", fee_per_hour: 100, graduated: "Graduated", parent: "杰乐妈妈", accompany_number: 0, language: "English" },
  { name: "柏谦", fee_per_hour: 80, graduated: "Graduated", parent: "柏谦妈妈", accompany_number: 0, language: "English" },
]

// Interface for raw schedule data (stored in schedule_data table)
export interface RawScheduleData {
  title: string
  startdate: string
  enddate: string
  duration: string
}

// Step 1: Extract raw data from input text and save to schedule_data table
export async function extractRawScheduleData(rawData: string) {
  const { createClient } = await import('./supabase/client')
  const supabase = createClient()

  // Extract data using regex pattern - updated to handle your data format with multiline support
  const pattern = /Title:(.*?)Startdate:(.*?)Enddate:(.*?)Duration:(.*?)(?=Title:|$)/gm
  const matches = Array.from(rawData.matchAll(pattern))


  const rawDataArray: RawScheduleData[] = []

  for (const match of matches) {
    const [, title, startdate, enddate, duration] = match.map((s) => s.trim())
    
    
    rawDataArray.push({
      title,
      startdate,
      enddate,
      duration
    })
  }
  

  try {
    // Process data in batches to avoid URL length limits
    const BATCH_SIZE = 50 // Process 50 records at a time
    let insertedCount = 0
    let updatedCount = 0

    for (let i = 0; i < rawDataArray.length; i += BATCH_SIZE) {
      const batch = rawDataArray.slice(i, i + BATCH_SIZE)

      // Check for duplicates in this batch
      const duplicateCheck = await supabase
        .from("schedule_data")
        .select("title, startdate")
        .in("title", batch.map(item => item.title))
        .in("startdate", batch.map(item => item.startdate))

      if (duplicateCheck.error) throw duplicateCheck.error

      const existingData = duplicateCheck.data || []
      const newData = batch.filter(item => 
        !existingData.some(existing => 
          existing.title === item.title && existing.startdate === item.startdate
        )
      )

      // Insert new data in this batch
      if (newData.length > 0) {
        const { error: insertError } = await supabase.from("schedule_data").insert(newData)
        if (insertError) throw insertError
        insertedCount += newData.length
      }

      // Update existing data in this batch
      for (const item of batch) {
        const existingItem = existingData.find(existing => 
          existing.title === item.title && existing.startdate === item.startdate
        )
        
        if (existingItem) {
          const { error: updateError } = await supabase
            .from("schedule_data")
            .update({
              enddate: item.enddate,
              duration: item.duration,
              updated_at: new Date().toISOString()
            })
            .eq("title", item.title)
            .eq("startdate", item.startdate)
          
          if (updateError) throw updateError
          updatedCount++
        }
      }
    }
    
    return { 
      success: true, 
      count: rawDataArray.length,
      inserted: insertedCount,
      updated: updatedCount
    }
  } catch (error) {
    console.error("Error saving raw schedule data:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Step 2: Process raw data with intelligent matching and save to processed_schedule_data table
export async function processScheduleDataFromRaw(): Promise<{ success: boolean; count?: number; inserted?: number; updated?: number; error?: string }> {
  const { createClient } = await import('./supabase/client')
  const supabase = createClient()

  try {
    // Get raw data from schedule_data table
    const { data: rawData, error: fetchError } = await supabase
      .from("schedule_data")
      .select("*")
      .order("created_at", { ascending: true })

    if (fetchError) throw fetchError
    if (!rawData || rawData.length === 0) {
      return { success: false, error: "No raw data found" }
    }

    const processedData: CourseData[] = []

    for (const item of rawData) {
      
      // Parse dates
      const parsedStartdate = parseChineseDate(item.startdate)
      const parsedEnddate = parseSlashDate(item.enddate)
      
      if (!parsedStartdate || !parsedEnddate) {
        continue
      }

      // Calculate hours from duration
      const hours = durationToHours(item.duration)
      if (hours === null) {
        continue
      }

      // Handle 24-hour duration (skip entries that are exactly 24 hours or very close)
      // But allow 23:59:59 (which is 23.9997 hours) to pass through
      const adjustedHours = Math.abs(hours - 24) < 0.01 ? 0 : hours
      if (adjustedHours === 0) {
        continue
      }

      // Match student names from title
      const matchedNames = matchNames(item.title, STUDENT_DATABASE.map((s) => s.name))
      if (!matchedNames) {
        continue
      }

      // Get student data
      const studentData = aggregateStudentData(matchedNames, STUDENT_DATABASE)

      // Create processed data entry
      const processedItem = {
        name: matchedNames,
        fee_per_hour: studentData.fee_per_hour,
        graduated: studentData.graduated,
        parent: studentData.parent,
        accompany_number: studentData.accompany_number,
        hours: adjustedHours,
        date: parsedStartdate.toISOString().split("T")[0],
        title: item.title,
      }
      
      processedData.push(processedItem)
    }

    // Filter valid data
    const validData = processedData.filter((item) => 
      item.name && 
      item.name.trim() !== "" && 
      item.hours > 0
    )

    // Save to processed_schedule_data table
    const result = await saveProcessedDataToSupabase(validData)
    return result

  } catch (error) {
    console.error("Error processing schedule data:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Legacy function for backward compatibility
export function processScheduleData(rawData: string): CourseData[] {
  // Extract data using regex pattern - updated to match your format
  const pattern = /Title:(.*?)Startdate:(.*?)Enddate:(.*?)Duration:(.*?)(?=Title:|$)/gm
  const matches = Array.from(rawData.matchAll(pattern))

  const processedData: CourseData[] = []

  for (const match of matches) {
    const [, title, startdate, enddate, duration] = match.map((s) => s.trim())

    // Parse dates
    const parsedStartdate = parseChineseDate(startdate)
    const parsedEnddate = parseSlashDate(enddate)

    if (!parsedStartdate || !parsedEnddate) continue

    // Calculate hours from duration
    const hours = durationToHours(duration)
    if (hours === null) continue

    // Handle 24-hour duration (skip entries that are exactly 24 hours or very close)
    // But allow 23:59:59 (which is 23.9997 hours) to pass through
    const adjustedHours = Math.abs(hours - 24) < 0.01 ? 0 : hours
    if (adjustedHours === 0) continue

    // Match student names from title
    const matchedNames = matchNames(title, STUDENT_DATABASE.map((s) => s.name))
    if (!matchedNames) continue

    // Get student data
    const studentData = aggregateStudentData(matchedNames, STUDENT_DATABASE)

    processedData.push({
      name: matchedNames,
      fee_per_hour: studentData.fee_per_hour,
      graduated: studentData.graduated,
      parent: studentData.parent,
      accompany_number: studentData.accompany_number,
      hours: adjustedHours,
      date: parsedStartdate.toISOString().split("T")[0],
      title,
    })
  }

  // Filter out invalid entries - same logic as Python
  return processedData.filter((item) => 
    item.name && 
    item.name.trim() !== "" && 
    item.hours > 0
  )
}

// New function to save processed data to Supabase
export async function saveProcessedDataToSupabase(processedData: CourseData[]) {
  const { createClient } = await import('./supabase/client')
  const supabase = createClient()

  try {
    // Prepare data for insertion
    const dataToInsert = processedData.map(item => ({
      title: item.title || '',
      startdate: new Date(item.date).toISOString(),
      enddate: new Date(item.date).toISOString(), // You might want to calculate this properly
      duration: `${Math.floor(item.hours)}:${Math.floor((item.hours % 1) * 60)}:00`,
      hours: item.hours,
      date: item.date,
      name: item.name,
      fee_per_hour: item.fee_per_hour,
      graduated: item.graduated,
      parent: item.parent,
      accompany_number: item.accompany_number,
    }))

    // Process data in batches to avoid URL length limits
    const BATCH_SIZE = 50 // Process 50 records at a time
    let insertedCount = 0
    let updatedCount = 0

    for (let i = 0; i < dataToInsert.length; i += BATCH_SIZE) {
      const batch = dataToInsert.slice(i, i + BATCH_SIZE)

      // Check for duplicates in this batch
      const duplicateCheck = await supabase
        .from("processed_schedule_data")
        .select("name, date, title")
        .in("name", batch.map(item => item.name))
        .in("date", batch.map(item => item.date))
        .in("title", batch.map(item => item.title))

      if (duplicateCheck.error) throw duplicateCheck.error

      const existingData = duplicateCheck.data || []
      const newData = batch.filter(item => 
        !existingData.some(existing => 
          existing.name === item.name && 
          existing.date === item.date && 
          existing.title === item.title
        )
      )

      // Insert new data in this batch
      if (newData.length > 0) {
        const { error: insertError } = await supabase.from("processed_schedule_data").insert(newData)
        if (insertError) throw insertError
        insertedCount += newData.length
      }

      // Update existing data in this batch
      for (const item of batch) {
        const existingItem = existingData.find(existing => 
          existing.name === item.name && 
          existing.date === item.date && 
          existing.title === item.title
        )
        
        if (existingItem) {
          const { error: updateError } = await supabase
            .from("processed_schedule_data")
            .update({
              fee_per_hour: item.fee_per_hour,
              graduated: item.graduated,
              parent: item.parent,
              accompany_number: item.accompany_number,
              hours: item.hours,
              startdate: item.startdate,
              enddate: item.enddate,
              duration: item.duration,
              updated_at: new Date().toISOString()
            })
            .eq("name", item.name)
            .eq("date", item.date)
            .eq("title", item.title)
          
          if (updateError) throw updateError
          updatedCount++
        }
      }
    }
    
    return { 
      success: true, 
      count: processedData.length,
      inserted: insertedCount,
      updated: updatedCount
    }
  } catch (error) {
    console.error('Error saving processed data to Supabase:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Function to fetch processed data from Supabase
export async function fetchProcessedDataFromSupabase() {
  const { createClient } = await import('./supabase/client')
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('processed_schedule_data')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching processed data from Supabase:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error), data: [] }
  }
}

function parseChineseDate(dateStr: string): Date | null {
  try {
    // Format: 2025年8月31日 11:00
    const cleaned = dateStr.replace("年", "-").replace("月", "-").replace("日", " ")
    return new Date(cleaned)
  } catch {
    return null
  }
}

function parseSlashDate(dateStr: string): Date | null {
  try {
    // Format: 31/08/25 12:30
    const [datePart, timePart] = dateStr.split(" ")
    const [day, month, year] = datePart.split("/")
    const fullYear = Number.parseInt(year) + 2000 // Assuming 20xx
    return new Date(`${fullYear}-${month}-${day} ${timePart}`)
  } catch {
    return null
  }
}

function durationToHours(duration: string): number | null {
  try {
    const [h, m, s] = duration.split(":").map(Number)
    return h + m / 60 + s / 3600
  } catch {
    return null
  }
}

function matchNames(title: string, studentNames: string[]): string | null {
  
  // 更智能的姓名匹配逻辑
  const matches = studentNames.filter((name) => {
    const nameLower = name.toLowerCase()
    const titleLower = title.toLowerCase()
    
    // 直接包含匹配
    if (titleLower.includes(nameLower)) {
      return true
    }
    
    // 处理中文姓名的部分匹配
    if (nameLower.includes('凯文') && titleLower.includes('凯文')) {
      return true
    }
    if (nameLower.includes('亚拉') && titleLower.includes('亚拉')) {
      return true
    }
    if (nameLower.includes('妍怡') && titleLower.includes('妍怡')) {
      return true
    }
    if (nameLower.includes('彦俊') && titleLower.includes('彦俊')) {
      return true
    }
    if (nameLower.includes('惠宁') && titleLower.includes('惠宁')) {
      return true
    }
    
    // 处理英文名的部分匹配
    if (nameLower.includes('kevan') && titleLower.includes('kevan')) {
      return true
    }
    if (nameLower.includes('ayara') && titleLower.includes('ayara')) {
      return true
    }
    if (nameLower.includes('leanne') && titleLower.includes('leanne')) {
      return true
    }
    if (nameLower.includes('ian') && titleLower.includes('ian')) {
      return true
    }
    
    return false
  })
  
  return matches.length > 0 ? matches[0] : null // 只返回第一个匹配的学生
}

function aggregateStudentData(names: string, students: any[]) {
  const nameList = names.split(", ")
  const result = {
    fee_per_hour: 0,
    graduated: "",
    parent: "",
    accompany_number: 0,
  }

  const fees: number[] = []
  const graduatedList: string[] = []
  const parentList: string[] = []
  const accompanyNumbers: number[] = []

  for (const name of nameList) {
    const student = students.find((s) => s.name === name)
    if (student) {
      fees.push(student.fee_per_hour)
      graduatedList.push(student.graduated)
      parentList.push(student.parent)
      accompanyNumbers.push(student.accompany_number)
    }
  }

  // Remove duplicates and join - same logic as Python
  result.fee_per_hour = fees.length > 0 ? fees[0] : 0
  result.graduated = [...new Set(graduatedList)].join(", ")
  result.parent = [...new Set(parentList)].join(", ")
  result.accompany_number = accompanyNumbers.length > 0 ? accompanyNumbers[0] : 0

  return result
}

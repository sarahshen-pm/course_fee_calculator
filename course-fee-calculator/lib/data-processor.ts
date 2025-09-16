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
  try {
    console.log("🔧 extractRawScheduleData: Starting extraction...")
    console.log("🔧 Input data length:", rawData.length)
    console.log("🔧 Input data preview:", rawData.substring(0, 200) + "...")
    
    const { createClient } = await import('./supabase/client')
    const supabase = createClient()
    console.log("🔧 Supabase client created successfully")

    // Extract data using regex pattern - updated to handle your data format with multiline support
    const pattern = /Title:(.*?)Startdate:(.*?)Enddate:(.*?)Duration:(.*?)(?=Title:|$)/gm
    const matches = Array.from(rawData.matchAll(pattern))
    console.log("🔧 Regex matches found:", matches.length)
    
    // Log first few matches to check for encoding issues
    if (matches.length > 0) {
      console.log("🔧 First match sample:", matches[0])
      if (matches[0][2] && matches[0][2].includes("?")) {
        console.warn("⚠️ Detected corrupted Chinese characters in input data")
      }
    }

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
    
    console.log("🔧 Processed raw data array:", rawDataArray.length, "items")
    // Process data in batches to avoid URL length limits
    const BATCH_SIZE = 50 // Process 50 records at a time
    let insertedCount = 0
    let updatedCount = 0

    for (let i = 0; i < rawDataArray.length; i += BATCH_SIZE) {
      const batch = rawDataArray.slice(i, i + BATCH_SIZE)

      // Check for duplicates in this batch
      console.log(`🔧 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(rawDataArray.length/BATCH_SIZE)}`)
      const duplicateCheck = await supabase
        .from("schedule_data")
        .select("title, startdate")
        .in("title", batch.map(item => item.title))
        .in("startdate", batch.map(item => item.startdate))

      if (duplicateCheck.error) {
        console.error("❌ Duplicate check failed:", duplicateCheck.error)
        throw duplicateCheck.error
      }

      const existingData = duplicateCheck.data || []
      const newData = batch.filter(item => 
        !existingData.some(existing => 
          existing.title === item.title && existing.startdate === item.startdate
        )
      )

      // Insert new data in this batch
      if (newData.length > 0) {
        console.log(`🔧 Inserting ${newData.length} new records...`)
        const { error: insertError } = await supabase.from("schedule_data").insert(newData)
        if (insertError) {
          console.error("❌ Insert failed:", insertError)
          throw insertError
        }
        insertedCount += newData.length
        console.log(`✅ Inserted ${newData.length} records successfully`)
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
    
    console.log("✅ extractRawScheduleData completed successfully!")
    console.log(`📊 Final results: ${insertedCount} inserted, ${updatedCount} updated, ${rawDataArray.length} total`)
    
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
export async function processScheduleDataFromRaw(onlyRecent: boolean = false): Promise<{ success: boolean; count?: number; inserted?: number; updated?: number; error?: string }> {
  try {
    console.log("🔄 processScheduleDataFromRaw: Starting processing...", onlyRecent ? "(only recent data)" : "(all data)")
    const { createClient } = await import('./supabase/client')
    const supabase = createClient()
    console.log("🔄 Supabase client created successfully")

    // Get raw data from schedule_data table
    console.log("🔄 Fetching raw data from schedule_data table...")
    let query = supabase
      .from("schedule_data")
      .select("*")
      .order("created_at", { ascending: true })
    
    // If onlyRecent is true, get data from the last 5 minutes (created or updated)
    if (onlyRecent) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      query = query.or(`created_at.gte.${fiveMinutesAgo},updated_at.gte.${fiveMinutesAgo}`)
      console.log("🔄 Only processing data from last 5 minutes (created or updated):", fiveMinutesAgo)
    }
    
    const { data: rawData, error: fetchError } = await query

    if (fetchError) {
      console.error("❌ Failed to fetch raw data:", fetchError)
      throw fetchError
    }
    if (!rawData || rawData.length === 0) {
      console.log("⚠️ No raw data found in schedule_data table")
      return { success: false, error: "No raw data found" }
    }
    
    console.log(`🔄 Found ${rawData.length} raw data records to process`)

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
    const dataToInsert = processedData.map(item => {
      console.log("🔧 Preparing data for insertion:", item)
      
      // Validate date before creating Date objects
      const dateObj = new Date(item.date)
      if (isNaN(dateObj.getTime())) {
        console.error("❌ Invalid date in processed data:", item.date)
        throw new Error(`Invalid date: ${item.date}`)
      }
      
      return {
        title: item.title || '',
        startdate: dateObj.toISOString(),
        enddate: dateObj.toISOString(), // You might want to calculate this properly
        duration: `${Math.floor(item.hours)}:${Math.floor((item.hours % 1) * 60)}:00`,
        hours: item.hours,
        date: item.date,
        name: item.name,
        fee_per_hour: item.fee_per_hour,
        graduated: item.graduated,
        parent: item.parent,
        accompany_number: item.accompany_number,
      }
    })

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
    console.log("🔧 parseChineseDate: Parsing date:", dateStr)
    
    // Handle corrupted Chinese characters (年->?, 月->?, 日->?)
    let year = "", month = "", day = "", time = ""
    
    if (dateStr.includes("?")) {
      console.log("🔧 parseChineseDate: Detected corrupted Chinese characters, attempting to fix...")
      // Try to reconstruct the date from the pattern
      const match = dateStr.match(/(\d{4})\?(\d{1,2})\?(\d{1,2})\?\s+(\d{1,2}:\d{2})/)
      if (match) {
        [, year, month, day, time] = match
        console.log("🔧 parseChineseDate: Reconstructed components:", { year, month, day, time })
      } else {
        console.error("❌ parseChineseDate: Cannot reconstruct corrupted date:", dateStr)
        return null
      }
    } else {
      // Normal Chinese date format: 2025年8月31日 11:00
      const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}:\d{2})/)
      if (match) {
        [, year, month, day, time] = match
        console.log("🔧 parseChineseDate: Extracted components:", { year, month, day, time })
      } else {
        console.error("❌ parseChineseDate: Cannot parse Chinese date format:", dateStr)
        return null
      }
    }
    
    // Create date using Date constructor with individual components
    // This is more reliable across different browsers
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(time.split(':')[0]),
      parseInt(time.split(':')[1])
    )
    
    console.log("🔧 parseChineseDate: Date object created:", date)
    console.log("🔧 parseChineseDate: Date.getTime():", date.getTime())
    console.log("🔧 parseChineseDate: isNaN check:", isNaN(date.getTime()))
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("❌ parseChineseDate: Invalid date created from components:", { year, month, day, time })
      return null
    }
    
    console.log("✅ parseChineseDate: Valid date created:", date.toISOString())
    return date
  } catch (error) {
    console.error("❌ parseChineseDate: Error parsing date:", dateStr, error)
    return null
  }
}

function parseSlashDate(dateStr: string): Date | null {
  try {
    console.log("🔧 parseSlashDate: Parsing date:", dateStr)
    // Format: 31/08/25 12:30
    const [datePart, timePart] = dateStr.split(" ")
    console.log("🔧 parseSlashDate: Date part:", datePart, "Time part:", timePart)
    
    const [day, month, year] = datePart.split("/")
    console.log("🔧 parseSlashDate: Split parts:", { day, month, year })
    
    const fullYear = Number.parseInt(year) + 2000 // Assuming 20xx
    const dateString = `${fullYear}-${month}-${day} ${timePart}`
    console.log("🔧 parseSlashDate: Constructed date string:", dateString)
    
    const date = new Date(dateString)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("❌ parseSlashDate: Invalid date created from:", dateString)
      return null
    }
    
    console.log("✅ parseSlashDate: Valid date created:", date.toISOString())
    return date
  } catch (error) {
    console.error("❌ parseSlashDate: Error parsing date:", dateStr, error)
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

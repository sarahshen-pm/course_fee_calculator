import { createClient } from "./supabase/client"

// Audit log interface
export interface DataModificationLog {
  id?: string
  table_name: string
  record_id: string | null
  operation_type: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values: any | null
  new_values: any | null
  modified_at?: string
  modified_by?: string | null
}

// Result type for all operations
export interface OperationResult {
  success: boolean
  error?: string
  data?: any
}

/**
 * Log a data modification to the audit log table
 */
export async function logDataModification(
  recordId: string | null,
  operationType: 'INSERT' | 'UPDATE' | 'DELETE',
  oldValues: any | null = null,
  newValues: any | null = null
): Promise<OperationResult> {
  try {
    const supabase = createClient()

    const logEntry: DataModificationLog = {
      table_name: 'processed_schedule_data',
      record_id: recordId,
      operation_type: operationType,
      old_values: oldValues,
      new_values: newValues,
    }

    const { error } = await supabase
      .from('data_modification_logs')
      .insert(logEntry)

    if (error) throw error

    console.log(`✅ Logged ${operationType} operation for record ${recordId}`)
    return { success: true }
  } catch (error) {
    console.error('Error logging data modification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Insert a new record into processed_schedule_data and log it
 */
export async function insertProcessedData(data: any): Promise<OperationResult> {
  try {
    const supabase = createClient()

    // Insert the record
    const { data: insertedData, error: insertError } = await supabase
      .from('processed_schedule_data')
      .insert(data)
      .select()
      .single()

    if (insertError) throw insertError

    // Log the insertion
    await logDataModification(
      insertedData.id,
      'INSERT',
      null,
      insertedData
    )

    console.log('✅ Successfully inserted record:', insertedData.id)
    return { success: true, data: insertedData }
  } catch (error) {
    console.error('Error inserting data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Update an existing record in processed_schedule_data and log it
 */
export async function updateProcessedData(
  recordId: string,
  updates: any
): Promise<OperationResult> {
  try {
    const supabase = createClient()

    // First, get the current record to save as old_values
    const { data: oldData, error: fetchError } = await supabase
      .from('processed_schedule_data')
      .select('*')
      .eq('id', recordId)
      .single()

    if (fetchError) throw fetchError

    // Update the record
    const { data: updatedData, error: updateError } = await supabase
      .from('processed_schedule_data')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', recordId)
      .select()
      .single()

    if (updateError) throw updateError

    // Log the update
    await logDataModification(
      recordId,
      'UPDATE',
      oldData,
      updatedData
    )

    console.log('✅ Successfully updated record:', recordId)
    return { success: true, data: updatedData }
  } catch (error) {
    console.error('Error updating data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Delete a record from processed_schedule_data and log it
 */
export async function deleteProcessedData(recordId: string): Promise<OperationResult> {
  try {
    const supabase = createClient()

    // First, get the current record to save as old_values
    const { data: oldData, error: fetchError } = await supabase
      .from('processed_schedule_data')
      .select('*')
      .eq('id', recordId)
      .single()

    if (fetchError) throw fetchError

    // Delete the record
    const { error: deleteError } = await supabase
      .from('processed_schedule_data')
      .delete()
      .eq('id', recordId)

    if (deleteError) throw deleteError

    // Log the deletion
    await logDataModification(
      recordId,
      'DELETE',
      oldData,
      null
    )

    console.log('✅ Successfully deleted record:', recordId)
    return { success: true }
  } catch (error) {
    console.error('Error deleting data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

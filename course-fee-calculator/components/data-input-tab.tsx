"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiSelectFilter } from "@/components/multi-select-filter"
import { MonthRangePicker } from "@/components/month-range-picker"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { extractRawScheduleData, processScheduleDataFromRaw, saveProcessedDataToSupabase, fetchProcessedDataFromSupabase, type StudentProfile, type CourseData } from "@/lib/data-processor"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload, Database, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, MessageSquare, Pencil, Trash2, Plus } from "lucide-react"
import { SMSGeneratorModal } from "@/components/sms-generator-modal"
import { AddRecordDialog } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"
import { deleteProcessedData } from "@/lib/data-operations"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DataInputTabProps {
  students: StudentProfile[]
  onDataProcessed: () => void
}

type SortField = 'date' | 'name' | 'parent' | 'hours' | 'fee_per_hour' | 'accompany_number'
type SortDirection = 'asc' | 'desc'

export function DataInputTab({ students, onDataProcessed }: DataInputTabProps) {
  const [inputData, setInputData] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingProcessedData, setIsLoadingProcessedData] = useState(false)
  const [processedData, setProcessedData] = useState<any[]>([])
  const [nameFilter, setNameFilter] = useState<string[]>([])
  const [parentFilter, setParentFilter] = useState<string[]>([])
  const [accompanyFilter, setAccompanyFilter] = useState<string[]>([])
  const [dateRangeFilter, setDateRangeFilter] = useState<{ startMonth: string, endMonth: string } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // SMS Generator state
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<string | null>(null)

  // Add/Edit/Delete state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingRecord, setDeletingRecord] = useState<any | null>(null)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field with default asc direction
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get sort icon for a field
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />
    }
    return sortDirection === 'asc' ?
      <ArrowUp className="h-4 w-4" /> :
      <ArrowDown className="h-4 w-4" />
  }

  // Get unique values for filters from processed data
  const uniqueNames = Array.from(new Set(processedData.map((s) => s.name).filter(Boolean)))
  const uniqueParents = Array.from(new Set(processedData.map((s) => s.parent).filter(Boolean)))
  const uniqueAccompanyNumbers = Array.from(
    new Set(processedData.map((s) => s.accompany_number?.toString()).filter(Boolean)),
  )
  const uniqueDates = Array.from(new Set(processedData.map((s) => s.date).filter(Boolean)))

  // Load processed data on component mount
  const loadProcessedData = async () => {
    setIsLoadingProcessedData(true)
    try {
      const result = await fetchProcessedDataFromSupabase()
      if (result.success) {
        setProcessedData(result.data)
      } else {
        const errorMessage = result.error || "Unknown error"
        toast({
          title: "Error",
          description: `Failed to load processed data: ${errorMessage}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading processed data:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast({
        title: "Error",
        description: `Failed to load processed data: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsLoadingProcessedData(false)
    }
  }

  // Filter processed data based on selected filters (multi-select)
  const filteredProcessedData = processedData
    .filter((item) => {
      const nameMatch = nameFilter.length === 0 || nameFilter.includes(item.name)
      const parentMatch = parentFilter.length === 0 || parentFilter.includes(item.parent)
      const accompanyMatch = accompanyFilter.length === 0 || accompanyFilter.includes(item.accompany_number?.toString())

      // Date range filter logic
      let dateMatch = true
      if (dateRangeFilter) {
        const itemDate = new Date(item.date)
        const itemMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`
        dateMatch = itemMonth >= dateRangeFilter.startMonth && itemMonth <= dateRangeFilter.endMonth
      }

      const result = nameMatch && parentMatch && accompanyMatch && dateMatch


      return result
    })
    .sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'parent':
          aValue = a.parent.toLowerCase()
          bValue = b.parent.toLowerCase()
          break
        case 'hours':
          aValue = a.hours
          bValue = b.hours
          break
        case 'fee_per_hour':
          aValue = a.fee_per_hour
          bValue = b.fee_per_hour
          break
        case 'accompany_number':
          aValue = a.accompany_number || 0
          bValue = b.accompany_number || 0
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

  // Load processed data on component mount
  useEffect(() => {
    loadProcessedData()
  }, [])


  // Calculate total fees and total hours
  const totalFees = filteredProcessedData.reduce((sum, item) => {
    return sum + (item.fee_per_hour * item.hours)
  }, 0)

  const totalHours = filteredProcessedData.reduce((sum, item) => {
    return sum + item.hours
  }, 0)

  // Check if filtered data has only one parent
  const uniqueParentsInFilteredData = React.useMemo(() => {
    return Array.from(new Set(filteredProcessedData.map(item => item.parent)))
  }, [filteredProcessedData])

  const canGenerateSMS = uniqueParentsInFilteredData.length === 1 && filteredProcessedData.length > 0

  // Format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString // Return original if invalid date
      }
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateString // Return original if error
    }
  }

  // Format amount to remove unnecessary decimal zeros
  const formatAmount = (amount: number) => {
    // Remove trailing zeros: 100.00 -> 100, 100.50 -> 100.5
    return parseFloat(amount.toFixed(2)).toString()
  }

  // Handle SMS Generator button click
  const handleSMSGenerator = () => {
    if (!canGenerateSMS) {
      toast({
        title: "Error",
        description: "SMS Generator is only available when all filtered data belongs to one parent",
        variant: "destructive",
      })
      return
    }

    setSelectedParent(uniqueParentsInFilteredData[0])
    setIsSMSModalOpen(true)
  }

  // Handle edit button click
  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setIsEditDialogOpen(true)
  }

  // Handle delete button click
  const handleDeleteClick = (record: any) => {
    setDeletingRecord(record)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingRecord) return

    try {
      const result = await deleteProcessedData(deletingRecord.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Record deleted successfully",
        })
        await loadProcessedData() // Reload data
      } else {
        throw new Error(result.error || "Failed to delete record")
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete record",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingRecord(null)
    }
  }

  const handleProcessData = async () => {
    if (!inputData.trim()) {
      toast({
        title: "Error",
        description: "Please enter schedule data to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Add detailed logging for debugging
      console.log("🚀 Starting data processing...")
      console.log("📱 User Agent:", navigator.userAgent)
      console.log("📊 Input data length:", inputData.length)
      console.log("🌐 Network status:", navigator.onLine ? "Online" : "Offline")

      // Check if we're on iPad
      const isIPad = /iPad/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      console.log("📱 Device type:", isIPad ? "iPad" : "Desktop/Other")

      // Additional iPad-specific checks
      if (isIPad) {
        console.log("📱 iPad detected - performing additional checks...")
        console.log("📱 Touch points:", navigator.maxTouchPoints)
        console.log("📱 Platform:", navigator.platform)
        console.log("📱 Connection type:", (navigator as any).connection?.effectiveType || "Unknown")
        console.log("📱 Connection downlink:", (navigator as any).connection?.downlink || "Unknown")

        // Check if we have a slow connection
        const connection = (navigator as any).connection
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
          console.warn("⚠️ Slow connection detected on iPad")
          toast({
            title: "Slow Connection",
            description: "Your connection appears to be slow. Processing may take longer.",
            variant: "default",
          })
        }
      }

      // Step 1: Extract raw data and save to schedule_data table
      console.log("📝 Step 1: Extracting raw data...")

      // Add timeout for iPad users (longer timeout for slower connections)
      const timeoutMs = isIPad ? 60000 : 30000 // 60s for iPad, 30s for desktop
      const extractResult = await Promise.race([
        extractRawScheduleData(inputData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs / 1000} seconds`)), timeoutMs)
        )
      ]) as any

      console.log("📝 Extract result:", extractResult)

      if (!extractResult.success) {
        console.error("❌ Extract failed:", extractResult.error)
        throw new Error(`Data extraction failed: ${extractResult.error}`)
      }

      // Step 2: Process raw data with intelligent matching and save to processed_schedule_data table
      console.log("🔄 Step 2: Processing data with intelligent matching...")

      const processResult = await Promise.race([
        processScheduleDataFromRaw(true), // Only process recent data
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Processing timed out after ${timeoutMs / 1000} seconds`)), timeoutMs)
        )
      ]) as any

      console.log("🔄 Process result:", processResult)

      if (processResult.success) {
        const extractMsg = (extractResult.inserted || 0) > 0 || (extractResult.updated || 0) > 0
          ? `Raw data: ${extractResult.inserted || 0} new, ${extractResult.updated || 0} updated`
          : `Raw data: ${extractResult.count || 0} total`
        const processMsg = (processResult.inserted || 0) > 0 || (processResult.updated || 0) > 0
          ? `Processed data: ${processResult.inserted || 0} new, ${processResult.updated || 0} updated`
          : `Processed data: ${processResult.count || 0} total`

        console.log("✅ Processing completed successfully!")
        console.log("📊 Results:", { extractMsg, processMsg })

        toast({
          title: "Success",
          description: `${extractMsg}, ${processMsg}`,
        })
        setInputData("")
        setIsDialogOpen(false) // Close dialog after successful processing
        await loadProcessedData() // Reload processed data
        onDataProcessed()
      } else {
        console.error("❌ Process failed:", processResult.error)
        throw new Error(`Data processing failed: ${processResult.error}`)
      }
    } catch (error) {
      console.error("💥 Error processing data:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)

      // Enhanced error message for iPad users
      const isIPad = /iPad/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

      let enhancedErrorMessage = errorMessage
      if (isIPad) {
        enhancedErrorMessage = `iPad Error: ${errorMessage}. Please check your internet connection and try again.`
      }

      toast({
        title: "Error",
        description: enhancedErrorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }


  return (
    <div className="h-full flex flex-col">
      {/* Processed Data Table - Now takes full width */}
      <div className="flex-1 flex flex-col min-h-0 space-y-2 pt-0">
        {/* Top row with buttons and filters */}
        <div className="flex items-center justify-between gap-2 flex-shrink-0 flex-wrap">
          {/* Left side - Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Add Record Button */}
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="default"
              className="min-w-[140px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 min-w-[180px]">
                  <Upload className="mr-2 h-4 w-4" />
                  Input Data
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[80vw] h-[80vh] max-w-[80vw] max-h-[80vh] overflow-y-auto !p-4 !w-[80vw] !h-[80vh] !max-w-[80vw] !max-h-[80vh] sm:!max-w-[80vw]">
                <DialogHeader>
                  <DialogTitle>Paste Data Area</DialogTitle>
                  <DialogDescription>
                    Enter your schedule data here to process student information
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col h-full space-y-4 -m-4 p-4">
                  <Textarea
                    placeholder="Paste your schedule data here..."
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    className="font-mono text-sm resize-none h-[60vh] overflow-y-auto"
                  />
                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      onClick={handleProcessData}
                      disabled={isProcessing || !inputData.trim()}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Data
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Process & Save Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* SMS Generator button */}
            <Button
              onClick={handleSMSGenerator}
              variant="outline"
              className="min-w-[160px]"
              disabled={!canGenerateSMS}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS Generator
            </Button>
          </div>

          {/* Right side - Refresh button and filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={loadProcessedData}
              disabled={isLoadingProcessedData}
              variant="outline"
              size="sm"
              className="w-10 h-9 p-0"
            >
              {isLoadingProcessedData ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>

            <div className="flex gap-2 flex-wrap">
              <MultiSelectFilter
                options={uniqueNames}
                selected={nameFilter}
                onSelectionChange={setNameFilter}
                placeholder="Name"
                width="w-[140px] md:w-[160px]"
              />

              <MultiSelectFilter
                options={uniqueParents}
                selected={parentFilter}
                onSelectionChange={setParentFilter}
                placeholder="Parent"
                width="w-[140px] md:w-[160px]"
              />

              <MultiSelectFilter
                options={uniqueAccompanyNumbers}
                selected={accompanyFilter}
                onSelectionChange={setAccompanyFilter}
                placeholder="Accompany"
                width="w-[120px] md:w-[140px]"
              />

              <MonthRangePicker
                value={dateRangeFilter}
                onChange={setDateRangeFilter}
                placeholder="选择月份范围"
                width="w-[180px] md:w-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col pt-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Fixed Header */}
          <div className="flex-shrink-0">
            <table className="material-table w-full text-xs table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-16" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-32" />
                <col className="w-24" />
                <col className="w-20" />
              </colgroup>
              <thead className="bg-background border-b border-border">
                <tr className="h-6">
                  <th className="px-2 py-1 text-left text-xs font-medium">#</th>
                  <th
                    className="px-2 py-1 text-left text-xs font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('parent')}
                  >
                    <span className="flex items-center gap-1">
                      Parent {getSortIcon('parent')}
                    </span>
                  </th>
                  <th
                    className="px-2 py-1 text-left text-xs font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <span className="flex items-center gap-1">
                      Name {getSortIcon('name')}
                    </span>
                  </th>
                  <th
                    className="px-2 py-1 text-left text-xs font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('date')}
                  >
                    <span className="flex items-center gap-1">
                      Date {getSortIcon('date')}
                    </span>
                  </th>
                  <th
                    className="px-2 py-1 text-left text-xs font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('hours')}
                  >
                    <span className="flex items-center gap-1">
                      Hours {getSortIcon('hours')}
                    </span>
                  </th>
                  <th
                    className="px-2 py-1 text-left text-xs font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('fee_per_hour')}
                  >
                    <span className="flex items-center gap-1">
                      Fee/Hour {getSortIcon('fee_per_hour')}
                    </span>
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium">Total</th>
                  <th
                    className="px-2 py-1 text-left text-xs font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('accompany_number')}
                  >
                    <span className="flex items-center gap-1">
                      Accompany {getSortIcon('accompany_number')}
                    </span>
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium">Title</th>
                  <th className="px-2 py-1 text-left text-xs font-medium">Created</th>
                  <th className="px-2 py-1 text-center text-xs font-medium">Actions</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Data Rows */}
          <div className="flex-1 min-h-0 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <table className="material-table w-full text-xs table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-16" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-32" />
                <col className="w-24" />
                <col className="w-20" />
              </colgroup>
              <tbody>
                {filteredProcessedData.map((item, index) => (
                  <tr key={item.id || index} className="h-6 hover:bg-muted/50">
                    <td className="px-2 py-1 text-center text-muted-foreground">{index + 1}</td>
                    <td className="px-2 py-1 truncate">{item.parent}</td>
                    <td className="px-2 py-1 truncate">{item.name}</td>
                    <td className="px-2 py-1 truncate">{formatDate(item.date)}</td>
                    <td className="px-2 py-1">{item.hours}</td>
                    <td className="px-2 py-1">${item.fee_per_hour}</td>
                    <td className="px-2 py-1">${formatAmount(item.fee_per_hour * item.hours)}</td>
                    <td className="px-2 py-1">
                      <Badge variant="outline" className="text-xs px-1 py-0">{item.accompany_number}</Badge>
                    </td>
                    <td className="px-2 py-1 truncate">{item.title}</td>
                    <td className="px-2 py-1 text-xs text-muted-foreground truncate">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0">
            <table className="material-table w-full text-xs table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-16" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-32" />
                <col className="w-24" />
                <col className="w-20" />
              </colgroup>
              <tbody>
                <tr className="h-8 bg-muted/30 border-t-2 border-primary/20 font-semibold">
                  <td className="px-2 py-1 text-center text-muted-foreground">
                    <span className="text-xs">Total</span>
                  </td>
                  <td className="px-2 py-1 text-muted-foreground">
                    <span className="text-xs">{filteredProcessedData.length} records</span>
                  </td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1 text-primary font-semibold">
                    {totalHours.toFixed(1)}h
                  </td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1 text-primary font-semibold">
                    ${formatAmount(totalFees)}
                  </td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SMS Generator Modal */}
      {selectedParent && (
        <SMSGeneratorModal
          isOpen={isSMSModalOpen}
          onClose={() => {
            setIsSMSModalOpen(false)
            setSelectedParent(null)
          }}
          parentName={selectedParent}
          filteredData={filteredProcessedData.filter(item => item.parent === selectedParent)}
        />
      )}

      {/* Add Record Dialog */}
      <AddRecordDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        students={students}
        onSuccess={loadProcessedData}
      />

      {/* Edit Record Dialog */}
      <EditRecordDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingRecord(null)
        }}
        record={editingRecord}
        onSuccess={loadProcessedData}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course record.
              {deletingRecord && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <div><strong>Student:</strong> {deletingRecord.name}</div>
                  <div><strong>Date:</strong> {formatDate(deletingRecord.date)}</div>
                  <div><strong>Hours:</strong> {deletingRecord.hours}h</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
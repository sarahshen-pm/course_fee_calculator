"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StudentProfile } from "@/lib/data-processor"
import { insertProcessedData } from "@/lib/data-operations"
import { toast } from "@/hooks/use-toast"

interface AddRecordDialogProps {
  isOpen: boolean
  onClose: () => void
  students: StudentProfile[]
  onSuccess: () => void
}

export function AddRecordDialog({ isOpen, onClose, students, onSuccess }: AddRecordDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [hours, setHours] = useState("")
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStudent(null)
      setDate(undefined)
      setStartTime("")
      setEndTime("")
      setHours("")
      setTitle("")
    }
  }, [isOpen])

  // Auto-calculate hours when start/end time changes
  useEffect(() => {
    if (startTime && endTime) {
      try {
        const [startHour, startMin] = startTime.split(":").map(Number)
        const [endHour, endMin] = endTime.split(":").map(Number)

        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin

        let diffMinutes = endMinutes - startMinutes
        if (diffMinutes < 0) diffMinutes += 24 * 60 // Handle overnight

        const calculatedHours = (diffMinutes / 60).toFixed(2)
        setHours(calculatedHours)
      } catch (error) {
        console.error("Error calculating hours:", error)
      }
    }
  }, [startTime, endTime])

  const handleStudentSelect = (studentName: string) => {
    const student = students.find(s => s.name === studentName)
    setSelectedStudent(student || null)
  }

  const handleSubmit = async () => {
    if (!selectedStudent || !date || !startTime || !endTime || !hours || !title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Construct startdate and enddate with time
      const startdate = new Date(date)
      const [startHour, startMin] = startTime.split(":").map(Number)
      startdate.setHours(startHour, startMin, 0)

      const enddate = new Date(date)
      const [endHour, endMin] = endTime.split(":").map(Number)
      enddate.setHours(endHour, endMin, 0)

      // Prepare data for insertion
      const dataToInsert = {
        title,
        startdate: startdate.toISOString(),
        enddate: enddate.toISOString(),
        duration: `${Math.floor(parseFloat(hours))}:${Math.floor((parseFloat(hours) % 1) * 60)}:00`,
        hours: parseFloat(hours),
        date: format(date, "yyyy-MM-dd"),
        name: selectedStudent.name,
        fee_per_hour: selectedStudent.fee_per_hour,
        graduated: selectedStudent.graduated,
        parent: selectedStudent.parent,
        accompany_number: selectedStudent.accompany_number,
      }

      const result = await insertProcessedData(dataToInsert)

      if (result.success) {
        toast({
          title: "Success",
          description: "Record added successfully",
        })
        onSuccess()
        onClose()
      } else {
        throw new Error(result.error || "Failed to add record")
      }
    } catch (error) {
      console.error("Error adding record:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add record",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>
            Add a new course record to the schedule
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Student Selection */}
          <div className="grid gap-2">
            <Label htmlFor="student">Student *</Label>
            <Select onValueChange={handleStudentSelect} value={selectedStudent?.name || ""}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.name} value={student.name}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show student info when selected */}
          {selectedStudent && (
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              <div>Parent: {selectedStudent.parent}</div>
              <div>Fee: ${selectedStudent.fee_per_hour}/hour</div>
              <div>Accompany: {selectedStudent.accompany_number}</div>
            </div>
          )}

          {/* Date */}
          <div className="grid gap-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Start Time */}
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* End Time */}
          <div className="grid gap-2">
            <Label htmlFor="endTime">End Time *</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {/* Hours (auto-calculated) */}
          <div className="grid gap-2">
            <Label htmlFor="hours">Hours *</Label>
            <Input
              id="hours"
              type="number"
              step="0.01"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Auto-calculated"
            />
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 上课 妍怡 Leanne P4 30min"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Record"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

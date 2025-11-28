"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateProcessedData } from "@/lib/data-operations"
import { toast } from "@/hooks/use-toast"

interface EditRecordDialogProps {
  isOpen: boolean
  onClose: () => void
  record: any | null
  onSuccess: () => void
}

export function EditRecordDialog({ isOpen, onClose, record, onSuccess }: EditRecordDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [hours, setHours] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form when dialog opens or record changes
  useEffect(() => {
    if (isOpen && record) {
      // Set date
      const recordDate = new Date(record.date)
      setDate(recordDate)

      // Extract time from startdate and enddate
      const startDateObj = new Date(record.startdate)
      const endDateObj = new Date(record.enddate)

      setStartTime(format(startDateObj, "HH:mm"))
      setEndTime(format(endDateObj, "HH:mm"))
      setHours(record.hours.toString())
    }
  }, [isOpen, record])

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

  const handleSubmit = async () => {
    if (!record || !date || !startTime || !endTime || !hours) {
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

      // Prepare updates (only date and time-related fields)
      const updates = {
        date: format(date, "yyyy-MM-dd"),
        startdate: startdate.toISOString(),
        enddate: enddate.toISOString(),
        hours: parseFloat(hours),
        duration: `${Math.floor(parseFloat(hours))}:${Math.floor((parseFloat(hours) % 1) * 60)}:00`,
      }

      const result = await updateProcessedData(record.id, updates)

      if (result.success) {
        toast({
          title: "Success",
          description: "Record updated successfully",
        })
        onSuccess()
        onClose()
      } else {
        throw new Error(result.error || "Failed to update record")
      }
    } catch (error) {
      console.error("Error updating record:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update record",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!record) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription>
            Edit date and hours for this course record
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Read-only student info */}
          <div className="text-sm bg-muted p-3 rounded space-y-1">
            <div><strong>Student:</strong> {record.name}</div>
            <div><strong>Parent:</strong> {record.parent}</div>
            <div><strong>Fee:</strong> ${record.fee_per_hour}/hour</div>
            <div><strong>Title:</strong> {record.title}</div>
          </div>

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

          {/* Hours (auto-calculated, but editable) */}
          <div className="grid gap-2">
            <Label htmlFor="hours">Hours *</Label>
            <Input
              id="hours"
              type="number"
              step="0.01"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
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
                Updating...
              </>
            ) : (
              "Update Record"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

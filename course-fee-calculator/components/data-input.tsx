"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { processScheduleData, type StudentProfile } from "@/lib/data-processor"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface DataInputProps {
  students: StudentProfile[]
  onDataProcessed: () => void
}

export function DataInput({ students, onDataProcessed }: DataInputProps) {
  const [rawData, setRawData] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawData.trim()) {
      toast({
        title: "Error",
        description: "Please enter schedule data",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    const supabase = createClient()

    try {
      // Process the raw data
      const processedData = processScheduleData(rawData)

      if (processedData.length === 0) {
        toast({
          title: "Warning",
          description: "No valid schedule data found",
          variant: "destructive",
        })
        return
      }

      // Clear existing data
      await supabase.from("schedule_data").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      // Insert new data
      const { error } = await supabase.from("schedule_data").insert(processedData)

      if (error) throw error

      toast({
        title: "Success",
        description: `Processed and saved ${processedData.length} records`,
      })

      setRawData("")
      onDataProcessed()
    } catch (error) {
      console.error("Error processing data:", error)
      toast({
        title: "Error",
        description: "Failed to process schedule data",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Schedule Data Input</CardTitle>
        <CardDescription>
          Paste your schedule data below. The system will automatically process and extract student information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-data">Schedule Data</Label>
            <Textarea
              id="schedule-data"
              placeholder="Title:Student Name Lesson Startdate:2025年8月31日 11:00 Enddate:31/08/25 12:30 Duration:1:30:00"
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process Schedule Data
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

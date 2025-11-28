"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataInputTab } from "@/components/data-input-tab"
import { StudentsView } from "@/components/students-view"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { StudentProfile } from "@/lib/data-processor"

export default function Home() {
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchStudents()
  }, [refreshTrigger])

  const fetchStudents = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("students").select("*").order("name")

      if (error) throw error

      setStudents(data || [])
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        title: "Error",
        description: "Failed to fetch student data",
        variant: "destructive",
      })
    }
  }

  const handleDataProcessed = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Tabs defaultValue="calculator" className="w-full h-full flex flex-col">
        <Card className="w-full h-full flex-1 flex flex-col min-h-0 rounded-none border-0">
          <CardHeader className="pb-0 pt-4 px-6 flex-shrink-0 flex flex-row items-center justify-between space-y-0">
            <h1 className="text-2xl font-bold">Course Fee Calculator</h1>
            <TabsList>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-4 pb-0 px-6 flex-1 min-h-0">
            <TabsContent value="calculator" className="h-full mt-0 data-[state=inactive]:hidden">
              <DataInputTab students={students} onDataProcessed={handleDataProcessed} />
            </TabsContent>
            <TabsContent value="students" className="h-full mt-0 data-[state=inactive]:hidden">
              <StudentsView />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      <Toaster />
    </div>
  )
}

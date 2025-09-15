"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Pencil, Save, X } from "lucide-react"

interface ScheduleRecord {
  id: string
  title: string
  startdate: string
  enddate: string
  duration: string
  hours: number
  date: string
  name: string
  fee: number
  graduated: string
  parent: string
  accompany_number: number
}

interface ParentSummary {
  parent: string
  records: ScheduleRecord[]
  totalHours: number
  averageFee: number
  totalFee: number
  dateRange: { start: string; end: string }
  students: string[]
}

interface SummaryDashboardProps {
  refreshTrigger: number
}

export function SummaryDashboard({ refreshTrigger }: SummaryDashboardProps) {
  const [data, setData] = useState<ScheduleRecord[]>([])
  const [parentSummaries, setParentSummaries] = useState<ParentSummary[]>([])
  const [nameFilter, setNameFilter] = useState("")
  const [accompanyFilter, setAccompanyFilter] = useState("")
  const [editingCell, setEditingCell] = useState<{ recordId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data: scheduleData, error } = await supabase
        .from("schedule_data")
        .select("*")
        .order("date", { ascending: true })

      if (error) throw error

      setData(scheduleData || [])
      generateParentSummaries(scheduleData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch schedule data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateParentSummaries = (scheduleData: ScheduleRecord[]) => {
    const parentGroups = scheduleData.reduce(
      (acc, record) => {
        if (!acc[record.parent]) {
          acc[record.parent] = []
        }
        acc[record.parent].push(record)
        return acc
      },
      {} as Record<string, ScheduleRecord[]>,
    )

    const summaries: ParentSummary[] = Object.entries(parentGroups).map(([parent, records]) => {
      const totalHours = records.reduce((sum, r) => sum + r.hours, 0)
      const totalFee = records.reduce((sum, r) => sum + r.hours * r.fee, 0)
      const averageFee = records.length > 0 ? records.reduce((sum, r) => sum + r.fee, 0) / records.length : 0

      const dates = records.map((r) => new Date(r.date)).sort((a, b) => a.getTime() - b.getTime())
      const dateRange = {
        start: dates[0]?.toISOString().split("T")[0] || "",
        end: dates[dates.length - 1]?.toISOString().split("T")[0] || "",
      }

      const students = [...new Set(records.flatMap((r) => r.name.split(", ")))]

      return {
        parent,
        records,
        totalHours,
        averageFee,
        totalFee,
        dateRange,
        students,
      }
    })

    setParentSummaries(summaries)
  }

  const filteredSummaries = parentSummaries
    .map((summary) => ({
      ...summary,
      records: summary.records.filter((record) => {
        const nameMatch = !nameFilter || record.name.toLowerCase().includes(nameFilter.toLowerCase())
        const accompanyMatch = !accompanyFilter || record.accompany_number.toString() === accompanyFilter
        return nameMatch && accompanyMatch
      }),
    }))
    .filter((summary) => summary.records.length > 0)

  const handleEdit = (recordId: string, field: string, currentValue: any) => {
    setEditingCell({ recordId, field })
    setEditValue(currentValue.toString())
  }

  const handleSave = async () => {
    if (!editingCell) return

    const supabase = createClient()
    const { recordId, field } = editingCell

    try {
      // Get current record for logging
      const currentRecord = data.find((r) => r.id === recordId)
      if (!currentRecord) return

      const oldValue = (currentRecord as any)[field]
      let newValue: any = editValue

      // Type conversion based on field
      if (field === "hours" || field === "fee") {
        newValue = Number.parseFloat(editValue)
      } else if (field === "accompany_number") {
        newValue = Number.parseInt(editValue)
      }

      // Update the record
      const { error } = await supabase
        .from("schedule_data")
        .update({ [field]: newValue })
        .eq("id", recordId)

      if (error) throw error

      // Log the modification
      await supabase.from("modification_logs").insert({
        table_name: "schedule_data",
        record_id: recordId,
        field_name: field,
        old_value: oldValue?.toString(),
        new_value: newValue?.toString(),
        modified_by: "User",
      })

      toast({
        title: "Success",
        description: "Record updated successfully",
      })

      setEditingCell(null)
      fetchData() // Refresh data
    } catch (error) {
      console.error("Error updating record:", error)
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name-filter">Filter by Name</Label>
              <Input
                id="name-filter"
                placeholder="Enter student name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accompany-filter">Filter by Accompany Number</Label>
              <Select value={accompanyFilter} onValueChange={setAccompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select accompany number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Tabs */}
      <Tabs defaultValue={filteredSummaries[0]?.parent || "all"} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {filteredSummaries.map((summary) => (
            <TabsTrigger key={summary.parent} value={summary.parent} className="text-sm">
              {summary.parent}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredSummaries.map((summary) => (
          <TabsContent key={summary.parent} value={summary.parent} className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{summary.totalHours.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-secondary">${summary.averageFee.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Average Fee/Hour</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent">${summary.totalFee.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Fee</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">{summary.dateRange.start}</div>
                  <div className="text-xs text-muted-foreground">to</div>
                  <div className="text-sm font-medium">{summary.dateRange.end}</div>
                </CardContent>
              </Card>
            </div>

            {/* Students */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {summary.students.map((student) => (
                    <Badge key={student} variant="outline">
                      {student}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Fee/Hour</TableHead>
                      <TableHead>Total Fee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {editingCell?.recordId === record.id && editingCell?.field === "name" ? (
                            <div className="flex items-center gap-2">
                              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="h-8" />
                              <Button size="sm" onClick={handleSave}>
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {record.name}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record.id, "name", record.name)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          {editingCell?.recordId === record.id && editingCell?.field === "hours" ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.1"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 w-20"
                              />
                              <Button size="sm" onClick={handleSave}>
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {record.hours.toFixed(1)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record.id, "hours", record.hours)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCell?.recordId === record.id && editingCell?.field === "fee" ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 w-20"
                              />
                              <Button size="sm" onClick={handleSave}>
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              ${record.fee.toFixed(2)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record.id, "fee", record.fee)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">${(record.hours * record.fee).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={record.accompany_number === 0 ? "default" : "secondary"}>
                            Accompany: {record.accompany_number}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

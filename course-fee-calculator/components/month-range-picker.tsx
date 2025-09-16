"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface MonthRange {
  startMonth: string // Format: "YYYY-MM"
  endMonth: string   // Format: "YYYY-MM"
}

interface MonthRangePickerProps {
  value: MonthRange | null
  onChange: (range: MonthRange | null) => void
  placeholder?: string
  className?: string
  width?: string
}

export function MonthRangePicker({
  value,
  onChange,
  placeholder = "选择月份范围",
  className,
  width = "w-[280px]"
}: MonthRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())
  const [selectedStart, setSelectedStart] = React.useState<string | null>(null)
  const [selectedEnd, setSelectedEnd] = React.useState<string | null>(null)

  // Initialize with default 6 months range
  React.useEffect(() => {
    if (!value) {
      const now = new Date()
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
      
      const startMonth = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}`
      const endMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      
      onChange({ startMonth, endMonth })
    }
  }, [value, onChange])

  // Update internal state when value changes
  React.useEffect(() => {
    if (value) {
      setSelectedStart(value.startMonth)
      setSelectedEnd(value.endMonth)
    }
  }, [value])

  const months = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ]

  const handleMonthClick = (year: number, month: number) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    
    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Start new selection
      setSelectedStart(monthStr)
      setSelectedEnd(null)
    } else if (selectedStart && !selectedEnd) {
      // Complete the range
      if (monthStr < selectedStart) {
        setSelectedEnd(selectedStart)
        setSelectedStart(monthStr)
      } else {
        setSelectedEnd(monthStr)
      }
    }
  }

  const handleApply = () => {
    if (selectedStart && selectedEnd) {
      onChange({ startMonth: selectedStart, endMonth: selectedEnd })
      setOpen(false)
    }
  }

  const handleClear = () => {
    setSelectedStart(null)
    setSelectedEnd(null)
    onChange(null)
    setOpen(false)
  }

  const isInRange = (year: number, month: number) => {
    if (!selectedStart || !selectedEnd) return false
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    return monthStr >= selectedStart && monthStr <= selectedEnd
  }

  const isSelected = (year: number, month: number) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    return monthStr === selectedStart || monthStr === selectedEnd
  }

  const isStart = (year: number, month: number) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    return monthStr === selectedStart
  }

  const isEnd = (year: number, month: number) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    return monthStr === selectedEnd
  }

  const displayText = value 
    ? `${value.startMonth} 至 ${value.endMonth}`
    : placeholder

  const renderYearPanel = (year: number, isLeft: boolean) => (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentYear(year - 1)}
          className="h-6 w-6 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">{year} 年</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentYear(year + 1)}
          className="h-6 w-6 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-1 p-3">
        {months.map((month, index) => {
          const inRange = isInRange(year, index)
          const selected = isSelected(year, index)
          const start = isStart(year, index)
          const end = isEnd(year, index)
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleMonthClick(year, index)}
              className={cn(
                "h-8 text-xs font-normal",
                selected && "bg-blue-600 text-white hover:bg-blue-700",
                inRange && !selected && "bg-blue-100 text-blue-900 hover:bg-blue-200",
                start && "rounded-l-md rounded-r-none",
                end && "rounded-r-md rounded-l-none",
                inRange && !start && !end && "rounded-none"
              )}
            >
              {month}
            </Button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-between h-9 text-sm font-normal",
              width,
              value && "border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            )}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="truncate">{displayText}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[600px]" align="start">
          <div className="flex">
            {renderYearPanel(currentYear, true)}
            <div className="w-px bg-border" />
            {renderYearPanel(currentYear + 1, false)}
          </div>
          <div className="flex items-center justify-between p-3 border-t">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              清除
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button 
                size="sm" 
                onClick={handleApply}
                disabled={!selectedStart || !selectedEnd}
              >
                确定
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

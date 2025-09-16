"use client"

import React, { useState, useMemo, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, MessageSquare, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { CourseData } from "@/lib/data-processor"

interface SMSGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  parentName: string
  filteredData: CourseData[]
}

type Language = "en" | "zh-cn" | "zh-tw"

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

// Stable input component to prevent focus loss
const StableInput = React.memo(({ 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  className = "",
  step = undefined
}: {
  value: string | number
  onChange: (value: string | number) => void
  type?: string
  placeholder?: string
  className?: string
  step?: string
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      onChange(parseFloat(e.target.value) || 0)
    } else {
      onChange(e.target.value)
    }
  }, [onChange, type])

  return (
    <Input
      type={type}
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      step={step}
    />
  )
})

const templates = {
  en: {
    single: `Hi [Parent], I hope this message finds you well 🌸.
Here is the [Name]'s tuition fee update for [Smallest Date] – [Largest Date]:
• Rate: SGD [Average Fee]/hour
• Total lesson hours: [Sum of Hours] hours

Calculation:
[Sum of Hours] hours ✖ SGD [Average Fee]/hour 
= SGD [Total Fee]

📑 For a detailed breakdown, please kindly refer to the attached table.

You may make payment via PayNow to:
📱 Number: 8876 9635
👤 Name: Tinakwa

When making the transfer, kindly include "[Name] + tuition month/year" in the remarks.

Thank you very much for your support 🌸`,

    multiple: `Hi [Parent], I hope this message finds you well 🌸.

[Name1] and [Name2]'s tuition fee is SGD [Average Fee]/hour.
For the period from [Smallest Date] to [Largest Date]:

• [Name1]'s Rate&hours: SGD [Average Fee]/hour, Total [Sum of Hours1] hours
• [Name2]'s Rate&hours: SGD [Average Fee]/hour, Total [Sum of Hours2] hours
• The total payable is: [Total Fee] SGD

📑 For a detailed breakdown, please kindly refer to the attached table.

You can make payment via PayNow to:
📱 Number: 8876 9635
👤 Name: Tinakwa

When transferring, kindly include [Name1] & [Name2] + tuition month/year in the remarks.

Thank you so much for your support 🌸`,
  },

  "zh-cn": {
    single: `[Parent] 你好，定期和你更新下[Name]的学费情况
在 [Smallest Date] – [Largest Date] 期间，[Name]的学费是：
• 费率：新币 [Average Fee]/小时
• 总课时：[Sum of Hours] 小时

计算：
[Sum of Hours] 小时 ✖ 新币 [Average Fee]/小时 
= 新币 [Total Fee]
📑 详细课程明细请参考附图表格。

您可以通过 PayNow 付款：
📱 号码：8876 9635
👤 姓名：Tinakwa

转账时，请在备注中包含"[Name] + 学费月份/年份"。

非常感谢您的支持 🌸`,

    multiple: `[Parent] 你好，定期和你更新下
[Name1] 和 [Name2] 的学费情况,在[Smallest Date] 到 [Largest Date] 期间：
• [Name1]费率：新币 [Average Fee]/小时, 上课小时数[Sum of Hours1]小时
• [Name2]费率：新币 [Average Fee]/小时, 上课小时数[Sum of Hours2]小时
• 应付总额：[Total Fee] 新币

📑 详细课程明细请参考附图表格。

您可以通过 PayNow 付款：
📱 号码：8876 9635
👤 姓名：Tinakwa

转账时，请在备注中包含 [Name1] 和 [Name2] + 学费月份/年份。

非常感谢您的支持 🌸`,
  },

  "zh-tw": {
    single: `[Parent] 你好，定期和你更新下[Name]的學費情況
在 [Smallest Date] – [Largest Date] 期間，[Name]的學費是：
• 費率：新幣 [Average Fee]/小時
• 總課時：[Sum of Hours] 小時

計算：
[Sum of Hours] 小時 ✖ 新幣 [Average Fee]/小時 
= 新幣 [Total Fee]
📑 詳細課程明細請參考附圖表格。

您可以通過 PayNow 付款：
📱 號碼：8876 9635
👤 姓名：Tinakwa

轉帳時，請在備註中包含「[Name] + 學費月份/年份」。

非常感謝您的支持 🌸`,

    multiple: `[Parent] 你好，定期和你更新下
[Name1] 和 [Name2] 的學費情況,在[Smallest Date] 到 [Largest Date] 期間：
• [Name1]費率：新幣 [Average Fee]/小時, 上課小時數[Sum of Hours1]小時
• [Name2]費率：新幣 [Average Fee]/小時, 上課小時數[Sum of Hours2]小時
• 應付總額：[Total Fee] 新幣

📑 詳細課程明細請參考附圖表格。

您可以通過 PayNow 付款：
📱 號碼：8876 9635
👤 姓名：Tinakwa

轉帳時，請在備註中包含 [Name1] 和 [Name2] + 學費月份/年份。

非常感謝您的支持 🌸`,
  },
}

interface EditableStudentData {
  id?: string
  name: string
  parent: string
  date: string
  hours: number
  fee_per_hour: number
  total: number
  accompany_number: number
  title: string
  created_at?: string
  isEditing?: boolean
}

export function SMSGeneratorModal({ isOpen, onClose, parentName, filteredData }: SMSGeneratorModalProps) {
  const [language, setLanguage] = useState<Language>("en")
  const [generatedSMS, setGeneratedSMS] = useState("")
  const [editableSMS, setEditableSMS] = useState("")
  const [isSMSEditing, setIsSMSEditing] = useState(false)
  const [editableData, setEditableData] = useState<EditableStudentData[]>([])
  const [selectedNameFilter, setSelectedNameFilter] = useState<string>("All")
  const [showRemarks, setShowRemarks] = useState(false)

  // Generate SMS function
  const generateSMS = useCallback((selectedLanguage: Language = language) => {
    if (editableData.length === 0) {
      setGeneratedSMS("")
      setEditableSMS("")
      return
    }

    const totalHours = editableData.reduce((sum, s) => sum + s.hours, 0)
    const totalFee = editableData.reduce((sum, s) => sum + s.total, 0)
    const avgFee = editableData.reduce((sum, s) => sum + s.fee_per_hour, 0) / editableData.length
    const students = editableData.map(s => s.name)
    const dates = editableData.map(s => s.date).sort()
    const formattedDates = dates.map(date => formatDate(date))
    
    // 根据实际学生数量决定模板类型
    const uniqueStudents = Array.from(new Set(students))
    const isMultiple = uniqueStudents.length > 1
    const template = templates[selectedLanguage][isMultiple ? "multiple" : "single"]

    let sms = template
      .replace(/\[Parent\]/g, parentName)
      .replace(/\[Average Fee\]/g, avgFee.toFixed(2))
      .replace(/\[Sum of Hours\]/g, totalHours.toFixed(1))
      .replace(/\[Total Fee\]/g, totalFee.toFixed(2))
      .replace(/\[Smallest Date\]/g, formattedDates[0] || "")
      .replace(/\[Largest Date\]/g, formattedDates[formattedDates.length - 1] || "")

    if (isMultiple && uniqueStudents.length >= 2) {
      // Multiple template: 替换学生姓名和各自的小时数
      const student1 = uniqueStudents[0]
      const student2 = uniqueStudents[1]
      const student1Hours = editableData.filter(s => s.name === student1).reduce((sum, s) => sum + s.hours, 0)
      const student2Hours = editableData.filter(s => s.name === student2).reduce((sum, s) => sum + s.hours, 0)
      
      sms = sms
        .replace(/\[Name1\]/g, student1)
        .replace(/\[Name2\]/g, student2)
        .replace(/\[Sum of Hours1\]/g, student1Hours.toFixed(1))
        .replace(/\[Sum of Hours2\]/g, student2Hours.toFixed(1))
    } else {
      // Single template: 替换单个学生姓名
      sms = sms.replace(/\[Name\]/g, uniqueStudents[0] || "")
    }

    setGeneratedSMS(sms)
    setEditableSMS(sms) // 同时更新可编辑的SMS内容
  }, [editableData, language, parentName])

  // Initialize editable data when modal opens - use raw detail data
  React.useEffect(() => {
    if (isOpen && filteredData.length > 0) {
      setEditableData(filteredData.map((item, index) => ({
        id: `temp-${index}`, // Generate temporary ID
        name: item.name,
        parent: item.parent,
        date: item.date,
        hours: item.hours,
        fee_per_hour: item.fee_per_hour,
        total: item.fee_per_hour * item.hours,
        accompany_number: item.accompany_number,
        title: item.title || '',
        created_at: new Date().toISOString(),
        isEditing: false // 现有数据默认不在编辑模式
      })))
    }
  }, [isOpen, filteredData])

  // Auto-generate SMS when language changes, modal opens, or editableData changes
  React.useEffect(() => {
    if (editableData.length > 0) {
      generateSMS()
    }
  }, [generateSMS, isOpen])

  // Get unique student names for filter
  const uniqueNames = React.useMemo(() => {
    const names = Array.from(new Set(editableData.map(item => item.name).filter(name => name.trim() !== '')))
    return names.sort()
  }, [editableData])

  // Filter and sort data based on selected name
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = editableData
    if (selectedNameFilter !== "All") {
      filtered = editableData.filter(item => item.name === selectedNameFilter)
    }
    
    return filtered.sort((a, b) => {
      // First sort by name
      const nameComparison = a.name.localeCompare(b.name)
      if (nameComparison !== 0) {
        return nameComparison
      }
      // If names are the same, sort by date
      return a.date.localeCompare(b.date)
    })
  }, [editableData, selectedNameFilter])

  // Create a stable update function that doesn't cause re-renders
  const updateEditableData = useCallback((index: number, field: keyof EditableStudentData, value: string | number) => {
    setEditableData(prev => {
      const newData = [...prev]
      if (newData[index]) {
        newData[index] = { ...newData[index], [field]: value }
        
        // Recalculate total when hours or fee_per_hour changes
        if (field === 'hours' || field === 'fee_per_hour') {
          newData[index].total = newData[index].hours * newData[index].fee_per_hour
        }
      }
      return newData
    })
  }, [])

  const addNewRow = useCallback(() => {
    const newRow: EditableStudentData = {
      name: '',
      parent: parentName,
      date: '',
      hours: 0,
      fee_per_hour: 0,
      total: 0,
      accompany_number: 0,
      title: '',
      isEditing: true // 新行默认进入编辑模式
    }
    setEditableData(prev => [...prev, newRow])
    // Update SMS after adding new row
    setTimeout(() => {
      generateSMS()
    }, 0)
  }, [parentName])

  const deleteRow = useCallback((index: number) => {
    setEditableData(prev => prev.filter((_, i) => i !== index))
    // Update SMS after deleting
    setTimeout(() => {
      generateSMS()
    }, 0)
  }, [])

  const toggleEditRow = useCallback((index: number) => {
    setEditableData(prev => {
      const newData = [...prev]
      newData[index] = { ...newData[index], isEditing: !newData[index].isEditing }
      return newData
    })
  }, [])

  const saveRow = useCallback((index: number) => {
    setEditableData(prev => {
      const newData = [...prev]
      newData[index] = { ...newData[index], isEditing: false }
      return newData
    })
    // Update SMS after saving
    setTimeout(() => {
      generateSMS()
    }, 0)
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(isSMSEditing ? editableSMS : generatedSMS)
      toast({
        title: "Success",
        description: "SMS copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy SMS",
        variant: "destructive",
      })
    }
  }

  const toggleSMSEdit = () => {
    setIsSMSEditing(!isSMSEditing)
    if (!isSMSEditing) {
      // 进入编辑模式时，将当前生成的SMS复制到可编辑状态
      setEditableSMS(generatedSMS)
    }
  }

  const resetSMS = () => {
    setEditableSMS(generatedSMS)
    setIsSMSEditing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh] overflow-hidden"
        style={{ width: '95vw', height: '95vh', maxWidth: '95vw', maxHeight: '95vh' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Generator - {parentName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-8 overflow-hidden" style={{ height: 'calc(95vh - 80px)', display: 'flex' }}>
          {/* Left side - Editable student data table */}
          <div className="flex flex-col min-h-0 border-r pr-4" style={{ flex: '2', minWidth: '0' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant={selectedNameFilter === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedNameFilter("All")}
                    className="h-7 px-3 text-xs"
                  >
                    All
                  </Button>
                  {uniqueNames.map((name) => (
                    <Button
                      key={name}
                      variant={selectedNameFilter === name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedNameFilter(name)}
                      className="h-7 px-3 text-xs"
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={showRemarks ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setShowRemarks(!showRemarks)}
                >
                  {showRemarks ? "Hide Remarks" : "Show Remarks"}
                </Button>
                <Button variant="outline" size="sm" onClick={addNewRow}>
                  Add Row
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-2 py-1 text-center text-xs font-medium w-12">#</th>
                    <th className="px-2 py-1 text-left text-xs font-medium w-24">Name</th>
                    <th className="px-2 py-1 text-left text-xs font-medium w-32 whitespace-nowrap">Date</th>
                    <th className="px-2 py-1 text-center text-xs font-medium w-16">Hours</th>
                    <th className="px-2 py-1 text-center text-xs font-medium w-20">Fee/Hour</th>
                    <th className="px-2 py-1 text-center text-xs font-medium w-20">Total</th>
                    {showRemarks && (
                      <th className="px-2 py-1 text-left text-xs font-medium w-48">Remarks</th>
                    )}
                    <th className="px-2 py-1 text-center text-xs font-medium w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((student, index) => {
                    // Find the original index in editableData
                    const originalIndex = editableData.findIndex(item => 
                      item.id === student.id || 
                      (item.name === student.name && item.date === student.date && item.hours === student.hours)
                    )
                    
                    return (
                    <tr key={student.id || `${student.name}-${student.date}-${student.hours}`} className="border-b hover:bg-muted/30 h-6">
                      <td className="px-2 py-1 text-center text-muted-foreground text-xs">
                        {index + 1}
                      </td>
                      <td className="px-2 py-1">
                        {student.isEditing ? (
                          <StableInput
                            value={student.name}
                            onChange={(value) => updateEditableData(originalIndex, 'name', value)}
                            className="h-6 text-xs px-2 py-1 w-full"
                          />
                        ) : (
                          <span className="text-xs">{student.name}</span>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        {student.isEditing ? (
                          <StableInput
                            value={student.date}
                            onChange={(value) => updateEditableData(originalIndex, 'date', value)}
                            className="h-6 text-xs px-2 py-1 w-full"
                          />
                        ) : (
                          <span className="text-xs whitespace-nowrap">{formatDate(student.date)}</span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {student.isEditing ? (
                          <StableInput
                            type="number"
                            step="0.1"
                            value={student.hours}
                            onChange={(value) => updateEditableData(originalIndex, 'hours', value)}
                            className="h-6 text-xs px-2 py-1 w-full"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-xs">{student.hours}</span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {student.isEditing ? (
                          <StableInput
                            type="number"
                            step="0.01"
                            value={student.fee_per_hour}
                            onChange={(value) => updateEditableData(originalIndex, 'fee_per_hour', value)}
                            className="h-6 text-xs px-2 py-1 w-full"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-xs">${student.fee_per_hour}</span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center font-medium text-primary text-xs">
                        ${student.total.toFixed(2)}
                      </td>
                      {showRemarks && (
                        <td className="px-2 py-1 text-left text-xs">
                          {student.isEditing ? (
                            <StableInput
                              value={student.title}
                              onChange={(value) => updateEditableData(originalIndex, 'title', value)}
                              className="h-6 text-xs px-2 py-1 w-full"
                            />
                          ) : (
                            <div className="text-xs truncate max-w-[180px]" title={student.title}>
                              {student.title}
                            </div>
                          )}
                        </td>
                      )}
                      <td className="px-2 py-1 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {student.isEditing ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => saveRow(originalIndex)}
                                className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteRow(originalIndex)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleEditRow(originalIndex)}
                                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteRow(originalIndex)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                  
                  {/* Summary row */}
                  <tr className="h-8 bg-muted/30 border-t-2 border-primary/20 font-semibold">
                    <td className="px-2 py-1 text-center text-muted-foreground">
                      <span className="text-xs">Total</span>
                    </td>
                    <td className="px-2 py-1 text-muted-foreground">
                      <span className="text-xs">{filteredAndSortedData.length} records</span>
                    </td>
                    <td className="px-2 py-1"></td>
                    <td className="px-2 py-1 text-primary font-semibold">
                      {filteredAndSortedData.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}h
                    </td>
                    <td className="px-2 py-1"></td>
                    <td className="px-2 py-1 text-primary font-semibold">
                      ${filteredAndSortedData.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                    </td>
                    <td className="px-2 py-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right side - SMS Generator */}
          <div className="flex flex-col min-h-0 pl-4" style={{ flex: '1', minWidth: '0' }}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">SMS Generator</h3>
            </div>
            
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              {/* Language selection and Edit buttons in one row */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge
                    variant={language === "en" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </Badge>
                  <Badge
                    variant={language === "zh-cn" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setLanguage("zh-cn")}
                  >
                    中文简体
                  </Badge>
                  <Badge
                    variant={language === "zh-tw" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setLanguage("zh-tw")}
                  >
                    中文繁體
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {generatedSMS && (
                    <>
                      <Button 
                        onClick={toggleSMSEdit} 
                        variant={isSMSEditing ? "default" : "outline"} 
                        size="sm"
                        className="h-8 px-3 text-xs"
                      >
                        {isSMSEditing ? "Save" : "Edit"}
                      </Button>
                      {isSMSEditing && (
                        <Button 
                          onClick={resetSMS} 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          Reset
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* SMS Content */}
              <div className="flex-1 flex flex-col min-h-0">
                
                <div className="bg-muted/30 rounded-lg p-6 flex-1 min-h-0 overflow-auto">
                  {generatedSMS ? (
                    isSMSEditing ? (
                      <Textarea
                        value={editableSMS}
                        onChange={(e) => setEditableSMS(e.target.value)}
                        className="w-full h-full min-h-[300px] text-sm leading-relaxed resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                        placeholder="Edit your SMS content here..."
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{editableSMS || generatedSMS}</div>
                    )
                  ) : (
                    <div className="text-sm text-muted-foreground italic">No data available</div>
                  )}
                </div>

                {generatedSMS && (
                  <Button onClick={copyToClipboard} variant="outline" className="w-full h-10">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

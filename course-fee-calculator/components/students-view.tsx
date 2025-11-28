"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react"
import type { StudentProfile } from "@/lib/data-processor"

export function StudentsView() {
    const [students, setStudents] = useState<StudentProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        parent: "",
        fee_per_hour: "",
        graduated: "Ongoing",
        accompany_number: "0",
        language: "English",
    })

    const supabase = createClient()

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .order("graduated", { ascending: false })
                .order("accompany_number", { ascending: true })
                .order("name", { ascending: true })

            if (error) throw error

            setStudents(data || [])
        } catch (error) {
            console.error("Error fetching students:", error)
            toast({
                title: "Error",
                description: "Failed to fetch student data",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setFormData({
            name: "",
            parent: "",
            fee_per_hour: "",
            graduated: "Ongoing",
            accompany_number: "0",
            language: "English",
        })
    }

    const openAddDialog = () => {
        resetForm()
        setIsAddDialogOpen(true)
    }

    const openEditDialog = (student: StudentProfile) => {
        setCurrentStudent(student)
        setFormData({
            name: student.name,
            parent: student.parent,
            fee_per_hour: student.fee_per_hour.toString(),
            graduated: student.graduated || "Ongoing",
            accompany_number: (student.accompany_number || 0).toString(),
            language: student.language || "English",
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (student: StudentProfile) => {
        setCurrentStudent(student)
        setIsDeleteDialogOpen(true)
    }

    const handleAddStudent = async () => {
        if (!formData.name || !formData.parent || !formData.fee_per_hour) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            const newStudent = {
                name: formData.name,
                parent: formData.parent,
                fee_per_hour: parseFloat(formData.fee_per_hour),
                graduated: formData.graduated,
                accompany_number: parseInt(formData.accompany_number) || 0,
                language: formData.language,
            }

            const { error } = await supabase.from("students").insert([newStudent])

            if (error) throw error

            toast({
                title: "Success",
                description: "Student added successfully",
            })
            setIsAddDialogOpen(false)
            fetchStudents()
        } catch (error) {
            console.error("Error adding student:", error)
            toast({
                title: "Error",
                description: "Failed to add student",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditStudent = async () => {
        if (!currentStudent) return
        if (!formData.name || !formData.parent || !formData.fee_per_hour) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            const updatedStudent = {
                name: formData.name,
                parent: formData.parent,
                fee_per_hour: parseFloat(formData.fee_per_hour),
                graduated: formData.graduated,
                accompany_number: parseInt(formData.accompany_number) || 0,
                language: formData.language,
            }

            const { error } = await supabase
                .from("students")
                .update(updatedStudent)
                .eq("id", currentStudent.id)

            if (error) throw error

            toast({
                title: "Success",
                description: "Student updated successfully",
            })
            setIsEditDialogOpen(false)
            fetchStudents()
        } catch (error) {
            console.error("Error updating student:", error)
            toast({
                title: "Error",
                description: "Failed to update student",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteStudent = async () => {
        if (!currentStudent) return

        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from("students")
                .delete()
                .eq("id", currentStudent.id)

            if (error) throw error

            toast({
                title: "Success",
                description: "Student deleted successfully",
            })
            setIsDeleteDialogOpen(false)
            fetchStudents()
        } catch (error) {
            console.error("Error deleting student:", error)
            toast({
                title: "Error",
                description: "Failed to delete student",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parent.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={openAddDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                </Button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col pt-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {/* Fixed Header */}
                <div className="flex-shrink-0">
                    <table className="material-table w-full text-xs table-fixed">
                        <colgroup>
                            <col className="w-32" />
                            <col className="w-32" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                        </colgroup>
                        <thead className="bg-background border-b border-border">
                            <tr className="h-6">
                                <th className="px-2 py-1 text-left text-xs font-medium">Name</th>
                                <th className="px-2 py-1 text-left text-xs font-medium">Parent</th>
                                <th className="px-2 py-1 text-left text-xs font-medium">Fee/Hour</th>
                                <th className="px-2 py-1 text-left text-xs font-medium">Status</th>
                                <th className="px-2 py-1 text-left text-xs font-medium">Accompany</th>
                                <th className="px-2 py-1 text-left text-xs font-medium">Language</th>
                                <th className="px-2 py-1 text-right text-xs font-medium">Actions</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                {/* Scrollable Data Rows */}
                <div className="flex-1 min-h-0 overflow-auto">
                    <table className="material-table w-full text-xs table-fixed">
                        <colgroup>
                            <col className="w-32" />
                            <col className="w-32" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                        </colgroup>
                        <tbody>
                            {isLoading ? (
                                <tr className="h-6">
                                    <td colSpan={7} className="px-2 py-1 text-center h-24">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr className="h-6">
                                    <td colSpan={7} className="px-2 py-1 text-center h-24">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="h-6 hover:bg-muted/50">
                                        <td className="px-2 py-1 truncate font-medium">{student.name}</td>
                                        <td className="px-2 py-1 truncate">{student.parent}</td>
                                        <td className="px-2 py-1">${student.fee_per_hour}</td>
                                        <td className="px-2 py-1">{student.graduated || "Ongoing"}</td>
                                        <td className="px-2 py-1">{student.accompany_number}</td>
                                        <td className="px-2 py-1">{student.language}</td>
                                        <td className="px-2 py-1 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5"
                                                    onClick={() => openEditDialog(student)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 text-destructive hover:text-destructive"
                                                    onClick={() => openDeleteDialog(student)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Student</DialogTitle>
                        <DialogDescription>
                            Add a new student to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="parent" className="text-right">
                                Parent
                            </Label>
                            <Input
                                id="parent"
                                name="parent"
                                value={formData.parent}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fee_per_hour" className="text-right">
                                Fee/Hour
                            </Label>
                            <Input
                                id="fee_per_hour"
                                name="fee_per_hour"
                                type="number"
                                value={formData.fee_per_hour}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="graduated" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={formData.graduated}
                                onValueChange={(value) => handleSelectChange("graduated", value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    <SelectItem value="Graduated">Graduated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="accompany_number" className="text-right">
                                Accompany
                            </Label>
                            <Input
                                id="accompany_number"
                                name="accompany_number"
                                type="number"
                                value={formData.accompany_number}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="language" className="text-right">
                                Language
                            </Label>
                            <Select
                                value={formData.language}
                                onValueChange={(value) => handleSelectChange("language", value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Chinese">Chinese</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddStudent} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Student
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Student Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                        <DialogDescription>
                            Update student information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-parent" className="text-right">
                                Parent
                            </Label>
                            <Input
                                id="edit-parent"
                                name="parent"
                                value={formData.parent}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-fee_per_hour" className="text-right">
                                Fee/Hour
                            </Label>
                            <Input
                                id="edit-fee_per_hour"
                                name="fee_per_hour"
                                type="number"
                                value={formData.fee_per_hour}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-graduated" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={formData.graduated}
                                onValueChange={(value) => handleSelectChange("graduated", value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    <SelectItem value="Graduated">Graduated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-accompany_number" className="text-right">
                                Accompany
                            </Label>
                            <Input
                                id="edit-accompany_number"
                                name="accompany_number"
                                type="number"
                                value={formData.accompany_number}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-language" className="text-right">
                                Language
                            </Label>
                            <Select
                                value={formData.language}
                                onValueChange={(value) => handleSelectChange("language", value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Chinese">Chinese</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditStudent} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Student</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {currentStudent?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteStudent} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

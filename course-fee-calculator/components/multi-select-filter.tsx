"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface MultiSelectFilterProps {
  options: string[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
  className?: string
  width?: string
}

export function MultiSelectFilter({
  options,
  selected,
  onSelectionChange,
  placeholder,
  className,
  width = "w-[200px]"
}: MultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    if (value === "all") {
      onSelectionChange([])
    } else if (selected.includes(value)) {
      onSelectionChange(selected.filter((item) => item !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onSelectionChange(selected.filter((item) => item !== value))
  }

  const clearAll = () => {
    onSelectionChange([])
  }


  const displayText = selected.length === 0 
    ? placeholder 
    : selected.length === 1 
      ? selected[0]
      : `${selected.length} selected`

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between h-9 text-sm font-normal",
              width,
              selected.length > 0 && "border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("p-0", width)} 
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    clearAll()
                    setOpen(false)
                  }}
                  className="text-blue-600 font-medium cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.length === 0 ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All {placeholder}
                </CommandItem>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

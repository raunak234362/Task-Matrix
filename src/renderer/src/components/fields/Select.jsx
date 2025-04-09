/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client"

import React, { useId, useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"

function Select({ options = [], label, name, className, onChange, placeholder, ...props }, ref) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const wrapperRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    setFilteredOptions(options)
  }, [options])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = options.filter(
      (option) => option && option.label.toLowerCase().includes(term)
    )
    setFilteredOptions(filtered)
  }

  const handleSelect = (option) => {
    setSelectedOption(option)
    setSearchTerm("")
    setIsOpen(false)
    if (onChange && typeof onChange === "function") {
      onChange(name, option.value)
    }
  }

  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) {
      return text
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 text-black">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        onClick={() => {
          setIsOpen(!isOpen)
          setTimeout(() => {
            searchRef.current?.focus()
          }, 100)
        }}
        className={`flex items-center justify-between p-2 text-sm border border-gray-400 rounded-md bg-white cursor-pointer ${
          isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"
        } ${className || ""}`}
      >
        <div className="flex-1">
          {isOpen ? (
            <div className="flex items-center">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-transparent outline-none"
                placeholder="Search..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
              {selectedOption ? selectedOption.label : label || placeholder || "Select an option"}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 text-sm bg-white border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(
              (option) =>
                option && (
                  <div
                    key={option.value}
                    className="px-4 py-1 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(option)}
                  >
                    {highlightMatch(option.label, searchTerm)}
                  </div>
                )
            )
          ) : (
            <div className="px-4 py-1 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.forwardRef(Select)
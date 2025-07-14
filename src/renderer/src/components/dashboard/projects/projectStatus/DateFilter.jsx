/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import { Calendar, Filter, ChevronDown } from "lucide-react"

const DateFilter = ({ dateFilter, setDateFilter }) => {
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i) // You can change range

    // Set default year if not present in dateFilter
    if (
        (dateFilter?.type === "month" ||
            dateFilter?.type === "year" ||
            dateFilter?.type === "range") &&
        (dateFilter.year === undefined || dateFilter.year === null)
    ) {
        setDateFilter({ ...dateFilter, year: currentYear })
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow border border-gray-200 z-50">
            <div className="flex items-center justify-between gap-5">
                <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Date Filter</h3>
                </div>
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                        <Filter size={12} />
                        {dateFilter?.type === "all"
                            ? "All Time"
                            : dateFilter?.type === "month"
                                ? `${months[dateFilter.month]} ${dateFilter.year}`
                                : dateFilter?.type === "week"
                                    ? `Week of ${new Date(dateFilter.weekStart).toLocaleDateString()}`
                                    : dateFilter?.type === "range"
                                        ? `${months[dateFilter.startMonth]} - ${months[dateFilter.endMonth]} ${dateFilter.year}`
                                        : dateFilter?.type === "dateRange"
                                            ? `${new Date(dateFilter.startDate).toLocaleDateString()} - ${new Date(dateFilter.endDate).toLocaleDateString()}`
                                            : `Year ${dateFilter.year}`}
                        <ChevronDown size={16} />
                    </button>

                    {showFilterDropdown && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-3">
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        value={dateFilter?.type}
                                        onChange={(e) => setDateFilter({ ...dateFilter, type: e.target.value })}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="week">By Week</option>
                                        <option value="month">By Month</option>
                                        <option value="year">By Year</option>
                                        <option value="range">Month Range</option>
                                        <option value="dateRange">Date Range</option> {/* 🔥 NEW */}
                                    </select>

                                </div>

                                {(dateFilter?.type === "month" || dateFilter?.type === "year" || dateFilter?.type === "range") && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            value={dateFilter.year}
                                            onChange={(e) => setDateFilter({ ...dateFilter, year: Number(e.target.value) })}
                                        >
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {dateFilter?.type === "week" && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Week Starting</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            value={dateFilter.weekStart ? new Date(dateFilter.weekStart).toISOString().split("T")[0] : ""}
                                            onChange={(e) => {
                                                const date = new Date(e.target.value)
                                                const dayOfWeek = date.getDay()
                                                const diff = date.getDate() - dayOfWeek
                                                const weekStart = new Date(date.setDate(diff))
                                                const weekEnd = new Date(weekStart)
                                                weekEnd.setDate(weekEnd.getDate() + 6)

                                                setDateFilter({
                                                    ...dateFilter,
                                                    weekStart: weekStart.getTime(),
                                                    weekEnd: weekEnd.getTime(),
                                                })
                                            }}
                                        />
                                    </div>
                                )}

                                {dateFilter?.type === "month" && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            value={dateFilter.month}
                                            onChange={(e) => setDateFilter({ ...dateFilter, month: Number(e.target.value) })}
                                        >
                                            {months.map((month, index) => (
                                                <option key={month} value={index}>{month}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {dateFilter?.type === "range" && (
                                    <>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Month</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={dateFilter.startMonth}
                                                onChange={(e) => setDateFilter({ ...dateFilter, startMonth: Number(e.target.value) })}
                                            >
                                                {months.map((month, index) => (
                                                    <option key={month} value={index}>{month}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Month</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={dateFilter.endMonth}
                                                onChange={(e) => setDateFilter({ ...dateFilter, endMonth: Number(e.target.value) })}
                                            >
                                                {months.map((month, index) => (
                                                    <option key={month} value={index}>{month}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                                {dateFilter?.type === "dateRange" && (
                                    <>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={dateFilter.startDate ? new Date(dateFilter.startDate).toISOString().split("T")[0] : ""}
                                                onChange={(e) =>
                                                    setDateFilter({ ...dateFilter, startDate: new Date(e.target.value).toISOString() })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={dateFilter.endDate ? new Date(dateFilter.endDate).toISOString().split("T")[0] : ""}
                                                onChange={(e) =>
                                                    setDateFilter({ ...dateFilter, endDate: new Date(e.target.value).toISOString() })
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DateFilter

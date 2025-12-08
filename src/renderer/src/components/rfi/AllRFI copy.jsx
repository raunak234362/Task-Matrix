/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import Service from "../../config/Service";
import GetRFI from "./GetRFI";
import { useSignals } from "@preact/signals-react/runtime";
import { rfiList, rfiLoading, rfiError, setRFIs } from "../../signals";

const AllRFI = ({ projectData }) => {
    useSignals();
    const [selectedRFI, setSelectedRFI] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const projectId = projectData?.id;

    const fetchRFIByProjectId = async () => {
        try {
            rfiLoading.value = true;
            const response = await Service.getRFIByProjectId(projectId);
            setRFIs(response.data || []);
            rfiError.value = null;
        } catch (error) {
            console.error("Error fetching RFIs:", error);
            setRFIs([]);
            rfiError.value = "Failed to fetch RFIs";
        } finally {
            rfiLoading.value = false;
        }
    };

    useEffect(() => {
        if (projectId) fetchRFIByProjectId();
    }, [projectId]);

    const data = useMemo(() => rfiList.value, [rfiList.value]);

    const columns = useMemo(
        () => [
            {
                Header: "S.No",
                accessor: (row, i) => i + 1,
                id: "sno",
            },
            {
                Header: "Subject",
                accessor: "subject",
            },
            {
                Header: "Date",
                accessor: "date",
                Cell: ({ value }) => new Date(value).toLocaleDateString(),
            },
            {
                Header: "Sender",
                accessor: (row) => row?.sender?.username || "-",
                id: "sender",
            },
            {
                Header: "Recepient",
                accessor: (row) => row?.recepients?.username || "-",
                id: "recepient",
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) =>
                    value ? (
                        <span className="text-red-600 font-semibold">Not Replied</span>
                    ) : (
                        <span className="text-green-500 font-semibold">Replied</span>
                    ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    const handleRowClick = useCallback((rfi) => {
        console.log("Clicked RFI:", rfi);
        setSelectedRFI(rfi);
        setIsModalOpen(true);
    }, []);
    const handleModalClose = useCallback(() => {
        setSelectedRFI(null);
        setIsModalOpen(false);
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All RFIs</h2>
            <div className="overflow-x-auto border rounded-md">
                <table {...getTableProps()} className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        {headerGroups.map((headerGroup, headerGroupIdx) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || headerGroupIdx}>
                                {headerGroup.headers.map((column, colIdx) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        key={column.id || colIdx}
                                        className="p-2 text-left border-b cursor-pointer"
                                    >
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? " 🔽"
                                                    : " 🔼"
                                                : ""}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.length > 0 ? (
                            rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        key={row.id || row.index}
                                        className="hover:bg-gray-100 cursor-pointer transition"
                                        onClick={() => handleRowClick(row.original)}
                                    >
                                        {row.cells.map((cell) => (
                                            <td {...cell.getCellProps()} key={cell.column.id} className="p-2 border-b">
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                                    No RFI data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedRFI && (
                <GetRFI rfiId={selectedRFI.id} isOpen={isModalOpen} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default AllRFI;

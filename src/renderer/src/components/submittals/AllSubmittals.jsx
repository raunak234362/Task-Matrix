/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import GetRFI from "./GetSubmittals";
import GetSubmittals from "./GetSubmittals";
import Service from "../../api/configAPI";

const AllSubmittals = ({ projectData }) => {
  const [submittalsData, setSubmittalsData] = useState([]);
  const [selectedSubmittal, setSelectedSubmittal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectId = projectData?.id;

  const fetchSubmittalsByProjectId = async () => {
    try {
      const response = await Service.getSubmittalByProjectId(projectId);
      console.log("Fetched Submittals:", response.data);
      setSubmittalsData(response.data || []);
    } catch (error) {
      console.error("Error fetching Submittals:", error);
      setSubmittalsData([]);
    }
  };

  useEffect(() => {
    if (projectId) fetchSubmittalsByProjectId();
  }, [projectId]);

  const data = useMemo(() => submittalsData, [submittalsData]);

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
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const handleRowClick = useCallback((submittal) => {
    console.log("Clicked Submittal:", submittal);
    setSelectedSubmittal(submittal);
    setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setSelectedSubmittal(null);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Submittals</h2>
      <div className="overflow-x-auto border rounded-md">
        <table {...getTableProps()} className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup, headerGroupIdx) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id || headerGroupIdx}
              >
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
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="p-2 border-b"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No Submittal data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedSubmittal && (
        <GetSubmittals
          submittalId={selectedSubmittal.id}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllSubmittals;

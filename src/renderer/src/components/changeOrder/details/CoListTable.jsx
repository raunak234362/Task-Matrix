/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";

const CoListTable = ({ selectedCO, fetchCO }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const data = useMemo(() => selectedCO?.CoRefersTo || [], [selectedCO]);

  // Set loading to false when data loads/changes
  useEffect(() => {
    setLoading(false);
  }, [selectedCO]); // or [data] if you prefer
  //To Edit and open the specific Element detail
  const handleElementView = useCallback((data) => {
    setSelectedElement(data);
  });

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      { Header: "Description", accessor: "description" },
      { Header: "Reference Document / Drawing", accessor: "referenceDoc" },
      { Header: "Element Name", accessor: "elements" },
      { Header: "Element Quantity", accessor: "QtyNo" },
      {
        Header: "Hours",
        accessor: "hours",
        Cell: ({ value }) =>
          value !== undefined && value !== null ? `${value} hrs` : "0 hrs",
      },
      {
        Header: "Element Cost",
        accessor: "cost",
        Cell: ({ value }) =>
          value !== undefined && value !== null ? `$ ${value}` : "$0",
      },
    ],
    [fetchCO]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const renderSkeletonRows = (count = 1) => {
    return Array.from({ length: count }).map((_, rowIdx) => (
      <tr key={rowIdx} className="animate-pulse">
        {columns.map((_, colIdx) => (
          <td key={colIdx} className="px-4 py-2 border">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="w-full p-4 rounded-lg bg-white/70">
      <div className="overflow-x-auto rounded-md border max-h-[80vh]">
        <table
          {...getTableProps()}
          className="min-w-[800px] w-full border-collapse text-sm text-center"
        >
          <thead className="sticky top-0 z-10 bg-teal-200">
            {headerGroups.map((headerGroup, headerGroupIdx) => (
              <tr
                key={headerGroup.id || headerGroupIdx}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, colIdx) => (
                  <th
                    key={column.id || colIdx}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 font-semibold border whitespace-nowrap"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              renderSkeletonRows(8)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  No Projects Found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id || row.index}
                    className="hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => handleElementView(row.original.id)}
                  >
                    {row.cells.map((cell) => (
                      <td
                        key={cell.column.id || cell.getCellProps().key}
                        {...cell.getCellProps()}
                        className="px-4 py-2 border"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoListTable;

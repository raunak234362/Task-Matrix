/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import EditLineItemModal from "./EditLineItemModal";

const LineItemTable = ({ items, onEdit, onDelete }) => {
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Enable edit only for certain user types
  const handleEditable = () => {
    const response = sessionStorage.getItem("userType");
    return response === "admin" || response === "estimator-head";
  };

  const openEditModal = (item) => {
    console.log("Opening edit modal for item:", item);
    setEditItem(item);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleSave = (id, updatedData) => {
    onEdit(id, updatedData);
  };

  const handleDelete = (item) => {
    onDelete(item);
  };

  // ✅ Add stable index (S.No.) to items
  const data = useMemo(() => {
    return (items || []).map((item, idx) => ({
      ...item,
      sno: idx + 1,
    }));
  }, [items]);

  // ✅ Define table columns
  const columns = useMemo(() => {
    const baseCols = [
      { Header: "#", accessor: "sno", disableSortBy: true }, // Fixed S.No.
      { Header: "Scope of Work", accessor: "scopeOfWork" },
      { Header: "Quantity", accessor: "quantity" },
      { Header: "Hours/Qty", accessor: "hoursPerQty" },
      { Header: "Total Hours", accessor: "totalHours" },
      { Header: "Remarks", accessor: "remarks" },
    ];

    if (handleEditable()) {
      baseCols.push({
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            onClick={() => openEditModal(row.original)}
            className="text-teal-700 hover:text-teal-900 font-medium"
          >
            Edit
          </button>
        ),
      });
    }

    return baseCols;
  }, []);

  // ✅ Table setup
  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // ✅ Simulate loading until items are ready
  useEffect(() => {
    if (items && items.length > 0) {
      setLoading(false);
    } else {
      setLoading(false); // still stop loader even if empty
    }
  }, [items]);

  if (!items || items.length === 0) {
    return <div className="text-gray-600">No Line Items Available</div>;
  }

  // ✅ Skeleton rows
  const renderSkeletonRows = (count = 8) => {
    return Array.from({ length: count }).map((_, rowIdx) => (
      <tr key={rowIdx} className="animate-pulse">
        {columns.map((col, colIdx) => (
          <td key={colIdx} className="px-4 py-2 border">
            {col.accessor !== "actions" ? (
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            ) : (
              <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="mt-6 h-[50vh] overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-teal-700 mb-3">Line Items</h2>
      </div>
      <div className="overflow-x-auto rounded-md border ">
        <table
          {...getTableProps()}
          className="min-w-[800px] w-full border-collapse text-sm text-left"
        >
          {/* Header */}
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
                    className="px-4 py-2 font-semibold border whitespace-nowrap cursor-pointer select-none"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody {...getTableBodyProps()}>
            {loading ? (
              renderSkeletonRows(8)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  No Line Items Found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id || row.index}
                    className="hover:bg-gray-50 transition"
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

      {/* Modal */}
      {editItem && (
        <EditLineItemModal
          item={editItem}
          isOpen={isModalOpen}
          onClose={closeEditModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default LineItemTable;

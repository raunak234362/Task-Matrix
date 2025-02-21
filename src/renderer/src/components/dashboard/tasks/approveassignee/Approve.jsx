/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Approve = ({
  task,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproved,
  setIsApproved,
}) => {
  if (!isOpen) return null;
  console.log("Approval task", task);

  useEffect(() => {
    setIsApproved(task?.approved);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="z-50 p-5 bg-white rounded-lg shadow-xl">
        <h1 className="flex items-center justify-center px-5 py-2 text-2xl font-bold text-black uppercase bg-slate-500">
          Approve Assign
        </h1>

        <div className="w-full p-5 rounded-lg shadow-xl bg-teal-100/50">
          <div className="mb-4 font-bold text-gray-800">People Assigned:</div>
          <div className="flex items-center">
            <table className="w-full text-center border-collapse table-auto rounded-xl">
              <thead className="sticky top-0 z-10 bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">Assigned By</th>
                  <th className="px-6 py-3 text-left">Assigned To</th>
                  <th className="px-6 py-3 text-left">Assigned On</th>
                  <th className="px-6 py-3 text-left">Approved By</th>
                  <th className="px-6 py-3 text-left">Approved On</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-600">
                <tr className="bg-gray-100 border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3 text-left">
                    {task?.users?.username}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.userss?.username}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {new Date(task?.assigned_on).toDateString()}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.user?.username ? (
                      <span>{task?.user?.username}</span>
                    ) : (
                      <span className="text-red-500">Yet Not Approved</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.approved_on ? (
                      new Date(task?.approved_on).toDateString()
                    ) : (
                      <span className="text-red-500">Yet Not Approved</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
            onClick={onApprove}
            style={{ cursor: isApproved ? "not-allowed" : "pointer" }}
            disabled={isApproved}
          >
            {isApproved ? "Approved" : "Approve"}
          </button>
          {/* <button
            className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
            onClick={onReject}
          >
            Reject
          </button> */}
          <button
            className="px-4 py-2 ml-4 text-white bg-gray-500 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Approve;

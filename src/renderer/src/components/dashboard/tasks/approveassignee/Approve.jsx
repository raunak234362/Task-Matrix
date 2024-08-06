import React from "react";

const Approve = ({ task, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen) return null;
  // console.log("Approval task", task);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 shadow-xl">
        <h1 className="text-2xl flex font-bold uppercase text-white bg-slate-500 px-5 py-2 justify-center items-center">
          Approve Assign
        </h1>

        <div className="shadow-xl rounded-lg w-full p-5 bg-gray-50">
          <div className="font-bold text-gray-800 mb-4">People Assigned:</div>
          <div className="flex items-center">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Assigned By</th>
                  <th className="py-3 px-6 text-left">Assigned To</th>
                  <th className="py-3 px-6 text-left">Assigned On</th>
                  <th className="py-3 px-6 text-left">Approved By</th>
                  <th className="py-3 px-6 text-left">Approved On</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-medium">
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">
                    {task?.assigned_by?.name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {task?.assigned_to?.name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(task?.assigned_on).toDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {task?.approved_by?.name || (
                      <span className="text-red-500">Yet Not Approved</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">
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
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={onApprove}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onReject}
          >
            Reject
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
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
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import Header from "../../Header";

const TaskRecord = () => {
  const [record, setRecord] = useState([]);

  // const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const taskRecord = await Service.taskRecord();
        setRecord(taskRecord);
        console.log(taskRecord);
      } catch (error) {
        console.error("Error fetching Task Record:", error);
      }
    };
    fetchUsers();
  }, []);

  function durToHour(params) {
    const [hours, minutes] = params.split(":");
    return `${hours}h ${minutes}m`;
  }

  function secToHour(params) {
    const hours = Math.floor(params / 3600);
    const minutes = Math.floor((params % 3600) / 60);

    return `${hours}h ${minutes}m`;
  }
  function compare(duration, time) {
    const durationInSeconds = convertToSeconds(duration);

    return durationInSeconds >= time;
  }

  function convertToSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(":");
    const totalSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    return totalSeconds;
  }

  return (
    <div>
      <Header title={"Task Record"}/>
      <div className="shadow-xl rounded-lg w-full p-5 bg-gray-50">
        <table className="mt-10 min-w-full divide-y  text-md divide-gray-200">
          <thead className="bg-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                S.no
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Time Alloted
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Time Taken
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Task Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-medium">
            {record?.map((rec, index) => (
              <tr key={rec?.id} className=" hover:bg-slate-200">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rec?.task?.project?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rec?.task?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {durToHour(rec?.task?.duration)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${compare(rec?.task?.duration, rec?.time_taken) ? "text-green-600" : "text-red-600"}`}>
                  {secToHour(rec?.time_taken)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rec?.task?.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskRecord;

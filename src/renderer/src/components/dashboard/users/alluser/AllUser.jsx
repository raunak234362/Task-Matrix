/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import Header from "../../Header";
import { useSelector } from "react-redux";

const AllUser = () => {

  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortField, setSortField] = useState("name"); // default sort field
  const [sortOrder, setSortOrder] = useState("asc"); // default sort order
  const [searchTerm, setSearchTerm] = useState("");

  const token = sessionStorage.getItem("token");
  const users = useSelector((state) => state?.userData?.staffData);
 console.log(users)

  useEffect(() => {
    let filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    filteredUsers.sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const roleOrder = ["Admin", "Manager", "Employee"];
        const roleA = a.is_superuser
          ? "Admin"
          : a.is_staff
            ? "Manager"
            : "Employee";
        const roleB = b.is_superuser
          ? "Admin"
          : b.is_staff
            ? "Manager"
            : "Employee";
        return sortOrder === "asc"
          ? roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB)
          : roleOrder.indexOf(roleB) - roleOrder.indexOf(roleA);
      }
    });

    setSortedUsers(filteredUsers);
  }, [users, sortField, sortOrder, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="px-5">
      <div className="my-4 w-full">
        <input
          type="text"
          placeholder="Search by name or username"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div className=" bg-white h-[55vh] py-3 overflow-auto rounded-lg">
        <table className="h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
          <thead>
            <tr className="bg-teal-200/70">
              <th className="px-2 py-1 cursor-pointer ">
                <button onClick={() => handleSortChange("name")}>
                  S.no{" "}
                  {sortField === "name"
                    ? sortOrder === "asc"
                      ? ""
                      : ""
                    : ""}
                </button>
              </th>
              <th className="px-2 py-1 cursor-pointer ">
                <button onClick={() => handleSortChange("name")}>
                  Name{" "}
                  {sortField === "name"
                    ? sortOrder === "asc"
                      ? ""
                      : ""
                    : ""}
                </button>
              </th>
              <th className="px-2 py-1">
                Email
              </th>
              <th className="px-2 py-1">
                Employee Username
              </th>
              <th className="px-2 py-1 cursor-pointer ">
                <button onClick={() => handleSortChange("role")}>
                  Role{" "}
                  {sortField === "role"
                    ? sortOrder === "asc"
                      ? ""
                      : ""
                    : ""}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="">
            {sortedUsers.map((user, index) => (
              <tr
                key={user.$id}
                className={index % 2 === 0 ? "hover:bg-blue-100 border":"bg-gray-100"}
              >
                <td className="border px-1 py-2">{index + 1}</td>
                <td className="border px-1 py-2">{user.name}</td>
                <td className="border px-1 py-2">{user.email}</td>
                <td className="border px-1 py-2">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`${
                      user.is_superuser
                        ? "bg-green-100 text-green-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-green-400"
                        : user.is_staff
                          ? "bg-blue-100 text-blue-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-blue-400"
                          : "bg-yellow-100 text-yellow-700 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-yellow-400"
                    }`}
                  >
                    {user.is_superuser
                      ? "Admin"
                      : user.is_staff
                        ? "Manager"
                        : user.is_active
                          ? "Employee"
                          : ""}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUser;

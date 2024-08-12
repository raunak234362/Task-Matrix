/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import Header from "../../Header";

const AllUser = () => {
const [users, setUsers] = useState([]);

const token = sessionStorage.getItem("token");

useEffect(() => {
const fetchUsers = async () => {
    try {
    const usersData = await Service.getAllUser(token);
    setUsers(usersData);
    } catch (error) {
    console.error("Error fetching users:", error);
    }
};
fetchUsers();
}, []);

return (
<div>
    <Header title={"All User"}/>
    <table className="mt-10 min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-200">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.no
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                </th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
                <tr key={user.$id} className=" hover:bg-slate-200">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`${user.is_superuser ? 'bg-green-100 text-green-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-green-400' : user.is_staff ? 'bg-blue-100 text-blue-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-blue-400' : 'bg-yellow-100 text-yellow-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-yellow-400'}`}>

                        {user.is_superuser ? "Admin" : user.is_staff ? "Manager" : user.is_active ? "Employee" : ""}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
);
};

export default AllUser;

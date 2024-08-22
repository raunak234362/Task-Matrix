/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import Header from "../../Header";

const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortField, setSortField] = useState('name'); // default sort field
    const [sortOrder, setSortOrder] = useState('asc'); // default sort order
    const [searchTerm, setSearchTerm] = useState('');

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await Service.getAllUser(token);
                setUsers(usersData);
                setSortedUsers(usersData); // initialize sortedUsers
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [token]);

    useEffect(() => {
        let filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredUsers.sort((a, b) => {
            if (sortField === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                const roleOrder = ['Admin', 'Manager', 'Employee'];
                const roleA = a.is_superuser ? 'Admin' : a.is_staff ? 'Manager' : 'Employee';
                const roleB = b.is_superuser ? 'Admin' : b.is_staff ? 'Manager' : 'Employee';
                return sortOrder === 'asc'
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
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <Header title={"All User"} />
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Search by name or username"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-300 rounded"
                />
            </div>
            <table className="mt-7 min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button onClick={() => handleSortChange('name')}>
                                S.no {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button onClick={() => handleSortChange('name')}>
                                Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button onClick={() => handleSortChange('role')}>
                                Role {sortField === 'role' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedUsers.map((user, index) => (
                        <tr key={user.$id} className="hover:bg-slate-200">
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

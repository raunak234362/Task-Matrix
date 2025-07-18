/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Service from "../../api/configAPI";
import Button from "../fields/Button";

const GroupDetail = ({ group, onClose }) => {
    console.log("Group in GroupDetail:", group);
    const userType = sessionStorage.getItem("userType");
    const {
        register,
        handleSubmit,
        control,
        watch,
        setError,
        getValues,
        formState: { errors },
    } = useForm();
    const groupId = group?.id;
    const [members, setMembers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isAddGroupMemberModalOpen, setIsAddGroupMemberModalOpen] = useState(false);
    const [memberOptions, setMemberOptions] = useState([]);
    const staffData = useSelector((state) => state?.userData?.staffData);
    const [loading, setLoading] = useState(false);
    const handleClose = async () => {
        onClose(true);
    };

    //For fetching the  staff data and setting it to the select options
    useEffect(() => {
        const options = staffData
            .map((staff) => {
                const label = `${staff?.f_name || ""} ${staff?.m_name || ""} ${staff?.l_name || ""}`.trim();
                return label ? { label, value: staff.id } : null;
            })
            .filter(Boolean)
            .sort((a, b) => a.label.localeCompare(b.label));
        setMemberOptions(options);
    }, [staffData]);


    const handleAddGroupMemberClick = (groupId) => {
        setSelectedGroup(groupId);
        setIsAddGroupMemberModalOpen(true);
    };

    const handleAddGroupMemberClose = () => {
        setIsAddGroupMemberModalOpen(false);
        setSelectedGroup(null);
    };

    const fetchGroupMembers = async (groupId) => {
        try {
            const response = await Service.getGroupMembers(groupId);
            setMembers(response.members);
            console.log("Group members:", response);
        } catch (error) {
            console.error("Error fetching group members:", error);
        }
    };

    useEffect(() => {
        if (groupId) {
            fetchGroupMembers(groupId);
        }
    }, [groupId]);

    const handleMembersSubmit = async (data) => {
        console.log("Adding members with data:", data);
        const memberIds = data?.members?.map((m) => m.value);
        if (!groupId || !memberIds?.length) return;

        try {
            setLoading(true);
            const response = await Service.addGroupMember(groupId, memberIds);
            console.log("Members added:", response);
            onClose(); // optionally close after adding
        } catch (error) {
            console.error("Failed to add members:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">

            <div className="bg-white h-fit p-5 md:p-5 rounded-lg shadow-lg w-11/12 md:w-3/12 ">
                <div className="flex flex-row justify-between">
                    {/* <Button onClick={handleEditClick}>Edit</Button> */}
                    <Button className="bg-red-500" onClick={handleClose}>
                        Close
                    </Button>
                </div>
                <div className="flex flex-col items-center mt-4">
                    <h2 className="text-xl font-semibold mb-4">{group?.name}</h2>
                    <p className="text-gray-600 mb-2">Created At: {new Date(group?.createdAt).toLocaleString()}</p>
                    <p className="text-gray-600 mb-2">Members:</p>
                    <ul className="list-disc list-inside">
                        {members?.map((member) => (
                            <li key={member.id} className="text-gray-600">{member.members?.f_name} {member.members?.m_name} {member.members?.l_name}</li>
                        ))}
                    </ul>
                </div>
                {userType === "admin" && (

                    <div>
                        <Button onClick={() => handleAddGroupMemberClick(groupId)}>
                            Add Group Member
                        </Button>
                    </div>
                )}
            </div>
            {isAddGroupMemberModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
                    <div className="bg-white h-[80vh] p-5 md:p-5 rounded-lg shadow-lg w-11/12 md:w-6/12 ">
                        <div className="flex flex-row justify-between">
                            {/* <Button onClick={handleEditClick}>Edit</Button> */}
                            <Button className="bg-red-500" onClick={handleAddGroupMemberClose}>
                                Close
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit(handleMembersSubmit)}>
                            <div>
                                <label className="block mb-1 font-medium text-sm text-gray-700">Select Members:</label>
                                <Controller
                                    name="members"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={memberOptions}
                                            isMulti
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            placeholder="Select Members"
                                        />
                                    )}
                                />
                            </div>
                            <Button type="submit" className="bg-green-500 text-white" disabled={loading}>
                                {loading ? "Saving..." : "Create"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GroupDetail

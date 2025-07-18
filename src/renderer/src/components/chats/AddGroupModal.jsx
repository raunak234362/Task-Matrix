/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Service from "../../api/configAPI";
import Button from "../fields/Button";
import Input from "../fields/Input";

const AddGroupModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [groupId, setGroupId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [memberOptions, setMemberOptions] = useState([]);

    const staffData = useSelector((state) => state?.userData?.staffData) || [];

    const {
        register,
        handleSubmit,
        control,
        watch,
        setError,
        getValues,
        formState: { errors },
    } = useForm();


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

    const handleGroupCreate = async (data) => {
        console.log("Creating group with data:", data);
        try {
            setLoading(true);
            const response = await Service.addGroup(data);
            setGroupId(response.id);
            setStep(2);
            console.log("Group created:", response);
        } catch (error) {
            console.error("Error creating group:", error);
            setError("name", { type: "manual", message: "Failed to create group" });
        } finally {
            setLoading(false);
        }
    };

    const handleMembersSubmit = async (data) => {
        console.log("Adding members with data:", data);
        const memberIds = data.members?.map((m) => m.value);
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
                <div className="flex items-center justify-between mb-4">

                    <h2 className="text-lg font-semibold">
                        {step === 1 ? "Create Group Name" : "Add Group Members"}
                    </h2>
                    <Button
                        className="bg-red-500 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        X
                    </Button>
                </div>


                {step === 1 && (
                    <form onSubmit={handleSubmit(handleGroupCreate)}>
                        <div>
                            <Input
                                label="Team Name:"
                                placeholder="Team Name"
                                size="lg"
                                color="blue"
                                {...register("name", { required: "This field is required" })}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <Button
                            type="submit"
                            className="bg-green-500 text-white"
                        >
                            {loading ? "Creating..." : "Next"}
                        </Button>
                    </form>
                )}

                {step === 2 && (
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
                )}


            </div>
        </div>
    );
};

export default AddGroupModal;

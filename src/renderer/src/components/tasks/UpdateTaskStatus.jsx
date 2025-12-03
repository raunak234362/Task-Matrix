/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Save } from "lucide-react";
import { toast } from "react-toastify";
import Service from "../../api/configAPI";
import { useDispatch } from "react-redux";
import { updateTask } from "../../store/taskSlice";

const UpdateTaskStatus = ({ task, onClose, onUpdateSuccess }) => {
    const [selectedStatus, setSelectedStatus] = useState(task?.status || "");
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    console.log(task);
    const TaskID = task?.id
    const statusOptions = [
        { label: "VALIDATE & COMPLETED", value: "VALIDATE_COMPLETE" },
        { label: "USER'S FAULT", value: "USER_FAULT" },
        { label: "COMPLETED(TECHNICAL ISSUE)", value: "COMPLETE_OTHER" },
        // Add other statuses as needed, or pass them as props
        { label: "IN PROGRESS", value: "IN_PROGRESS" },
        { label: "ON HOLD", value: "ONHOLD" },
        { label: "COMPLETED", value: "COMPLETED" },
        { label: "ASSIGNED", value: "ASSIGNED" },
        { label: "BREAK", value: "BREAK" },
        { label: "IN REVIEW", value: "IN_REVIEW" },
        { label: "RE-WORK", value: "REWORK" },
    ];

    const isCommentRequired = [
        "VALIDATE_COMPLETE",
        "USER_FAULT",
        "COMPLETE_OTHER",
    ].includes(selectedStatus);

    const minutesToHHMMSS = (minutes) => {
        const h = String(Math.floor(minutes / 60)).padStart(2, "0");
        const m = String(minutes % 60).padStart(2, "0");
        return `${h}:${m}:00`;
    };

    const hhmmssToMinutes = (str) => {
        if (!str) return 0;
        const [h, m] = str.split(":").map(Number);
        return h * 60 + m;
    };

    const onSubmit = async (data) => {
        try {
            // 1. Add Comment if present
            if (data.comment) {
                try {
                    await Service.addComment(TaskID, { comment: data.comment });
                } catch (commentError) {
                    console.error("Error adding comment:", commentError);
                    toast.error("Failed to add comment, but proceeding with status update.");
                }
            }

            // 2. Prepare Task Data for Update
            const takenHour = task?.workingHourTask?.[0]?.duration;
            const work_id = task?.workingHourTask?.[0]?.id;

            let taskData = {
                status: selectedStatus,
            };

            // if (selectedStatus === "VALIDATE_COMPLETE" && takenHour) {
            //     taskData.duration = minutesToHHMMSS(takenHour);
            // }

            if (selectedStatus === "COMPLETE_OTHER" && takenHour) {
                const durationInMinutes = hhmmssToMinutes(task?.duration);
                const updatedDuration = durationInMinutes;
                // taskData.workingHourTask = [{ duration: updatedDuration }]; // Not sending this in main payload as per request
                await Service.getEditWorkHoursById(
                    { duration: updatedDuration },
                    work_id,
                );
            }

            if (selectedStatus === "USER_FAULT" && takenHour) {
                const durationInMinutes = hhmmssToMinutes(task?.duration);
                const updatedDuration = durationInMinutes;
                // taskData.workingHourTask = [{ duration: updatedDuration }]; // Not sending this in main payload as per request
                await Service.getEditWorkHoursById(
                    { duration: updatedDuration },
                    work_id,
                );
            }

            if (selectedStatus === "REWORK") {
                taskData.reworkStartTime = new Date().toISOString();
            }

            // Call API to update task
            const updatedTask = await Service.editTask(TaskID, taskData);

            toast.success("Task status updated successfully");
            dispatch(updateTask(updatedTask)); // Update redux store

            if (onUpdateSuccess) onUpdateSuccess();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error?.message || "Failed to update task status");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Update Status</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isCommentRequired && (
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Comment <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    rows="3"
                                    placeholder="Reason for this status..."
                                    {...register("comment", { required: true })}
                                ></textarea>
                                {errors.comment && (
                                    <p className="mt-1 text-sm text-red-600">
                                        Comment is required for this status
                                    </p>
                                )}
                            </div>
                        )}
                        {/* Optional comment for other statuses */}
                        {!isCommentRequired && (
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Comment (Optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    rows="3"
                                    placeholder="Add a comment..."
                                    {...register("comment")}
                                ></textarea>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Update Status
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateTaskStatus;

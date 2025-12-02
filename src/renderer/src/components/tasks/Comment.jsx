/* eslint-disable react/prop-types */
import { MessagesSquare } from "lucide-react";
import { useForm } from "react-hook-form";

const Comment = ({ comments, onAddComment, staffData }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        onAddComment(data);
        reset();
    };

    return (
        <div className="space-y-6">
            {/* Add Comment Form */}
            <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Add Comment
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            rows="3"
                            placeholder="Write your comment here..."
                            {...register("comment", { required: true })}
                        ></textarea>
                        {errors.comment && (
                            <p className="mt-1 text-sm text-red-600">Comment is required</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-cyan-600 rounded-lg hover:bg-cyan-700"
                    >
                        <MessagesSquare className="w-4 h-4 mr-2" />
                        Add Comment
                    </button>
                </form>
            </div>

            {/* Comments List */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Comments</h3>

                {comments?.length > 0 ? (
                    <div className="space-y-4">
                        {comments?.map((comment, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-cyan-600">
                                            {staffData?.find((staff) => staff?.id === comment?.user_id)
                                                ?.f_name?.charAt(0) || "U"}
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {staffData?.find((staff) => staff?.id === comment?.user_id)
                                                ?.f_name || "Unknown User"}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(comment?.created_on).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className="pl-10 text-gray-700 whitespace-pre-line">
                                    {comment?.data}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl">
                        <MessagesSquare className="w-12 h-12 mb-3 text-gray-400" />
                        <h4 className="text-lg font-medium text-gray-800">
                            No comments yet
                        </h4>
                        <p className="text-gray-500">
                            Be the first to add a comment to this task.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;

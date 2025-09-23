/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import Input from "../../fields/Input";
import Service from "../../../api/configAPI";
import Button from "../../fields/Button";

const AddLineItemGroup = ({ estimationId, onClose,onSubmit }) => {
  const { register, handleSubmit, control, setValue, watch, reset } = useForm();
  console.log(estimationId);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[30%] overflow-y-auto md:p-5 rounded-lg shadow-lg w-full md:w-6/12 ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Add Line Item Group</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-2">
            <Input
              label="Group Name"
              placeholder="Building name/Scope of Work"
              {...register("name", { required: "Group Name is required" })}
            />
          </div>
          <div className="my-2">
            <Input label="Group Description" {...register("description")} />
          </div>
          <div className="my-2">
            <Button type="submit">Add Line Item Group</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLineItemGroup;

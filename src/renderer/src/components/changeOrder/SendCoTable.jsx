/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input, Button } from "../index";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import Service from "../../api/configAPI";

const SendCoTable = ({ data, fetchCO }) => {

  const id = data?.id;
  console.log(data);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rows: [
        {
          changeDescription: "",
          reference: "",
          element: "",
          qty: "",
          hours: "",
          cost: "",
          remarks: "",
        },
      ],
    },
  });
  // Add new row to table
  const addRow = () => {
    append({
      changeDescription: "",
      reference: "",
      element: "",
      qty: "",
      hours: "",
      cost: "",
      remarks: "",
    });
  };
  const { fields, append } = useFieldArray({
    control,
    name: "rows",
  });
  const [coRow, setCoRow] = useState([]);
  const onSubmit = async (coData) => {
    const rows = coData.rows?.map((job) => ({
      ...job,
      description: job.changeDescription,
      referenceDoc: job.reference,
      elements: job.element,
      QtyNo: Number(job.qty),
      hours: Number(job.hours),
      cost: Number(job.cost),
      remarks: job.remarks,
    }));
    console.log("Step 2 data:", rows);
    try {
      const response = await Service.addCOTable(rows, id);
      toast.success("CO created successfully");
      console.log("Row added:", response);
      console.log("CO created successfully!");
      fetchCO();
    } catch (error) {
      toast.error("Error creating CO");
      console.error("Error creating CO:", error);
    }
    reset();
  };

  const rows = watch("rows") || [];
  const [totalHours, setTotalHours] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  useEffect(() => {
    const hoursSum = rows.reduce(
      (sum, row) => sum + (parseFloat(row.hours) || 0),
      0
    );
    const costSum = rows.reduce(
      (sum, row) => sum + (parseFloat(row.cost) || 0),
      0
    );
    setTotalHours(hoursSum);
    setTotalCost(costSum);
  }, [rows]);

  return (
    <>
      {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white h-[80%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
          <div className="flex flex-row justify-between">
            <Button className="bg-red-500" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </div> */}
      <div className="p-6 bg-white rounded-lg shadow-md ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tabular Data Section */}
          <div className="px-2 py-2 mb-4 font-bold text-white rounded-lg bg-teal-500/50">
            Tabular Data:
          </div>

          {/* Make the table scrollable */}
          <div className="w-full my-4 overflow-x-auto overflow-y-auto max-h-96">
            <table className="w-full text-xs text-center border border-collapse border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-1 py-1 border border-gray-300">Sl.No</th>
                  <th className="px-2 py-1 border border-gray-300">
                    Description of Changes
                  </th>
                  <th className="px-2 py-1 border border-gray-300">
                    Reference Drawings/Documents
                  </th>
                  <th className="px-2 py-1 border border-gray-300">
                    Elements Name
                  </th>
                  <th className="px-2 py-1 border border-gray-300">
                    Element Qty
                  </th>
                  <th className="px-2 py-1 border border-gray-300">Hours</th>
                  <th className="px-2 py-1 border border-gray-300">Cost ($)</th>
                  <th className="px-2 py-1 border border-gray-300">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-2 py-1 border border-gray-300">
                      {/* {setValue(index + 1)} */}
                      {index + 1}
                    </td>

                    <td className="px-2 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.changeDescription`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="textarea"
                            placeholder="Change Description"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(
                                `rows.${index}.changeDescription`,
                                e.target.value
                              );
                            }}
                          />
                        )}
                      />
                    </td>

                    <td className="px-1 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.reference`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="Reference"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(
                                `rows.${index}.reference`,
                                e.target.value
                              );
                            }}
                          />
                        )}
                      />
                    </td>

                    <td className="px-1 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.element`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="Element Name"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(`rows.${index}.element`, e.target.value);
                            }}
                          />
                        )}
                      />
                    </td>

                    <td className="px-1 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.qty`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="Qty"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(`rows.${index}.qty`, e.target.value);
                            }}
                          />
                        )}
                      />
                    </td>

                    <td className="px-1 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.hours`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="Hours"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(`rows.${index}.hours`, e.target.value);
                            }}
                          />
                        )}
                      />
                    </td>

                    <td className="px-1 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.cost`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="Cost"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(`rows.${index}.cost`, e.target.value);
                            }}
                          />
                        )}
                      />
                    </td>

                    <td className="px-1 py-1 border border-gray-600">
                      <Controller
                        name={`rows.${index}.remarks`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="textarea"
                            placeholder="Remarks"
                            size="xs"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue(`rows.${index}.remarks`, e.target.value);
                            }}
                          />
                        )}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td
                    colSpan="5"
                    className="px-2 py-1 font-bold text-right border border-gray-300"
                  >
                    Total
                  </td>
                  <td className="px-2 py-1 font-bold border border-gray-300">
                    {totalHours}
                  </td>
                  <td className="px-2 py-1 font-bold border border-gray-300">
                    ${totalCost}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <Button
            onClick={addRow}
            className="mb-6 text-white bg-blue-500"
            type="button"
          >
            Add Row
          </Button>

          <div className="text-center">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SendCoTable;

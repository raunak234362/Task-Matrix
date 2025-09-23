/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import Button from "../../fields/Button";
import AddLineItemGroup from "./AddLineItemGroup";
import Service from "../../../api/configAPI";
import LineItemTable from "./LineItemTable";
import {
  lineItemGroupsSignal,
  expandedLineItemGroupSignal,
} from "../../../signals";
import toast from "react-hot-toast";

const LineItem = ({ estimationId }) => {
  useSignals();
  const [addLineItemGroup, setAddLineItemGroup] = useState(false);

  // fetch Line item groups
  const fetchLineItemGroup = async () => {
    try {
      const response = await Service.getEstimationLineItemGroup(estimationId);
      console.log("Fetched Groups:", response);
      lineItemGroupsSignal.value = Array.isArray(response) ? response : [];
    } catch (error) {
      console.log("Error fetching groups:", error);
    }
  };

  //delete line item group
  const deleteLineItemGroup = async (lineItemID) => {
    try {
      const response =
        await Service.deleteEstimationTaskLineItemsById(lineItemID);
      console.log("Line Item Group Deleted:", response);
      toast.success("Line Item Group Deleted Successfully!");
    } catch (error) {
      console.log("Error deleting line item group:", error);
    }
  };

  useEffect(() => {
    if (estimationId) fetchLineItemGroup();
  }, [estimationId]);

  // for adding line item group
  const onSubmit = async (data) => {
    try {
      const response = await Service.addEstimationLineItemGroup(
        estimationId,
        data,
      );
      console.log("Group Added:", response);
      toast.success("Line Item Group Added Successfully!");
      await fetchLineItemGroup(); // refresh groups
    } catch (error) {
      console.log("Error adding group:", error);
    }
  };

  // toggle group expand/collapse
  const toggleGroup = (groupId) => {
    expandedLineItemGroupSignal.value =
      expandedLineItemGroupSignal.value === groupId ? null : groupId;
  };

  const groups = lineItemGroupsSignal.value || [];
  const expandedGroupId = expandedLineItemGroupSignal.value;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-teal-800">Line Item Groups</h2>
        <Button onClick={() => setAddLineItemGroup(true)}>
          Add Line Item Group
        </Button>
      </div>

      {addLineItemGroup && (
        <AddLineItemGroup
          estimationId={estimationId}
          onClose={() => setAddLineItemGroup(false)}
          onSubmit={onSubmit}
        />
      )}

      <div className="space-y-3">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className="border rounded-md">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full text-left px-4 py-2 bg-teal-100 hover:bg-teal-200 font-semibold flex justify-between items-center"
              >
                <span>{group.name}</span>
                <span className="text-sm text-gray-600">
                  {expandedGroupId === group.id ? "▲ Hide" : "▼ Show"}
                </span>
              </button>

              {expandedGroupId === group.id && (
                <div className="p-4">
                  {group.description && (
                    <p className="text-gray-600 mb-2">{group.description}</p>
                  )}
                  <LineItemTable
                    items={group.lineItems}
                    onDelete={deleteLineItemGroup}
                    onEdit={(id, updatedData) => {
                      // Update the corresponding line item within the groups signal
                      const currentGroups = lineItemGroupsSignal.value || [];
                      lineItemGroupsSignal.value = currentGroups.map((g) => ({
                        ...g,
                        lineItems: (g.lineItems || []).map((li) =>
                          li.id === id ? { ...li, ...updatedData } : li,
                        ),
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No Line Item Groups available.</p>
        )}
      </div>
    </div>
  );
};

export default LineItem;

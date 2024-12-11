/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Header, Input } from "../../../index";
import { useForm } from "react-hook-form";
import Service from "../../../../api/configAPI";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";

const ManageFabricator = ({ fabricator, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [newInput, setNewInput] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
  });
  const fabricatorDetail= useSelector((state) => state?.fabricatorData.fabricatorData || [])
  const [fabricatorData,setFabricatorData]=useState();
  const [addNew, setAddNew] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    const fabricatorData = fabricatorDetail.find((item) => item.id === fabricator);
    if (fabricatorData) {
      setFabricatorData(fabricatorData);
    }
  }, []);

  function handleAddNewContact() {
    setAddNew((prev) => !prev);
  }

  function handleDeleteFabricator(id) {
    Service.deleteFabricator(id)
      .then(() => {
        // alert('Task Deleted Successfully')
        setIsAlert(true);
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting fabricator:", error);
        alert("Failed to delete fabricator. Please try again.");
      });
  }

  const openModal = () => {
    setIsAlert(true);
  };

  const closeModal = () => {
    setIsAlert(false);
  };

  const handleAddContact = () => {
    setAddNew((prev) => !prev);
    fabricator?.connections?.push(newInput);
    const data = Service.addConnection(fabricator, newInput);
    setNewInput({
      name: "",
      designation: "",
      phone: "",
      email: "",
    });
  };

  const [contractName, setContractName] = useState("");
  const [contract, setContractFile] = useState(null);

  const handleContractChange = (e) => {
    const file = e.target.files[0];
    setContractName(file?.name);
    setContractFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Fabricator Details
          </h2>
          <button
            className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <div>
              <strong>Fabricator Name:</strong> {fabricatorData?.name}
            </div>
            <div>
              <strong>Country:</strong> {fabricatorData?.country}
            </div>
            <div>
              <strong>State:</strong> {fabricatorData?.state}
            </div>
            <div>
              <strong>City:</strong> {fabricatorData?.city}
            </div>
            <div>
              <strong>Zipcode:</strong> {fabricatorData?.zipCode}
            </div>
            <div>
              <strong>Shop Design:</strong>
              <Link
                to={fabricatorData?.design}
                className="text-blue-700"
                target="_blank"
              >
                {" "}
                Open File
              </Link>
            </div>
          </div>
          {userType === "admin" && (
            <div>
              <Button onClick={openModal}>Delete</Button>
              {isAlert && (
                <Dialog open={isAlert} handler={setIsAlert}>
                  <DialogHeader>Confirm Deletion</DialogHeader>
                  <DialogBody divider>
                    Are you sure you want to delete this item? This action
                    cannot be undone.
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      variant="text"
                      color="gray"
                      onClick={closeModal}
                      className="mr-2"
                    >
                      No
                    </Button>
                    <Button
                      variant="gradient"
                      color="red"
                      onClick={() => handleDeleteFabricator(fabricator?.id)}
                    >
                      Yes, Delete
                    </Button>
                  </DialogFooter>
                </Dialog>
              )}
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="text-xl font-bold">Contact Details</div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.no
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fabricator?.connections?.map((connection, index) => (
                <tr key={index}>
                  <td className="px-2 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.name}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.designation}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.phone}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.email}
                  </td>
                </tr>
              ))}
              {addNew && (
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {fabricator?.connections?.length + 1}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Name"
                      value={newInput.name}
                      required={true}
                      onChange={(e) => {
                        setNewInput({ ...newInput, name: e.target.value });
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Designation"
                      value={newInput.designation}
                      required={true}
                      onChange={(e) => {
                        setNewInput({
                          ...newInput,
                          designation: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Phone Number"
                      value={newInput.phone}
                      required={true}
                      onChange={(e) => {
                        setNewInput({ ...newInput, phone: e.target.value });
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Email"
                      value={newInput.email}
                      required={true}
                      onChange={(e) => {
                        setNewInput({ ...newInput, email: e.target.value });
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Button onClick={addNew ? handleAddContact : handleAddNewContact}>
            {addNew ? "Save" : "New"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageFabricator;

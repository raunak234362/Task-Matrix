/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from "react";
import { Button, Header, Input } from "../../../index";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setFabricatorData } from '../../../../store/fabricatorSlice';
import Service from "../../../../api/configAPI";

const AddFabricator = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [contractName, setContractName] = useState(""); 
  const [contract, setContractFile] = useState(null); 

  const handleContractChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setContractName(file?.name);
    setContractFile(URL.createObjectURL(file));
  };

 

  const onSubmit = async (fabricatorData) => {
    try { 
      const token = sessionStorage.getItem("token");
      if(!token){
        throw errors("Token not found")
      }
      const data = await Service.addFabricator({
        ...fabricatorData,
        // design:contract,
        token:token,
      });
      dispatch(setFabricatorData(data));
      console.log("Document added:", data);
      alert("Successfully added new Fabricator",data)
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div>
      <Header title={"Add Fabricator"}/>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="p-5 flex flex-col justify-between gap-5">
          <div className="flex rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            <div className="mt-5">
              <Input
                label="Fabricator Name"
                placeholder="Fabricator Name"
                className="w-full"
                {...register("name", { required: "Fabricator Name is required" })}
              />
              {errors.fabname && <p>{errors.fabname.message}</p>}
            </div>
            <div className="flex flex-wrap gap-5 mt-5">
              <Input
                label="Country: "
                placeholder="Country"
                className="w-full"
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && <p>{errors.country.message}</p>}

              <Input
                label="State: "
                placeholder="State"
                className="w-full"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && <p>{errors.state.message}</p>}

              <Input
                label="City: "
                placeholder="City"
                className="w-full"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <p>{errors.city.message}</p>}
              <Input
                label="Zipcode: "
                placeholder="Zipcode"
                className="w-full"
                {...register("zipCode", { required: "Zipcode is required" })}
              />
              {errors.zipCode && <p>{errors.zipCode.message}</p>}

              
              <div className="mt-5 w-full">
                {/* <label htmlFor="contract" >Upload Standard Design</label> */}
                <Input
                  label="Upload Shop Standard"
                  name="design" // Add the name attribute
                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="contract"
                  accept=".pdf, image/*"
                  // onChange={handleContractChange}
                  // onClick={handleContractChange}

                  {...register("design")}
                />
                {contractName && (
                  <div className="mt-2">
                    <p>Standard Design: {contractName}</p>
                  </div>
                )}
                {errors.contract && <p>{errors.contract.message}</p>}
              </div>
            </div>

            <div className="mt-5 w-full">
              <Button type="submit">Add Fabricator</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFabricator;

/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { State, City }  from 'country-state-city';
import { Button, Header, Input, Select } from "../../../index";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setFabricatorData } from '../../../../store/fabricatorSlice';
import Service from "../../../../api/configAPI";

const AddFabricator = () => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch();
  const [contractName, setContractName] = useState(""); 
  const [contract, setContractFile] = useState(null); 

 const country = watch('country')
  const state = watch('state')
  const [stateList, setStateList] = useState([
    {
      label: 'Select State',
      value: '',
    },
  ])

  const [cityList, setCityList] = useState([
    {
      label: 'Select City',
      value: '',
    },
  ])

  const countryList = {
    'United States': 'US',
    Canada: 'CA',
    India: 'IN',
  }
  useEffect(() => {
    const stateListObject = {}
    State.getStatesOfCountry(countryList[country])?.forEach((state1) => {
      stateListObject[state1.name] = state1.isoCode
    })
    setStateList(stateListObject)
  }, [country])

  useEffect(() => {
    setCityList(
      City.getCitiesOfState(countryList[country], stateList[state])?.map(
        (city) => ({
          label: city?.name,
          value: city?.name,
        }),
      ),
    )
  }, [state])

  const handleContractChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setContractName(file?.name);
    setContractFile(URL.createObjectURL(file));
  };

  const onSubmit = async (fabricatorData) => {
    console.log(fabricatorData)
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
              {errors.name && <p className='text-red-600'>{errors.name.message}</p>}
            </div>
            <div className="flex flex-wrap gap-5 mt-5">
              <Select
                label="Country: "
                placeholder="Country"
                className="w-full"
                options={
                  [
                    { label: "Select Country", value: "" },
                    ...Object.keys(countryList).map((country) => ({
                      label: country,
                      value: country,
                    }))
                  ]
                }
                {...register("country", { required: "Country is required" })}
                onChange={setValue}
              />
              {errors.country && <p className='text-red-600'>{errors.country.message}</p>}

              <Select
                label="State: "
                placeholder="State"
                className="w-full"
                options={[
                  { label: "Select State", value: "" },
                  ...Object.keys(stateList).map((state1) => ({
                    label: state1,
                    value: state1,
                  }))
                ]}
                {...register("state", { required: "State is required" })}
                onChange={setValue}
              />
              {errors.state && <p className='text-red-600'>{errors.state.message}</p>}

              <Select
                label="City: "
                placeholder="City"
                className="w-full"
                options={[
                  { label: "Select City", value: "" },
                  ...cityList
                ]}
                {...register("city", { required: "City is required" })}
                onChange={setValue}
              />
              {errors.city && <p className='text-red-600'>{errors.city.message}</p>}
              <Input
                label="Zipcode: "
                placeholder="Zipcode"
                className="w-full"

                {...register("zipCode", {
                  required: "Zipcode is required",
                  //  pattern: {
                  //   value: /^[0-9]{6}$/,
                  //   message: "Zipcode must be a 6-digit integer",
                  // },
                  })}
              />
              {errors.zipCode && <p className='text-red-600'>{errors.zipCode.message}</p>}

              
              <div className="mt-5 w-full">
                {/* <label htmlFor="contract" >Upload Standard Design</label> */}
                <Input
                  label="Upload Shop Standard"
                  name="design" // Add the name attribute
                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="contract"
                  accept=".pdf, image/* .zip .rar .iso"
                  {...register("design",{required:'This field is required'})}
                />
                {contractName && (
                  <div className="mt-2">
                    <p>Standard Design: {contractName}</p>
                  </div>
                )}
                {errors.contract && <p className='text-red-600'>{errors.contract.message}</p>}
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

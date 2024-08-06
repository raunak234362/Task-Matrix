/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  MultiSelectCheckbox,
  AddTeam,
  Header,
  Toggle,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setProjectData } from "../../../../store/projectSlice";
import Service from "../../../../api/configAPI";

const AddProject = () => {
  const [fabricatorOptions, setFabricatorOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);

  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchFabricators = async () => {
      try {
        const fabricators = await Service.getAllFabricator();
        console.log(fabricators);
        const options = fabricators.map((fab) => ({
          label: fab.name,
          value: fab.id,
        }));
        setFabricatorOptions(options);
      } catch (error) {
        console.error("Error fetching fabricators:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const usersData = await Service.getAllUser(token);
        const options = usersData
          .filter((user) => user.is_staff === true)
          .map((user) => {
            return {
              label: user.name,
              value: user.id,
            };
          });
        setManagerOptions(options);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
    fetchFabricators();
  }, []);

  const onSubmit = async (projectData) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      projectData.duration = parseInt(projectData.duration);
      const data = await Service.addProject({
        ...projectData,
        token: token,
      });
      console.log("Response from addProject:", projectData);

      dispatch(setProjectData(data));
      console.log("Project added:", data);
      alert("Successfully added new Project", projectData?.name);
    } catch (error) {
      console.error("Error adding project:", error);
      console.log("Project data:", projectData);
    }
  };

  return (
    <div>
      <div>
        <Header title={"Add Project"} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="p-5 flex flex-col justify-between gap-5">
          <div className="flex rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            {/* {step === 1 && ( */}
            <>
              <div className="mt-3">
                <Select
                  label="Fabricator"
                  name="fabricator"
                  options={[
                    {
                      label: "Select Fabricator",
                      value: "",
                    },
                    ...fabricatorOptions,
                  ]}
                  className="w-full"
                  {...register("fabricator", {
                    required: "Fabricator is required",
                  })}
                />
              </div>
              <div className="mt-5">
                <Input
                  label="Project Name: "
                  name="name"
                  placeholder="Project"
                  className="w-full"
                  {...register("name", {
                    required: "Project Name is required",
                  })}
                />
              </div>
              <div className="mt-5">
                <Input
                  label="Description: "
                  name="description"
                  placeholder="Description"
                  className="w-full h-40"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
              </div>
              <div className="mt-5">
                <Select
                  label="Tools: "
                  name="tool"
                  options={[
                    {
                      label: "Select Tools",
                      value: "",
                    },
                    { label: "TEKLA", value: "TEKLA" },
                    { label: "SDS-2", value: "SDS-2" },
                  ]}
                  className="w-full"
                  {...register("tool", {
                    required: "Tools is required",
                  })}
                />
              </div>
                <div className="mt-5">
                  <Toggle
                    label="Connection Design"
                    name="connectionDesign"
                    {...register("connectionDesign")}
                  />
                </div>
                <div className="mt-5">
                  <Toggle
                    label="Misc Design"
                    name="miscDesign"
                    {...register("miscDesign")}
                  />
                </div>
              <div className="mt-5">
                <Input
                  label="Start Date:"
                  name="startDate"
                  type="date"
                  className="w-full"
                  {...register("startDate", {
                    required: "Start Date is required",
                  })}
                />
              </div>
              <div className="mt-5">
                <Input
                  label="Approval Date:"
                  name="endDate"
                  type="date"
                  className="w-full"
                  {...register("endDate", {
                    required: "End Date is required",
                  })}
                />
              </div>
              <div className="mt-5">
                <Input
                  label="Duration:"
                  name="duration"
                  type="number"
                  className="w-[25%]"
                  placeholder="No. of Weeks"
                  min={1}
                  {...register("duration")}
                />
              </div>
              <div className="mt-5">
                <Select
                  label="Manager"
                  name="manager"
                  options={[
                    {
                      label: "Select Manager",
                      value: "",
                    },
                    ...managerOptions,
                  ]}
                  className="w-full"
                  {...register("manager", {
                    required: "Fabricator is required",
                  })}
                />
              </div>
            </>
            {/* )} */}

            {/* {step === 2 && (
              <>
               <AddTeam/>
                
              </>
            )} */}

            <div className="mt-5 w-full flex justify-between">
              <Button type="submit">Submit</Button>
              {/* {step === 2 && (
                <Button type="button" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {step === 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
              )} */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProject;

/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Project, Header, BarView, FabricatorCharts, BarViews } from '../../../index'
import SegregateProject from '../../../../util/SegregateProject'
import { useSelector } from 'react-redux'

const ProjectStats = () => {
  const [fabricator, setFabricator] = useState(null)
  const [project, setProject] = useState(null)
  const [segregateProject, setSegregateProject] = useState({})

  const projects = useSelector((state) => state?.projectData?.projectData)

  useEffect(()=>{
    const segregateProject = async () => {
      const segregatedProjects = await SegregateProject(projects)
      setSegregateProject(segregatedProjects)
    }
    segregateProject()
  },[])
  return (
    <div className="flex-grow bg-white shadow-lg rounded-lg p-6">
      <div className="bg-gray-200 p-2 mt-5 rounded-lg">
        <FabricatorCharts segregateProject={segregateProject} />
      </div>
      <div className=" bg-white shadow-lg rounded-lg p-6 ">
        <BarViews
          segregateProject={segregateProject}
          setProject={setProject}
          setFabricator={setFabricator}
        />
      </div>
    </div>
  )
}

export default ProjectStats

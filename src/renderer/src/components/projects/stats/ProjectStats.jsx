/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Project, Header, BarView, FabricatorCharts, BarViews } from '../../index'
import SegregateProject from '../../../util/SegregateProject'
import { useSelector } from 'react-redux'

const ProjectStats = () => {
  const [fabricator, setFabricator] = useState(null)
  const [project, setProject] = useState(null)
  const [segregateProject, setSegregateProject] = useState({})

  const projectData = useSelector((state) => state?.projectData?.projectData)
  const fabricatorData = useSelector((state) => state?.fabricatorData?.fabricatorData)
  useEffect(()=>{
    const segregateProject = async () => {
      const segregatedProjects = await SegregateProject(projectData)
      setSegregateProject(segregatedProjects)
    }
    segregateProject()
  },[])
  return (
    <div className="flex-grow bg-white shadow-lg rounded-lg ">
      <div className=" p-2 mt-5 rounded-lg">
        <FabricatorCharts segregateProject={segregateProject} />
      </div>
      <div className=" bg-white shadow-lg rounded-lg p-6 ">
        <BarViews
          segregateProject={segregateProject}
          setProject={projectData}
          setFabricator={fabricatorData}
        />
      </div>
    </div>
  )
}

export default ProjectStats

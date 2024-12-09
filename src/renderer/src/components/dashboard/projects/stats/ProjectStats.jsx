/* eslint-disable prettier/prettier */
import { useSelector } from 'react-redux'
import SegregateProject from '../../../../util/SegregateProject'
import { useEffect, useState } from 'react'
import FabricatorCharts from '../allprojects/FabricatorChart'
import BarView from '../allprojects/BarView'

const ProjectStats = ({ projects }) => {
  const [segregateProject, setSegreateProject] = useState()
  const [fabricator, setFabricator] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const segregatedData = await SegregateProject(projects)
      setSegreateProject(segregatedData)
    }
    if (projects) {
      fetchData()
    }
  }, [projects])

  return (
    <div className="flex-grow bg-white shadow-lg rounded-lg p-6">
      <div className="bg-gray-200 p-2 mt-5 rounded-lg">
        <FabricatorCharts segregateProject={segregateProject} />
      </div>
      <BarView
        segregateProject={segregateProject}
        setFabricator={setFabricator}
        setProject={() => {}}
      />
    </div>
  )
}

export default ProjectStats

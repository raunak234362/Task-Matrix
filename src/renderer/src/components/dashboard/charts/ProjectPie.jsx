/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Service from '../../../api/configAPI';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const ProjectPie = () => {
  const [fabricatorProjects, setFabProjects] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await Service.getAllProject();
        const fabProjects = projects.reduce((acc, project) => {
          const { fabricator } = project;
          // console.log(fabricator)
          if (fabricator) {
            acc[fabricator?.name] = (acc[fabricator?.name] || 0) + 1;
          }
          console.log(acc);
          return acc;
        }, {});
        setFabProjects(fabProjects);
        setTotal(Object.values(fabProjects).reduce((sum, count) => sum + count, 0));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const chartData = {
    labels: Object.keys(fabricatorProjects).map(fabricator => `Fabricator: ${fabricator}`),
    datasets: [
      {
        data: Object.values(fabricatorProjects),
        backgroundColor: ['#15803d', '#f97316', '#fbbf24', '#34D399', '#60A5FA', '#A78BFA'],
        hoverBackgroundColor: ['#14532D', '#EA580C', '#CA8A04', '#059669', '#2563EB', '#7C3AED'],
      },
    ],
  };

  return (
    <div>
      {total > 0 ? (
        <>
          <Pie data={chartData} />
          <h3 className="text-center mt-3 font-semibold mb-2">Number of Projects in Fabricator</h3>
        </>
      ) : (
        <h3 className="text-center mt-3 font-semibold mb-2">No Projects Found</h3>
      )}
    </div>
  );
};

export default ProjectPie;

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarView = ({ segregateProject, setProject, setFabricator }) => {
  const stages = ["RFI", "IFA", "BFA", "BFA-M", "RIFA", "RBFA", "IFC", "BFC", "RIFC", "REV", "CO#"];

  // Define a set of colors for the bars
  const colors = ["#FF6347", "#FFD700", "#32CD32"]; // Red, Yellow, Green

  // Prepare data
  const labels = stages;
  const datasets = Object.keys(segregateProject).map((fab, index) => ({
    label: fab,
    data: stages.map((stage) => segregateProject[fab][stage]?.length || 0),
    backgroundColor: colors[index % colors.length], // Cycle through the colors
    stack: "ProjectCount",
  }));

  const data = {
    labels,
    datasets,
  };

  const handleClick = (event, elements) => {
    if (elements.length) {
      const { datasetIndex, index } = elements[0];
      const fab = Object.keys(segregateProject)[datasetIndex];
      const stage = stages[index];
      setProject(segregateProject[fab][stage]);
      setFabricator(fab);
    }
  };

  return (
    <div className="w-4/5 mx-auto">
      <Bar
        data={data}
        height={'100'}
        className="w-full"
        options={{
          onClick: handleClick,
          indexAxis: 'y', // Swap axes
          scales: {
            x: {
              beginAtZero: true,
               ticks: {
                precision: 1,
                stepSize: 1
               }
            },
            y: {
              stacked: true,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: "Project Data by Stage and Fabricator",
            },
          },
        }}
      />
      {/* Your table code */}
    </div>
  );
};

export default BarView;

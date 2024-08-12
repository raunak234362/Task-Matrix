/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarViews = ({ segregateProject, setProject, setFabricator }) => {
const stages = ['RFI', 'IFA', 'BFA', 'BFA-M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RIFC', 'REV', 'CO#'];
const colors = ['#FF6347', '#FFD700', '#32CD32']; // Red, Yellow, Green

// Prepare data for the chart
const labels = stages;
const datasets = Object.keys(segregateProject).map((fab, index) => {
const data = stages.map((stage) => segregateProject[fab][stage]?.length || 0);
return {
    label: fab,
    data,
    backgroundColor: colors[index % colors.length],
    stack: 'ProjectCount'
};
});

const data = {
labels,
datasets
};

const handleClick = (_, elements) => {
if (elements.length > 0) {
    const { datasetIndex, index } = elements[0];
    const fab = Object.keys(segregateProject)[datasetIndex];
    const stage = stages[index];
    setProject(segregateProject[fab][stage]);
    setFabricator(fab);
}
};

return (
<div className="w-full mx-auto">
    <Bar
    data={data}
    options={{
        onClick: handleClick,
        indexAxis: 'y', // Horizontal bars
        scales: {
        x: {
            beginAtZero: true,
            ticks: {
            precision: 0, // No decimal places
            stepSize: 1,
            font: {
                size: 12, // Increased font size for better readability
                weight: 'bold' // Bold font for emphasis
            }
            },
            title: {
            display: true,
            text: 'Number of Projects',
            font: {
                size: 15, // Title font size
                weight: 'bold' // Bold font for title
            }
            },
            grid: {
            display: true, // Display grid lines
            color: '#e0e0e0' // Light gray color for grid lines
            }
        },
        y: {
            stacked: true, // Stacked bars
            ticks: {
            font: {
                size: 12 // Decreased font size for the stages
            }
            },
            title: {
            display: true,
            text: 'Stages',
            font: {
                size: 15, // Title font size
                weight: 'bold' // Bold font for title
            }
            },
            grid: {
            display: false // Hide y-axis grid lines for a cleaner look
            }
        }
        },
        plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
            font: {
                size: 14, // Increased legend font size
                weight: 'bold' // Bold font for legend
            }
            }
        },
        title: {
            display: true,
            text: 'Project Data by Stage and Fabricator',
            font: {
            size: 10, // Title font size
            weight: 'bold' // Bold font for title
            }
        }
        },
        maintainAspectRatio: false // Disable maintaining aspect ratio to allow custom height
    }}
    height={150} // Increased height of the chart
    className="w-full"
    />
</div>
);
};

export default BarViews;

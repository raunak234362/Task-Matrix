import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarViews = ({ segregateProject, setProject, setFabricator }) => {
const stages = [
'RFI',
'IFA',
'BFA',
'BFA-M',
'RIFA',
'RBFA',
'IFC',
'BFC',
'RIFC',
'REV',
'CO#',
]
const colors = ['#FF6347', '#FFD700', '#32CD32'] // Red, Yellow, Green

// Prepare data for the chart
const labels = stages
const datasets = Object.keys(segregateProject).map((fab, index) => {
const data = stages.map(
    (stage) => segregateProject[fab][stage]?.length || 0,
)
return {
    label: fab,
    data,
    backgroundColor: colors[index % colors.length],
    stack: 'ProjectCount',
}
})

const data = {
labels,
datasets,
}

const handleClick = (_, elements) => {
if (elements.length > 0) {
    const { datasetIndex, index } = elements[0]
    const fab = Object.keys(segregateProject)[datasetIndex]
    const stage = stages[index]
    setProject(segregateProject[fab][stage])
    setFabricator(fab)
}
}

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
            },
            title: {
            display: true,
            text: 'Number of Projects',
            },
        },
        y: {
            stacked: true,
            title: {
            display: true,
            text: 'Stages',
            },
        },
        },
        plugins: {
        legend: {
            display: true,
            position: 'top',
        },
        title: {
            display: true,
            text: 'Project Data by Stage and Fabricator',
        },
        },
    }}
    height={100} // Adjust height as needed
    className="w-full"
    />
</div>
)
}

export default BarViews

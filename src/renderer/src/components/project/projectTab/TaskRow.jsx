/* eslint-disable react/prop-types */
const TaskRow = ({ index, style, data, getPositionAndWidth, typeColors, setHoveredTask }) => {
  const task = data[index];
  const { left, width } = getPositionAndWidth(
    task.startDate,
    new Date(task.endDate.getTime() + 24 * 60 * 60 * 1000)
  );

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #e5e7eb',
        transition: 'background-color 0.2s',
        backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
      }}
      className="hover:bg-gray-100"
    >
      <div className="flex-shrink-0 px-2 font-medium truncate w-52">
        {task.username}
      </div>
      <div className="relative flex-1">
        <div
          className="absolute z-0 h-6 overflow-hidden transition-shadow duration-200 rounded-md shadow-sm cursor-pointer hover:shadow-md"
          style={{
            left: `${left}px`,
            width: `${width}px`,
            top: "8px",
            backgroundColor: typeColors[task.type] || "#ccc",
          }}
          onMouseEnter={() => setHoveredTask(task)}
          onMouseLeave={() => setHoveredTask(null)}
        >
          <div className="h-full bg-white bg-opacity-30" style={{ width: `${task.progress}%` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow-sm">{task.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
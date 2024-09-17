/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
export const TableView = ({ segregateProject, setProject, setFabricator }) => {
  const stages = [
    "Fabricators",
    "RIF",
    "IFA",
    "BFA",
    "RIFA",
    "BFC",
    "IFC",
    "RIFC",
    "REV",
  ];

  function handleClick(fab, stage) {
    setProject(segregateProject[fab][stage]);
    setFabricator(fab);
  }

  return (
    <>
      <div>
        <table className="w-full table-auto border-collapse text-center rounded-xl">
          <thead>
            <tr className="bg-gray-200">
              {stages?.map((stg) => (
                <th className="p-3 border-b border-gray-300">{stg}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object?.keys(segregateProject)?.map((fab) => (
              <tr className="hover:bg-gray-100">
                <td className="border px-1 py-2">{fab}</td>
                {Object?.keys(segregateProject[fab])?.map((stage) => {
                  return (
                    <td className="border px-1 py-2">
                      <span
                        className={` ${
                          segregateProject[fab][stage]?.length > 0
                            ? "text-blue-700 font-semibold hover:bg-gray-200 px-5 py-1 rounded-full cursor-pointer"
                            : "text-black"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (segregateProject[fab][stage]?.length > 0)
                            handleClick(fab, stage);
                        }}
                      >
                        {segregateProject[fab][stage]?.length}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* eslint-disable react/prop-types */
import { ChevronRight, FileText } from "lucide-react";


const RenderFiles = ({ files, formatDate }) => {
  // Step 1: Normalize and flatten files
  const projectFiles = Array.isArray(files)
    ? files.map((doc) => {
        const fileData = doc.file ? { ...doc.file, ...doc } : { ...doc };
        if (fileData.file) delete fileData.file;
        return fileData;
      })
    : [];

  // Step 2: Group files by description
  const groupedFiles = projectFiles.reduce((acc, curr) => {
    const desc = curr.description || "No Description";
    if (!acc[desc]) acc[desc] = [];
    if (Array.isArray(curr.files)) {
      curr.files.forEach((f) => {
        acc[desc].push({
          ...f,
          uploadedAt: curr.uploadedAt,
          user: curr.user,
          documentID: curr.id,
          stage: curr.stage, // Include stage info
        });
      });
    }
    return acc;
  }, {});

  // Step 3: Render grouped sections
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Project Files</h4>
        <Button onClick={onAddFilesClick}>Add Document</Button>
      </div> */}

      {/* Files grouped by description */}
      {Object.keys(groupedFiles).length > 0 ? (
        Object.entries(groupedFiles).map(([description, files]) => {
          const firstFile = files[0];
          const uploaderName = firstFile?.user
            ? `${firstFile.user.f_name || ""} ${firstFile.user.l_name || ""}`
            : "Unknown User";

          return (
            <div
              key={description}
              className="border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm"
            >
              {/* Description + Stage */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <div>
                  <h5
                    className="text-base font-semibold text-gray-800"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    {firstFile?.stage && (
                      <p className="text-xs text-blue-600 font-medium">
                        Stage: {firstFile.stage}
                      </p>
                    )}
                    {firstFile?.uploadedAt && (
                      <p className="text-xs text-gray-500">
                        Uploaded on {formatDate(firstFile.uploadedAt)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      by <span className="font-medium">{uploaderName}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* File List */}
              <div className="grid grid-cols-1 gap-2 mt-2">
                {files.map((file, index) => (
                  <a
                    key={file.id || `file-${index}`}
                    href={`${
                      import.meta.env.VITE_BASE_URL
                    }/api/designDrawings/designdrawing/viewfile/${
                      file.documentID
                    }/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={18} className="text-teal-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium truncate">
                        {file.originalName || `File ${index + 1}`}
                      </p>
                      {file.stage && (
                        <p className="text-xs text-gray-500">
                          Stage: {file.stage}
                        </p>
                      )}
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        // Empty State
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No files available for this project</p>
          {/* <Button
            size="sm"
            variant="ghost"
            onClick={onAddFilesClick}
            className="mt-2"
          >
            <Plus size={14} />
            Upload Files
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default RenderFiles;

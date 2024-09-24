/* eslint-disable prettier/prettier */
async function SegregateProject(projects) {
    const blankStages = {
        RFI: [],
        IFA: [],
        BFA: [],
        'BFA-M': [],
        RIFA: [],
        RBFA: [],
        IFC: [],
        BFC: [],
        RIFC: [],
        REV: [],
        'CO#': [],
    };

    const result = {};

    await projects?.forEach((project) => {
        console.log('segrate data-------',project)
        const fabricatorName = project?.fabricator?.name;
        const stage = project?.stage;
        const projectName = project?.name; // Assuming `project` has a `name` property
        console.log('segrated data-------',projectName )
        if (fabricatorName) {
            if (!result[fabricatorName]) {
                result[fabricatorName] = Object.keys(blankStages).reduce((acc, stage) => {
                    acc[stage] = [];
                    return acc;
                }, {});
            }

            if (!result[fabricatorName][stage]) {
                result[fabricatorName][stage] = [];
            }

            // Push the project name along with the project object
            result[fabricatorName][stage].push({
                project: project, // Keep the project object
                name: projectName // Add the project name
            });
        }
    });

    return result;
}

export default SegregateProject;

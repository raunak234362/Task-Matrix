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
        const fabricatorName = project?.fabricator?.name;
        const stage = project?.stage;

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

            result[fabricatorName][stage].push(project);
        }
    });

    return result;
}

export default SegregateProject;

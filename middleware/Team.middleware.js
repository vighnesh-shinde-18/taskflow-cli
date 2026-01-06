import db from '../db/index.js'
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const isDeveloperInManagerTeam = asyncHandler(async (req, res, next) => {
    try {
        const managerId = req.user.id;
        const developerId = req.body.developerId;

        const [teams] = await db.execute(
            'SELECT id FROM teams WHERE manager_id = ?',
            [managerId]
        );

        if (!teams.length) {
            throw new ApiError(403, 'Manager has no team')
        }

        const teamId = teams[0].id;

        const [members] = await db.execute(
            'SELECT developer_id FROM team_members WHERE team_id = ? AND developer_id = ?',
            [teamId, developerId]
        );

        if (!members.length) {
             throw new ApiError(403, 'Developer not in your team')
       
        }

        next();

    } catch (error) {
        console.log("Error while checking developer in the team ", error)
        throw new ApiError(503, "Internel Server error", error);

    }
});

export default isDeveloperInManagerTeam;
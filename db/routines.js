const { client } = require('./client');
const { existingFieldsToString } = require('./utils');

async function getRoutineById(id){
    try{

        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=$1;
        `, [id]);

        return routine;
    }catch(error){
        throw error;
    }
}

async function getRoutinesWithoutActivities(){
    try{

        const { rows: routines } = await client.query(`
        SELECT *
        FROM routines;
        `);

        return routines;
    }catch(error){
        throw error;
    }
}

async function getAllRoutines(){
    try{

        const { rows: routines } = await client.query(`
            SELECT *, username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id
        `);

        for (const routine of routines) {

            const { rows: activities } = await client.query(`
                SELECT *
                FROM activities
                JOIN routine_activities ON routine_activities."activityId" = activities.id
                WHERE routine_activities."routineId" = ${routine.id};
            `);

            routine.activities = activities;
        }

        return routines;
    }catch(error){
        throw error;
    }
}

async function getAllPublicRoutines(){
    try{

        const { rows: routines } = await client.query(`
            SELECT *, username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            WHERE "isPublic"=true;
        `);

        for (const routine of routines) {

            const { rows: activities } = await client.query(`
                SELECT *
                FROM activities
                JOIN routine_activities ON routine_activities."activityId" = activities.id
                WHERE routine_activities."routineId" = ${routine.id};
            `);

            routine.activities = activities;
        }

        return routines;
    }catch(error){
        throw error;
    }
}

async function getAllRoutinesByUser({ username }){
    try{

        const { rows: routines } = await client.query(`
            SELECT *, username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            WHERE users.username = '${username}';
        `);

        for (const routine of routines) {
            const { rows: activities } = await client.query(`
                SELECT *
                FROM activities
                JOIN routine_activities ON routine_activities."activityId" = activities.id
                WHERE routine_activities."routineId" = ${routine.id};
            `);

            routine.activities = activities;
        }

        return routines;
    }catch(error){
        throw error;
    }
}

async function getPublicRoutinesByUser({ username }){
    try{
        
        const { rows: routines } = await client.query(`
            SELECT routines.*, username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            WHERE users.username='${username}'
            AND "isPublic"=true;
        `);

        for (const routine of routines) {
            const { rows: activities } = await client.query(`
                SELECT *
                FROM activities
                JOIN routine_activities
                ON routine_activities."activityId" = activities.id
                WHERE routine_activities."routineId" = ${routine.id};
            `);

            routine.activities = activities;
        }

        return routines;
    }catch(error){
        throw error;
    }
}

async function getPublicRoutinesByActivity({ id }){
    try{

        console.log(id);

        const { rows: routines } = await client.query(`
            SELECT routines.*, users.id, username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            JOIN routine_activities ON routine_activities."routineId" = routines.id
            WHERE "isPublic" = true
            AND routine_activities."activityId" = $1;
        `, [id]);

        console.log('postman routines: ',routines);

        for (const routine of routines) {
            const { rows: activities } = await client.query(`
                SELECT *
                FROM activities
                JOIN routine_activities ON routine_activities."activityId" = activities.id
                WHERE routine_activities."routineId" = ${routine.id};
            `);

            routine.activities = activities;
        }

        return routines;
    }catch(error){
        throw error;
    }
}

async function createRoutine({ creatorId, isPublic, name, goal }){
    try{

        const { rows: [routine] } = await client.query(`
            INSERT INTO routines ("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);

        return routine;
    }catch(error){
        throw error;
    }
}

async function updateRoutine({ id, isPublic, name, goal }){
    try{

        const queryParams = existingFieldsToString({isPublic, name, goal});
        queryParams.values.unshift(id);

        const { rows: [ routine ] } = await client.query(`
            UPDATE routines 
            SET ${queryParams.insert}
            WHERE id=$1
            RETURNING *;
        `, queryParams.values);

        return routine;
    }catch(error){
        throw error;
    }
}

// creatorId ??
async function destroyRoutine(id){
    try{

        const { rows: [ deletedRoutine ] } = await client.query(`
            DELETE FROM routines
            WHERE id=$1
            RETURNING *;
        `, [id])

        return deletedRoutine
    }catch(error){
        throw error;
    }
}

module.exports = {
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine
};
// Bring this in from index
const { client } = require('./client');
const { existingFieldsToString } = require('./utils');

async function getRoutineActivityById(id){
    try{

        const {rows: [routine_activity]} = await client.query(`
            SELECT * 
            FROM routine_activities
            WHERE id=$1;
        `, [id]);

        return routine_activity;
    }catch(error){
        throw error;
    }
}

async function addActivityToRoutine({ routineId, activityId, count, duration }){
    try{

        const { rows: [ routineActivity ] } = await client.query(`
            INSERT INTO routine_activities ("routineId", "activityId", count, duration )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("routineId", "activityId") DO NOTHING
            RETURNING *;
        `, [routineId, activityId, count, duration]);

        if(routineActivity === undefined){
            throw {error: 'duplicate key value violates unique constraint "routine_activities_routineId_activityId_key'}
        }

        return routineActivity;
    }catch(error){
        console.log(error)
        throw error;
    }
}

async function updateRoutineActivity({ id, count, duration }){
    try{


        const queryParams = existingFieldsToString({count, duration});
        queryParams.values.unshift(id);

        const { rows: [ updatedRoutineActivity ] } = await client.query(`
            UPDATE routine_activities
            SET ${queryParams.insert}
            WHERE id=$1
            RETURNING *;
        `, queryParams.values);

        return updatedRoutineActivity;
    }catch(error){
        throw error;
    }
}

async function destroyRoutineActivity(id){
    try{

        const { rows: [ deletedRoutineActivity ] } = await client.query(`
            DELETE FROM routine_activities
            WHERE id=$1
            RETURNING *;
        `, [id]);

        return deletedRoutineActivity;
    }catch(error){
        throw error;
    }
}

async function getRoutineActivitiesByRoutine({id}){
    try{

        const {rows: routineActivities} = await client.query(`
            SELECT *
            FROM routine_activities
            WHERE "routineId"=$1
        `, [id]);

        return routineActivities;

    }catch(error){
        throw error;
    }
}

module.exports = {
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
};
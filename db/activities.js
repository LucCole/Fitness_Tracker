const { client } = require('./client');
const { existingFieldsToString } = require('./utils');

async function getActivityById(id){
    try{
 
        const { rows: [ activity ] } = await client.query(`
            SELECT *
            FROM activities
            WHERE id=$1;
        `, [id]);

        return activity;
    }catch(error){
        throw error;
    }
}

async function getAllActivities(){
    try{

        const { rows: activities } = await client.query(`
            SELECT *
            FROM activities;
        `);

        return activities;
    }catch(error){
        throw error;
    }
}

async function createActivity({name, description}){
    try{

        const { rows: [ activity ] } = await client.query(`
            INSERT INTO activities (name, description)
            VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, description]);

        return activity;
    }catch(error){
        throw error;
    }
}

// Added update only if present
async function updateActivity({id, name, description}){
    try{

        const queryParams = existingFieldsToString({name, description});
        queryParams.values.unshift(id);
        
        const { rows: [ activity ] } = await client.query(`
            UPDATE activities 
            SET ${queryParams.insert}
            WHERE id=$1
            RETURNING *;
        `, queryParams.values);

        return activity;
    }catch(error){
        throw error;
    }
}

module.exports = {
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity
}
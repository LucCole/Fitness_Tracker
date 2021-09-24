const { client } = require('./client');

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

async function updateActivity({id, name, description}){
    try{
       
        const setArr = [];
        if(name){
            setArr.push(`name='${name}'`);
        }
        if(description){
            setArr.push(`description='${description}'`);
        }
        const setStr = setArr.toString();
        
        const { rows: [ activity ] } = await client.query(`
            UPDATE activities 
            SET ${setStr}
            WHERE id=$1
            RETURNING *;
        `, [id]);

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
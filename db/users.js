const { client } = require('./client');
const bcrypt = require('bcrypt')


// On conflict do nothing ???
async function createUser({username, password}){
    try{

        if(password.length < 8){
            throw 'Passowrd is too short, it must be 8 characters or longer.';
        }

        const SALT_COUNT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

        const { rows: [ user ] } = await client.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
        `, [username, hashedPassword]);

        return user;
    }catch(error){
        throw error;
    }
}

async function getUserByUsername(username){
    try{

        const { rows: [ user ] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1;
        `, [username]);

        return user
    }catch(error){
        throw error;
    }
}

async function getUser({username, password}){
    try{

        const user = await getUserByUsername(username);
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);

        if(passwordsMatch){
            delete user.password;
            return user;
        }

    }catch(error){
        throw error;
    }
}

async function getUserById(id){
    try{

        const { rows: [ user ] } = await client.query(`
            SELECT id, username
            FROM users
            WHERE id=$1;
        `, [id]);

        return user;
    }catch(error){
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
};
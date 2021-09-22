const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {requireUser} = require('./middleware');

const {
    createUser,
    getUser,
    getPublicRoutinesByUser,
    getUserById
} = require('../db');

// Tweaks
usersRouter.post('/register', async (req, res, next) =>{
    try{


        // does the user stuff throw an error


        const user = await createUser(req.body);

        const token = jwt.sign({ 
            id: user.id, 
            username: user.username
        }, JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: 'User registered',
            token,
            user
        });

        // res.send({user});
    }catch(error){
       next(error);
    }
});

// Tweaks
usersRouter.post('/login', async (req, res, next) =>{
    try{

        // If does bnot have a user throw error
        const user = await getUser(req.body);

        const token = jwt.sign({ 
            id: user.id, 
            username: user.username
        }, JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({token});
    }catch(error){
       next(error);
    }
});

// Tweaks
usersRouter.get('/me', requireUser, async (req, res, next) =>{
    try{
        // needs to be user
        const routines = await getUserById(req.user.id);
        res.send(routines); 
    }catch(error){
       next(error);
    }
});

// Tweaks
usersRouter.get('/:username/routines', async (req, res, next) =>{
    try{
        const routines = await getPublicRoutinesByUser(req.params);
        res.send(routines);
    }catch(error){
       next(error);
    }
});

module.exports = usersRouter;
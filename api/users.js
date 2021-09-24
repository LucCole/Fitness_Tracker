const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {requireUser} = require('./middleware');

const {
    createUser,
    getUser,
    getPublicRoutinesByUser,
    getUserById,
    getUserByUsername
} = require('../db');

usersRouter.post('/register', async (req, res, next) =>{
    try{

        if(req.body.password.length < 8){
            next({
                message: 'Passowrd is too short, it must be 8 characters or longer.',
            });
        }else if(req.body.username.length < 3){
            next({
                message: 'Username is too short, it must be 3 characters or longer.',
            });
        }

        const isUser = await getUserByUsername(req.body.username);

        if(isUser){
            next({
                message: 'There is already a user with that name, please try another username.',
            });
        }

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

    }catch(error){
       next(error);
    }
});

usersRouter.post('/login', async (req, res, next) =>{
    try{

        if(req.body.password.length < 8){
            next({
                message: 'Passowrd is too short, it must be 8 characters or longer.',
            });
        }else if(req.body.username.length < 3){
            next({
                message: 'Username is too short, it must be 3 characters or longer.',
            });
        }

        const isUser = await getUserByUsername(req.body.username);

        if(!isUser.id){
            next({
                message: 'That user does not exist, please try another username.',
            });
        }

        const user = await getUser(req.body);

        if(!user.id){
            next({
                message: 'Error logging in, please check your information and try again.',
            });
        }

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

usersRouter.get('/me', requireUser, async (req, res, next) =>{
    try{
        // 
        const routines = await getUserById(req.user.id);
        res.send(routines); 
    }catch(error){
       next(error);
    }
});

usersRouter.get('/:username/routines', async (req, res, next) =>{
    try{
        const routines = await getPublicRoutinesByUser(req.params);
        res.send(routines);
    }catch(error){
       next(error);
    }
});

module.exports = usersRouter;
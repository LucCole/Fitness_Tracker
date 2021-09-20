const express = require('express');
const routinesRouter = express.Router();

const {requireUser} = require('./middleware');

const {
    getAllPublicRoutines,
    getRoutineById,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine
} = require('../db');

routinesRouter.get('/', async (req, res, next) =>{
    try{
        const routines = await getAllPublicRoutines();
        res.send(routines);
    }catch(error){
       next(error);
    }
});

// *
routinesRouter.post('/', requireUser, async (req, res, next) =>{
    try{
        const routine = await createRoutine({ creatorId: req.user.id, isPublic: req.body.isPublic, name: req.body.name, goal: req.body.goal });
        res.send(routine);
    }catch(error){
       next(error);
    }
});

// **
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) =>{
    try{

        const routine = await getRoutineById(req.params.routineId);

        if(routine.creatorId === req.user.id){
            const updatedRoutine = await updateRoutine({ id: req.params.routineId, isPublic: req.body.isPublic, name: req.body.name, goal: req.body.goal });
            res.send(updatedRoutine);
        }else{
            res.status(401);
            next({
                name: 'MissingUserError',
                message: 'You do not have the permissions perform this action',
            });
        }

    }catch(error){
       next(error);
    }
});


// **
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) =>{
    try{

        const routine = await getRoutineById(req.params.routineId);

        if(routine.creatorId === req.user.id){
            const destoyedRoutine = await destroyRoutine(req.params.routineId);
            res.send(destoyedRoutine);
        }else{
            res.status(401);
            next({
                name: 'MissingUserError',
                message: 'You do not have the permissions perform this action',
            });
        }

    }catch(error){
       next(error);
    }
});

// this looks like something that would need to be loggin in for, but apperantly not
routinesRouter.post('/:routineId/activities', async (req, res, next) =>{
    try{


        // Make sure that you are not adding any of the same routines. getActivityByRoutine (Tim, in git)


        const routine = await addActivityToRoutine({ routineId: req.params.routineId, activityId: req.body.activityId, count: req.body.count, duration: req.body.duration });
        res.send(routine);
    }catch(error){
       next(error);
    }
});

module.exports = routinesRouter;
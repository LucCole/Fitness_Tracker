const express = require('express');
const routineActivitiesRouter = express.Router();

const {requireUser} = require('./middleware');

const {
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivityById,
    getRoutineById
} = require('../db');

// **
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) =>{
    try{

        const routine_activity = await getRoutineActivityById(req.params.routineActivityId)
        const routine = await getRoutineById(routine_activity.routineId)
        if(routine.creatorId === req.user.id) {
            const updatedRoutineActivity = await updateRoutineActivity({id: req.params.routineActivityId, count: req.body.count, duration: req.body.duration});
            res.send(updatedRoutineActivity);
        } else {
            next({
                name: "NotAuthorizedError",
                message: "Must be authorized to update routine activity"
            })
        }

    }catch({name, message}){
       next({name, message});
    }
});

// **
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) =>{
    try{
        const routine_activity = await getRoutineActivityById(req.params.routineActivityId)
        const routine = await getRoutineById(routine_activity.routineId)
        if(routine.creatorId === req.user.id) {
            const destroyedRoutineActivity = await destroyRoutineActivity(req.params.routineActivityId);
            res.send(destroyedRoutineActivity)
        } else {
            next({
                name: "NotAuthorizedError",
                message: "Must be authorized to update routine activity"
            })
        }

    }catch({name, message}){
       next({name, message});
    }
});

module.exports = routineActivitiesRouter;
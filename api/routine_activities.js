const express = require('express');
const routineActivitiesRouter = express.Router();

const {requireUser} = require('./middleware');

const {
    updateRoutineActivity,
    destroyRoutineActivity,
    client
} = require('../db');

routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) =>{
    try{
        
        const {rows: [routineActivity]} = await client.query(`
            SELECT routine_activities."routineId" AS routineActivitiesId, routines.id AS "routineId", routines."creatorId"
            FROM routine_activities
            JOIN routines ON routine_activities."routineId" = routines.id
            WHERE routines."creatorId" = $1 AND routine_activities.id = $2;
        `, [req.user.id, req.params.routineActivityId]);

        if(routineActivity.creatorId === req.user.id){
            const updatedRoutineActivity = await updateRoutineActivity({id: req.params.routineActivityId, count: req.body.count, duration: req.body.duration});
            res.send(updatedRoutineActivity);
        }

    }catch(error){
       next(error);
    }
});

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) =>{
    try{

        const {rows: [routineActivity]} = await client.query(`
            SELECT routine_activities."routineId" AS routineActivitiesId, routines.id AS "routineId", routines."creatorId"
            FROM routine_activities
            JOIN routines ON routine_activities."routineId" = routines.id
            WHERE routines."creatorId" = $1 AND routine_activities.id = $2;
        `, [req.user.id, req.params.routineActivityId]);

        if(routineActivity.creatorId === req.user.id){
            const destroyedRoutineActivity = await destroyRoutineActivity(req.params.routineActivityId);
            res.send(destroyedRoutineActivity);
        }
    }catch(error){
       next(error);
    }
});

module.exports = routineActivitiesRouter;
const express = require('express');
const activitiesRouter = express.Router();

const {requireUser} = require('./middleware');

const {
    getAllActivities,
    createActivity,
    updateActivity,
    getPublicRoutinesByActivity
} = require('../db');

// Y
activitiesRouter.get('/', async (req, res, next) =>{
    try{
        const activities = await getAllActivities();
        res.send(activities);
    }catch(error){
       next(error);
    }
});

// *
activitiesRouter.post('/', requireUser, async (req, res, next) =>{
    try{
        const activitiy = await createActivity(req.body);
        res.send(activitiy);
    }catch(error){
       next(error);
    }
});

// *
activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) =>{
    try{
        const activitiy = await updateActivity({id: req.params.activityId, name: req.body.name, description: req.body.description});
        res.send(activitiy);
    }catch(error){
       next(error);
    }
});

// ?? was using req.body and still worked
activitiesRouter.get('/:activityId/routines', async (req, res, next) =>{
    try{

        const activities = await getPublicRoutinesByActivity({id: req.params.activityId});
        res.send(activities);
    }catch(error){
       next(error);
    }
});

module.exports = activitiesRouter;
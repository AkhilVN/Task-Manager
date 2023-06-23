const taskRoutes = require('express').Router();
const taskManagementData = require('../database/taskManagementData.json');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const Validator = require('../validators');

taskRoutes.use(bodyParser.urlencoded({ extended: false }));
taskRoutes.use(bodyParser.json());

// Get the list of all tasks
taskRoutes.get('/', (req, res) => {
    let data = {
        status: 200,
        message: "Tasks fetched successfully",
        data: taskManagementData
    }
    res.status(200);
    res.send(data);
});

// Get the task with a specific id
taskRoutes.get('/:taskId', (req, res) => {
    let taskId = req.params.taskId;
    let result = Validator.validateTaskId(taskId, taskManagementData);
    res.status(200);
    res.send(result);
})

// Create a new task
taskRoutes.post('/', (req, res) => {
    const taskData = req.body;
    let writePath = path.join(__dirname, '..', '/database/taskManagementData.json');
    if (Validator.validateTask(taskData, taskManagementData).status === 200) {
        const uuid = uuidv4();
        let taskManagementDataList = JSON.parse(JSON.stringify(taskManagementData));
        taskData.id = uuid;
        taskData.createdAt = new Date();
        taskData.updatedAt = new Date();
        taskData.status = taskData.isCompleted ? "COMPLETED" : "CREATED";
        taskData.isCompleted = taskData.isCompleted ? taskData.isCompleted : false;
        taskData.priority = Validator.validatePriority(taskData) ? taskData.priority.toUpperCase() : "MEDIUM";
        taskManagementDataList.push(taskData);
        fs.writeFileSync(writePath, JSON.stringify(taskManagementDataList), { encoding: "utf8", flag: "w" });
        res.status(200);
        res.json(Validator.validateTask(taskData, taskManagementData));
    } else {
        res.status(400);
        res.json(Validator.validateTask(taskData, taskManagementData));
    }
});

// Update a task with a specific id
taskRoutes.put('/:taskId', (req, res) => {
    let taskId = req.params.taskId;
    let taskData = req.body;
    let writePath = path.join(__dirname, '..', '/database/taskManagementData.json');
    let taskManagementDataList = JSON.parse(JSON.stringify(taskManagementData));
    let originalTask = Validator.validateTaskId(taskId, taskManagementDataList).data;
    if (originalTask && Object.keys(originalTask).length) {
        originalTask.title = taskData.title ? taskData.title : originalTask.title;
        originalTask.description = taskData.description ? taskData.description : originalTask.description;
        originalTask.priority = Validator.validatePriority(taskData) ? taskData.priority.toUpperCase() : originalTask.priority;
        originalTask.updatedAt = new Date();
        originalTask.isCompleted = taskData.isCompleted ? taskData.isCompleted : originalTask.isCompleted;
        originalTask.status = taskData.isCompleted ? "COMPLETED" : "CREATED";
        fs.writeFileSync(writePath, JSON.stringify(taskManagementDataList), { encoding: "utf8", flag: "w" });
        res.status(200);
        res.json({
            status: 200,
            message: "Task updated successfully",
            data: originalTask
        });
    } else {
        res.status(404);
        res.json({
            status: 404,
            message: "Task not found",
            data: {}
        });
    }
});

// Delete a task with a specific id
taskRoutes.delete('/:taskId', (req, res) => {
    let taskId = req.params.taskId;
    let writePath = path.join(__dirname, '..', '/database/taskManagementData.json');
    let taskManagementDataList = JSON.parse(JSON.stringify(taskManagementData));
    let originalTask = Validator.validateTaskId(taskId, taskManagementDataList).data;
    if (originalTask && Object.keys(originalTask).length) {
        let index = taskManagementDataList.findIndex(el => el.id === taskId);
        taskManagementDataList.splice(index, 1);
        fs.writeFileSync(writePath, JSON.stringify(taskManagementDataList), { encoding: "utf8", flag: "w" });
        res.status(200);
        res.json({
            status: 200,
            message: "Task deleted successfully",
        });
    } else {
        res.status(404);
        res.json({
            status: 404,
            message: "Invalid task id",
        });
    }
});


module.exports = taskRoutes;
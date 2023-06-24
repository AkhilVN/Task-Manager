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
    const sort = req.query.sort;
    const isCompleted = req.query.isCompleted;
    let sortedTasks = [];
    let isCompletedTasks = [];

    //sort by createdAt, filter by isCompleted
    if (isCompleted) {
        if (isCompleted !== "true" && isCompleted !== "false") {
            res.status(400);
            res.send({
                status: 400,
                message: "Invalid isCompleted value, use true or false"
            });
        } else {
            isCompletedTasks = taskManagementData.filter((task) => {
                return task.isCompleted.toString() === isCompleted;
            });
            res.status(200),
                res.send({
                    status: 200,
                    message: "Tasks fetched successfully for isCompleted value " + isCompleted + ".",
                    data: isCompletedTasks
                });
        }
    }
    if (isCompleted && sort) {
        let result = isCompletedTasks.sort((a, b) => {
            return sort === "DESC" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
        });
        let data = {
            status: 200,
            message: "Tasks fetched successfully for isCompleted value " + isCompleted + " and sort value " + sort + ".",
            data: result
        }
        res.status(200);
        res.send(data);
    }
    if (sort) {
        if (sort !== "ASC" && sort !== "DESC") {
            res.status(400);
            res.send({
                status: 400,
                message: "Invalid sort value, use ASC or DESC"
            });
        } else {
            sortedTasks = taskManagementData.sort((a, b) => {
                return sort === "DESC" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
            });
            res.status(200);
            res.send({
                status: 200,
                message: "Tasks fetched successfully for sort value " + sort,
                data: sortedTasks
            });
        }
    }
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

// fetch task by priority
taskRoutes.get('/priority/:priority', (req, res) => {
    let priority = req.params.priority;
    let result = Validator.validatePriority({ priority }, taskManagementData);
    if (result) {
        const filteredData = taskManagementData.filter((task) => task.priority === priority.toUpperCase())
        res.status(200);
        res.send({
            status: 200,
            message: `Tasks fetched for ${priority} priority`,
            data: filteredData
        });
    } else {
        res.status(400);
        res.send({
            status: 400,
            message: `Invalid priority value. Use HIGH, MEDIUM or LOW`,
            data: {}
        });
    }
});

module.exports = taskRoutes;
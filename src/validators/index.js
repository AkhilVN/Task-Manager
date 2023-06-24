class Validator {
    static validateTask(task, taskManagementData) {

        if (!this.validateUniqueTaskTitle(task, taskManagementData)) {
            return {
                status: 400,
                message: "Task title should be unique"
            }
        }
        if(!this.ValidateIsBoolean(task.isCompleted)) {
            return {
                status: 400,
                message: "isCompleted should be a boolean value"
            }
        }

        if (task.hasOwnProperty('title') && task.hasOwnProperty('description')) {
            return {
                status: 200,
                message: this.validatePriority(task) ? "Task added successfully" : "Task added successfully with default priority as MEDIUM",
                data: task
            }
        }
        return {
            "status": 400,
            "message": "Title and description is mandatory for creating a task"
        }
    }

    static validateUniqueTaskTitle(task, taskManagementData) {
        let taskFound = taskManagementData.some(el => el.title === task.title);
        if (taskFound) return false;
        return true;
    }
    static validatePriority(task) {
        let priority = task.priority?.toUpperCase();
        if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
            return true;
        }
        return false;
    } 
    static validateTaskId(taskId, taskManagementData) {
        let taskFound = taskManagementData.find(el => el.id === taskId);
        if (taskFound && Object.keys(taskFound).length) return {
            status: 200,
            message: "Task found",
            data: taskFound
        };
        return {
            status: 200,
            message: "Task not found",
            data: {}
        };
    }
    static ValidateIsBoolean(isCompleted) {
        if (typeof isCompleted === "boolean") return true;
        return false;
    }
}

module.exports = Validator;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('express').Router();
const tasksRoutes = require('./routes');

const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

routes.get("/", (req, res) => {
    res.send("Welcome to Task Manager Application.");
});

routes.use('/tasks', tasksRoutes);

app.listen(PORT, (error) => {
    if (error) {
        console.log("Error starting the server");
    } else {
        console.log("Server running on port", PORT);
    }
})
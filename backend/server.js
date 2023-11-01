// Import necessary modules
const express = require("express");
const cors = require("cors");
const NodePersist = require("node-persist");

// Create an instance of Express
const app = express();

// Set the port for the server
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Enable parsing of JSON data in requests
app.use(express.json());

// Initialize NodePersist for persistent storage
const initNodePersist = async () => {
    // Initialize NodePersist
    await NodePersist.init();
    // Initialize or retrieve the "tasks" data from persistent storage
    await NodePersist.setItem("tasks", []);
};

// Clear persisted data (used in case of process termination)
const clearPersistedData = async () => {
    // Clear the persistent storage
    await NodePersist.clear();
};

// Initialize NodePersist when the server starts
initNodePersist();

// Define a route to handle GET requests for fetching tasks
app.get("/tasks", async (_, res) => {
    // Retrieve the "tasks" data from persistent storage
    const tasks = await NodePersist.getItem("tasks");
    // Respond with the tasks data or an empty array if none
    res.json(tasks || []);
});

// Define a route to handle POST requests for adding tasks
app.post("/tasks", async (req, res) => {
    // Extract the task data from the request body
    const { task } = req.body;
    // Retrieve the current tasks from persistent storage
    let tasks = await NodePersist.getItem("tasks");
    tasks = tasks || [];
    // Add the new task to the tasks array
    tasks.push(task);
    // Update the "tasks" data in persistent storage
    await NodePersist.setItem("tasks", tasks);
    // Respond with a success status
    res.sendStatus(200);
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Handle the SIGINT signal (Ctrl+C) to clear persisted data before exiting
process.on("SIGINT", async () => {
    await clearPersistedData();
    process.exit();
});

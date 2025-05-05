const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();


require('dotenv').config();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to save a project
app.post('/save_project', (req, res) => {
    const projectName = req.body.name;
    const projectData = req.body.data;

    // Load existing projects
    let projects = {};
    if (fs.existsSync('projects.json')) {
        const data = fs.readFileSync('projects.json');
        projects = JSON.parse(data);
    }

    // Save the new project (overwrites if it exists)
    projects[projectName] = projectData;
    fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2));
    res.json({ message: 'Project saved successfully' });
});

// Endpoint to get the list of saved projects
app.get('/get_project_list', (req, res) => {
    if (fs.existsSync('projects.json')) {
        const data = fs.readFileSync('projects.json');
        const projects = JSON.parse(data);
        res.json(Object.keys(projects));
    } else {
        res.json([]);
    }
});

// Endpoint to get data for a specific project
app.get('/get_project_data/:project_name', (req, res) => {
    const projectName = req.params.project_name;
    if (fs.existsSync('projects.json')) {
        const data = fs.readFileSync('projects.json');
        const projects = JSON.parse(data);
        if (projects[projectName]) {
            res.json(projects[projectName]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } else {
        res.status(404).json({ error: 'No projects found' });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
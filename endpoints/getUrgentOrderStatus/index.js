const serverless = require('serverless-http');
const express = require('express');
const app = express();

const initializeDb = require('./db');

app.get('/', async (req, res) => {
  try {
    const db = await initializeDb;
    const projects = await db('project').select('*');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports.handler = serverless(app);

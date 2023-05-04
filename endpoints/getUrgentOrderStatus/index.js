const serverless = require('serverless-http');
const express = require('express');
const app = express();

const db = require('./db');

app.get('/urgentOrderStatus', async (req, res) => {
  try {
    const urgetOrderStatus = await db('onexerp').select('*').from('urgent_order_status');
    res.json(urgetOrderStatus);
  } catch (error) {
    console.error('Error fetching urgetOrderStatus:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports.handler = serverless(app);
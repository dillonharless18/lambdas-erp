const serverless = require("serverless-http");
const express = require("express");
const app = express();

const initializeKnex = require("./db");

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    res.status(500).json({ error: `Server Error, ${error}` });
  }
};

app.get("/", async (req, res) => {
  try {
    await initializeDb();
    const urgentOrderStatus = await knexInstance("onexerp")
      .select("*")
      .from("urgent_order_status");
    res.json(urgentOrderStatus);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: `Server Error, ${error}` });
  }
});

module.exports.handler = serverless(app);

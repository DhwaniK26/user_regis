const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 4001

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Your Next.js app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "awsdb",
//   password: "postgre",
//   port: 5432,
// });

const pool = new Pool({
  connectionString: "postgresql://awsdb_owner:w4Qxu0mBRNKH@ep-super-pond-a5zwae4b.us-east-2.aws.neon.tech/awsdb?sslmode=require",
  ssl: {
    rejectUnauthorized: true, // Needed for some hosted services
  },
});

app.post("/user", async (req, res) => {
  const { firstName, lastName, address, phone, email } = req.body;
  try {
    await pool.query(
      "INSERT INTO myuserdata(first_name, last_name, address, phone, email) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, address, phone, email]
    );
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM myuserdata");
    res.status(200).json(result.rows);  // Directly send the rows array
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log("Server running on port ",PORT));

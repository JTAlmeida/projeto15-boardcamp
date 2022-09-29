import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./database/db.js";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", async (req, res) => {
  try {
    const query = await connection.query('SELECT * FROM teste');


    return res.status(200).send(query.rows[0]);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});


server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

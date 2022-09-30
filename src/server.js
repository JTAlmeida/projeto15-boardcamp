import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./database/db.js";
import routes from "./routers/routes.js";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

server.use(routes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

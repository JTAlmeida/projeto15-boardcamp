import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const { Pool } = pkg;

let connection;
try {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} catch (error) {
  console.error(`Error "${error}" while trying to connect to database.`);
}

export default connection;
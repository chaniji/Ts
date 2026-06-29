import { config } from "dotenv";
import { Pool } from "pg";
config();

type Data = {
  Content: string[],
  StatusCode: number,
}
let d1: Data;

export async function HelloWorld(): Promise<Data> {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    console.log("DB connected");
    const result = await client.query(
      "SELECT content, embedding <-> $1 AS distance FROM items ORDER BY distance LIMIT 1",
      ["[0.1, 0.2, 0.3]"]
    );
    return d1 = {
      Content: result.rows[0],
      StatusCode: 200,
    }

  }
  catch (err) {
    return d1 = {
      Content: ["Error"],
      StatusCode: 404,
    }
  }








}







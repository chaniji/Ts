import { Elysia } from "elysia";
import { HelloWorld } from "./Utilts/PgVector";

export const app = new Elysia();
app.get("/", HelloWorld());




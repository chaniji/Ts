import axios from "axios";
import { app } from "./server"

app.listen(3000);
console.log("App Server Started")
const res = await axios.get("http://localhost:3000/");
console.log(res.data);

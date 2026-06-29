import axios from "axios";

const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

console.log(res.data);

import express from "express";
import router from "./routes";

const app = express();

app.use(express.json());

app.use(router);

// process.on("SIGINT", () => {
//     console.log("")
// });
app.listen(5555, () => console.log("Server running"));
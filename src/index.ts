import express from "express";
import router from "./routes";

const app = express();

// Mount routes
app.use(router);

app.listen(5555, () => console.log("Server running"));
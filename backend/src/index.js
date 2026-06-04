import express from "express";
import cors from "cors";
import { initDatabase } from "./db.js";
import routes from "./routes.js";

initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`TechServ API AV2 em http://localhost:${PORT}`);
});

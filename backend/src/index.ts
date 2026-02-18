import cors from "cors";
import express from "express";
import { fail } from "./http";
import { apiV1Router } from "./routes/api-v1.routes";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.use("/api/v1", apiV1Router);
app.use((_req, res) => fail(res, 404, "NOT_FOUND", "Route not found"));

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
}

export { app };

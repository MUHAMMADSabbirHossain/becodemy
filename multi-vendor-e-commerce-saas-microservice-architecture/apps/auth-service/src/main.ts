import { errorMiddleware } from "./../../../packages/error-handler/error-middleware";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import swageerUi from "swagger-ui-express";
const swaggerDocs = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API." });
});

app.use("/api-docs", swageerUi.serve, swageerUi.setup(swaggerDocs));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocs);
});

// Routes
app.use("/api", router);

app.use(errorMiddleware);

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const server = app.listen(port, host, () => {
  console.log(`Auth service listening at http://${host}:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/docs`);
});

server.on("error", (err) => {
  console.log("Server Error: ", err);
});

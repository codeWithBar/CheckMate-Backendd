import express from "express";
import http from "http";
import "dotenv/config";
import mongoose from "mongoose";
import { logger } from "./loggers/logger";
import homePageRouter from "./routes/home";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import { Server } from "socket.io";
import socketManager from "./socketManager";
import { errorHandler } from "./middlewares/error";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any IP address
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
socketManager(io);

mongoose
  .connect(process.env.DB_URI!)
  .then(() => logger.info(`Connected to ${process.env.DB_URI}`));

app.use(express.json());
app.use("/", homePageRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 5000;
server.listen(port, () => {
  console.log("Server started on http://localhost:" + port);
});

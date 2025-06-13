import express from "express";
import cors from "cors";
import uploadRoute from "./routes/uploadRoute.js";
import testRoute from "./routes/testRoute.js";
import aiRoute from "./routes/aiRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import dotenv from "dotenv";
import dbConnect from "./database/dbConnect.js";
import historyRoute from "./routes/historyRoute.js";
dotenv.config({});
const app = express();
dbConnect();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

app.use("/api/upload", uploadRoute);
app.use("/api/test", testRoute);
app.use("/api/ai", aiRoute);
app.use("/api/user", userRoute);
app.use("/api/history", historyRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

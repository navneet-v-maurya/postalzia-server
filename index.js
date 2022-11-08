import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./Routes/authRoute.js";
import userRoutes from "./Routes/userRoutes.js";
import postRoute from "./Routes/postRoute.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

const URL =
  "mongodb+srv://postalzia:postalzia123@cluster0.ardkonk.mongodb.net/?retryWrites=true&w=majority";
const PORT = 5000;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    app.listen(PORT, () => {
      console.log(`server connected to port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(error);
  });

app.use("/auth", authRoute);
app.use("/user", userRoutes);
app.use("/post", postRoute);

const express = require("express");
const { Connection } = require("./db");
const cors = require("cors");
const {userRouter} = require("./Routes/User.route");
const {courseRouter}= require("./Routes/Course.route");
const { lectureRouter } = require("./Routes/Lecture.route");
const { discussionRouter } = require("./Routes/Discussion.route");
require("dotenv").config();

const app = express();
const Port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/lecture", lectureRouter);
app.use("/discussion", discussionRouter);



app.listen(Port, async () => {
    try {
        await Connection;
        console.log("Connected to DB!");
    } catch (err) {
        console.error("Connection failed!", err);
    }
    console.log(`Server is running at port number ${Port}`);
});

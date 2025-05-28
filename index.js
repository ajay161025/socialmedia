const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

dotenv.config();

mongoose.connect(process.env.MONGO_URL).catch(() => {
    console.log("Something went wrong");
}).then(() => {
    console.log("Connected successfully");
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);








app.listen(8800, () => {
    console.log('backend running');


});


            
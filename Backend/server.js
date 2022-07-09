const express = require('express');
const bodyParser = require('body-parser')
require('express-async-errors')

// importing routes
const userRoutes = require('./Routes/userRoutes');
const taskRoutes = require('./Routes/taskRoutes')

// importing middleware
const errorHandlerMiddleware = require('./Middleware/error-handler');
const authenticateUser = require('./Middleware/auth')

const dotenv = require("dotenv");

// DB connection
const connectDB = require('./DB/connectDB');

//express app
const app = express();

//config dot env
dotenv.config();

//for passing data through http request body
app.use(express.json()); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Server PORT
const PORT = process.env.PORT



// routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/task', authenticateUser,  taskRoutes)


//middleware
app.use(errorHandlerMiddleware)



//if db connection is success, then start the server
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT,()=>{
            console.log(`Server is up and running on port ${PORT}!`);
        });
    } catch (error) {
        console.log(error);
    }
}

// run the server
start()


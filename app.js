const express = require('express');
const dotenv = require('dotenv');
// const cors = require('cors');
const port = process.env.PORT||4000;

const connectDB = require('./db/conn');
dotenv.config({ path: './config/config.env' });

connectDB();

const auth = require('./routes/auth.routes');
const users = require('./routes/user.routes')
const categories = require('./routes/category.routes')
const product = require('./routes/product.routes')
const app = express();
// Express Configurations
app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin:"*",
// }));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
     'Origin,X-Requested-With,Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next()
  });

// Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/category", categories);
app.use("/api/products", product);


app.listen(port, () => {
    console.log(`Connected on ${port} `)
})
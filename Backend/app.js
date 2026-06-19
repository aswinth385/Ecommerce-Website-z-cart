const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');

app.set('query parser', 'extended');
app.use(express.json()); // It is a middleware that accepts JSON data sent from Postman (Body → raw → JSON)
app.use(cookieParser()); // It is a middleware that reads cookies from request headers

const productsRouter = require('./routes/product');
const userRouter = require('./routes/auth');

    app.use('/api/v1',productsRouter);
    app.use("/api/v1", userRouter);

app.use(errorMiddleware);

module.exports = app;
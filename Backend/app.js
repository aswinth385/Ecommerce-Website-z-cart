const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');

app.set('query parser', 'extended');
app.use(express.json()) // It is a middleware that accepts JSON data sent from Postman (Body → raw → JSON)

const productsRouter = require('./routes/product');
const userRouter = require('./routes/auth');

    app.use('/api/v1',productsRouter);
    app.use("/api/v1", userRouter);

app.use(errorMiddleware);

module.exports = app;
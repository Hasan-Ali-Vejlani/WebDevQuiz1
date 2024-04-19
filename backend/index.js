var createError = require('http-errors');
var cors = require('cors')
var express = require('express');
const mongoose = require('mongoose');

var app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));

(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/WebDevQuiz")
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()

const router = require('./routes/index');
app.use('/', router);

app.use(function (req, res, next) {
    next(createError(404));
});

const PORT = 3001;
app.listen(PORT, console.log(`Server running port ${PORT}`));
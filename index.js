var express = require('express');
const cookieParser = require("cookie-parser");
const roomsRouter = require('./routes/rooms.routes')
const db = require('./db')

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/api', roomsRouter);
app.use(cookieParser());

const host = 'localhost';
const port = 3000;

app.get('/', function(req, res) {
    res.render('index')
});


app.get('/book', function(req, res) {
    res.render('book')
});

app.get('/book/error', function(req, res) {
    res.render('book-error')
});

app.get('/book/success', function(req, res) {
    res.render('book-success')

});

app.get('/rooms', function(req, res) {
    try {
        const csrfToken = req.cookies.token
        if (csrfToken !== undefined) {
            let data = {error: false, books: undefined}
            res.render('rooms', data)
        } else {
            let data = {error: false}
            res.render('login', data)
        }
    } catch (e) {
        console.log(e.message)
        let data = {error: false}
        res.render('login', data)
    }
});

app.get('/about', function(req, res) {
    res.render('about')

});

app.listen(port, host,  function(){ console.log("Сервер запущен по адресу http://localhost:3000")});
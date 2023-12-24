var express = require('express');

const roomsRouter = require('./routes/rooms.routes')
const db = require('./db')

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/api', roomsRouter);

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
    let data = {error: false, books: undefined}
    res.render('rooms', data)
});

// app.post('/api/book-room', function(req, res) {
//     const {roomClass, bookStart, bookEnd, firstname, lastname} = req.body
//     const book = db.query('SELECT * FROM rooms')
//
//     console.log(firstname, lastname)
//     res.json(book)
// });

app.get('/about', function(req, res) {
    res.render('about')

});

// const server =  http.createServer(function(request, response){
//     response.end()
// });
//
// const requestListener = function (req, res) {
//     res.setHeader("Content-Type", "text/html");
//     res.writeHead(200);
//     res.end(page/index.ejs);
// };


app.listen(port, host,  function(){ console.log("Сервер запущен по адресу http://localhost:3000")});
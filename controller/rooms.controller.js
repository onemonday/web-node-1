const db = require("../db");
const sha256 = require('js-sha256');
const crypto = require('crypto')
const name_re = /[А-Яа-я \-]/

const pwd_hash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" // password

class RoomsController {
    async bookRoom(req, res) {
        try {
            const {roomClass, bookStart, bookEnd, firstname, lastname} = req.body
            console.log(roomClass, bookStart, bookEnd, firstname, lastname)
            console.log(name_re.test(firstname))
            console.log(name_re.test(lastname))
            if (!name_re.test(firstname) || !name_re.test(lastname)) {
                console.error("XSS protection")
                res.redirect('/book/error')
                return
            }
            const check = await db.query('SELECT id FROM rooms \n' +
                '    WHERE (rooms.room_class = $1) AND (id NOT IN (\n' +
                '        SELECT room_id FROM books\n' +
                '        WHERE ($2 <= books.book_end AND $2 >= books.book_start) OR ($3 <= books.book_end AND $3 >= books.book_start) OR ($2 <= books.book_start AND $3 >= books.book_end) OR (book_start <= $3 AND book_end >= $2)\n' +
                '    ))\n' +
                '    LIMIT 1\n', [roomClass, bookStart, bookEnd])
            console.log(check.rows)
            if (check.rows.length === 0) {
                console.error("length = 0")
                res.redirect('/book/error')
                return
            }

            const book = await db.query('INSERT INTO books (room_id, book_firstname, book_lastname, book_start, book_end)\n' +
                'VALUES ((\n' +
                '    SELECT id FROM rooms \n' +
                '    WHERE (rooms.room_class = $1) AND (id NOT IN (\n' +
                '        SELECT room_id FROM books\n' +
                '        WHERE ($2 <= books.book_end AND $2 >= books.book_start) OR ($3 <= books.book_end AND $3 >= books.book_start) OR ($2 <= books.book_start AND $3 >= books.book_end) OR (book_start <= $3 AND book_end >= $2)\n' +
                '    ))\n' +
                '    LIMIT 1\n' +
                '), $4, $5, $2, $3);', [roomClass, bookStart, bookEnd, firstname, lastname])
            res.redirect('/book/success')
        } catch (e) {
            console.error(e.message)
            res.redirect('/book/error')
        }
    }


    async unbookRoom(req, res) {
        const csrfToken = req.headers.cookie.split("=")[1]
        const {id, book_start, book_end, firstname, lastname} = req.body
        try {
            const token = await db.query('SELECT * from tokens WHERE token = $1 AND ttl > CURRENT_TIMESTAMP', [csrfToken])
            if (token.rows.length === 0) {
                let data = {error: false}
                res.render('login', data)
                return
            }
            const unbook = await db.query('DELETE FROM books WHERE room_id = $1 AND book_start = $2 AND book_end = $3 AND book_firstname = $4 AND book_lastname = $5;', [id, book_start, book_end, firstname, lastname])
        } catch (e) {
            console.log(e.message)
            return
        }
        const books = await db.query('SELECT room_id AS Номер, r.room_class AS Класс, to_char(book_start, \'DD-MM-YYYY\') AS Заезд, to_char(book_end, \'DD-MM-YYYY\') AS Выезд, book_firstname AS Имя, book_lastname AS Фамилия FROM books JOIN rooms r on r.id = books.room_id  WHERE (book_firstname = $1) AND (book_lastname = $2) AND (book_start >= CURRENT_DATE);', [firstname, lastname])
        if (books.length === 0) {
            let data = {error: 'unbooked', books: undefined}
        } else {
            let data = {error: 'unbooked', books: books.rows}
            res.render('rooms', data)
        }
    }

    async upcomingBooks(req, res) {
        const {firstname, lastname} = req.query
        const csrfToken = req.headers.cookie.split("=")[1]
        if (!name_re.test(firstname) || !name_re.test(lastname)) {
            console.error("XSS protection")
            let data = {error: true, books: undefined}
            res.render('rooms', data)
            return
        }

        const token = await db.query('SELECT * from tokens WHERE token = $1 AND ttl > CURRENT_TIMESTAMP', [csrfToken])
        if (token.rows.length === 0) {
            let data = {error: false}
            res.render('login', data)
        } else {
            const books = await db.query('SELECT room_id AS Номер, r.room_class AS Класс, to_char(book_start, \'DD-MM-YYYY\') AS Заезд, to_char(book_end, \'DD-MM-YYYY\') AS Выезд, book_firstname AS Имя, book_lastname AS Фамилия FROM books JOIN rooms r on r.id = books.room_id  WHERE (book_firstname = $1) AND (book_lastname = $2) AND (book_start >= CURRENT_DATE);', [firstname, lastname])
            console.log(books.rows)
            if (books.rows.length === 0) {
                let data = {error: true, books: undefined}
                res.render('rooms', data)
            } else {
                let data = {error: false, books: books.rows}
                res.render('rooms', data)
            }
        }
    }

    async login(req, res) {
        console.log(req.body)
        const {password} = req.body
        if (name_re.test(password)) {
            console.error("XSS protection")
            let data = {error: true}
            res.render('login', data)
            return
        }

        console.log(sha256(password))

        if (sha256(password).toString() === pwd_hash) {
            let csrfToken = crypto.randomUUID()
            console.log(csrfToken)
            const login = await db.query('INSERT INTO tokens (token, ttl) VALUES ($1, CURRENT_TIMESTAMP + interval \'1 hour\');', [csrfToken])
            let data = {error: false, books: undefined}
            res.cookie("token", csrfToken, {secure: true})
            res.render('rooms', data)
        } else {
            let data = {error: true}
            res.render('login', data)
        }

    }

}

module.exports = new RoomsController()
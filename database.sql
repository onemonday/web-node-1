drop table books;
drop table rooms;


create TABLE rooms(
    id INT PRIMARY KEY,
    room_class VARCHAR(10),
    places INTEGER
);

create table tokens(
    id serial primary key,
    token varchar(50),
    ttl timestamp
);

create TABLE books(
    room_id INT,
    book_firstname VARCHAR (30),
    book_lastname VARCHAR (30),
    book_start DATE,
    book_end DATE,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
);

INSERT INTO rooms VALUES
    (1, 'Стандарт', 2),
    (2, 'Стандарт', 3),
    (3, 'Стандарт', 2),
    (4, 'Стандарт', 2),
    (5, 'Комфорт', 3),
    (6, 'Комфорт', 3),
    (7, 'Комфорт', 3),
    (8, 'Люкс', 4);

SELECT room_id
    FROM books JOIN rooms r on r.id = books.room_id
    WHERE (DATE '2023-12-10' < books.book_end AND DATE '2023-12-10' > books.book_start)
       OR (DATE '2023-12-15' < books.book_end AND DATE '2023-12-15' > books.book_start)
       OR (DATE '2023-12-10' < books.book_start AND DATE '2023-12-15' > books.book_end)
       OR (book_start < DATE '2023-12-15' AND book_end > DATE '2023-12-10');

SELECT rooms.id FROM rooms
    WHERE (rooms.room_class = 'Комфорт') AND (id NOT IN (SELECT room_id
                                                    FROM books
                                                    WHERE (DATE '2023-12-10' <= books.book_end AND DATE '2023-12-10' >= books.book_start)
                                                       OR (DATE '2023-12-15' <= books.book_end AND DATE '2023-12-15' >= books.book_start)
                                                       OR (DATE '2023-12-10' <= books.book_start AND DATE '2023-12-15' >= books.book_end)
                                                       OR (book_start <= DATE '2023-12-15' AND book_end >= DATE '2023-12-10')))
    LIMIT 1;

SELECT * FROM rooms;

SELECT rooms.id FROM rooms
    WHERE id NOT IN (SELECT room_id
                    FROM books
                    WHERE (DATE '2023-12-10' < books.book_end AND DATE '2023-12-10' > books.book_start)
                       OR (DATE '2023-12-15' < books.book_end AND DATE '2023-12-15' > books.book_start)
                       OR (DATE '2023-12-10' < books.book_start AND DATE '2023-12-15' > books.book_end)
                       OR (book_start < DATE '2023-12-15' AND book_end > DATE '2023-12-10'));

SELECT room_id FROM books
WHERE rooms.room_class =  AND room_id NOT IN (
    SELECT room_id FROM books
    WHERE ($2 <= books.book_end AND $2 => books.book_start) OR ($3 <= books.book_end AND $3 => books.book_start) OR ($2 <= books.book_start AND $3 => books.book_end) OR (book_start <= $3 AND book_end >= $2)
)
LIMIT 1; [roomClass, bookStart, bookEnd, firstname, lastname]

Проверки на то, что свободные комнаты есть:
1. дата конца брони меньше, чем дата начала следующей брони

SELECT * FROM books
    WHERE (book_firstname = 'Кирилл') AND (book_lastname = 'Дрешпак') AND (book_start >= CURRENT_DATE);

DELETE FROM books;
